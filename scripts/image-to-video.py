#!/usr/bin/env python3
"""Turn one still image into a moving 2.5D shot (camera moves inside the photo; near things move more than far ones).

  ~/.i2v-venv/bin/python scripts/image-to-video.py IMAGE OUT.mp4 [--move push] [--dur 5] [--size 1080x1920]
      [--strength 1.0] [--fps 30] [--depth-out depth.png]

Moves: push (dolly in), pull (dolly out), orbit (side to side), rise (camera goes up), pan (left to right),
       kenburns (flat zoom, no depth).
Depth comes from Depth Anything V2 Small (Apache-2.0, downloaded once from Hugging Face, runs on CPU).
Install: scripts/install-i2v
"""
import argparse, subprocess, sys
import numpy as np
import cv2


def depth_map(img_rgb):
    from transformers import pipeline
    from PIL import Image
    pipe = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf", device="cpu")
    d = np.asarray(pipe(Image.fromarray(img_rgb))["depth"], dtype=np.float32)
    d = cv2.resize(d, (img_rgb.shape[1], img_rgb.shape[0]), interpolation=cv2.INTER_CUBIC)
    d = (d - d.min()) / max(1e-6, d.max() - d.min())  # 1 = near
    # Soften edges so the warp does not tear along object outlines.
    return cv2.GaussianBlur(d, (0, 0), sigmaX=max(2, img_rgb.shape[1] / 200))


def cover(img, W, H, margin):
    """Scale to cover W x H plus a margin for the camera to move in."""
    h, w = img.shape[:2]
    s = max(W / w, H / h) * margin
    img = cv2.resize(img, (round(w * s), round(h * s)), interpolation=cv2.INTER_LANCZOS4)
    h, w = img.shape[:2]
    x0, y0 = (w - W) // 2, (h - H) // 2
    return img, x0, y0


def ease(t):
    return t * t * (3 - 2 * t)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("image"); ap.add_argument("out")
    ap.add_argument("--move", default="push", choices=["push", "pull", "orbit", "rise", "pan", "kenburns"])
    ap.add_argument("--dur", type=float, default=5.0)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--size", default="1080x1920")
    ap.add_argument("--strength", type=float, default=1.0, help="parallax amount, 0.5 subtle .. 1.5 strong")
    ap.add_argument("--depth-out")
    a = ap.parse_args()
    W, H = map(int, a.size.split("x"))

    src = cv2.imread(a.image, cv2.IMREAD_COLOR)
    if src is None:
        sys.exit(f"cannot read {a.image}")
    rgb = cv2.cvtColor(src, cv2.COLOR_BGR2RGB)
    big, x0, y0 = cover(rgb, W, H, margin=1.18)
    depth = np.zeros(big.shape[:2], np.float32) if a.move == "kenburns" else depth_map(big)
    if a.depth_out:
        cv2.imwrite(a.depth_out, (depth * 255).astype(np.uint8))

    bh, bw = big.shape[:2]
    gx, gy = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))
    cx, cy = W / 2, H / 2
    k = a.strength * W  # parallax scale in pixels
    n = round(a.dur * a.fps)
    ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                           "-r", str(a.fps), "-i", "-", "-c:v", "libx264", "-crf", "16", "-preset", "medium",
                           "-pix_fmt", "yuv420p", "-movflags", "+faststart", a.out], stdin=subprocess.PIPE)
    for i in range(n):
        t = ease(i / max(1, n - 1))
        s = 2 * t - 1  # -1 .. 1
        # camera: zoom z (all), translation (tx, ty), plus extra zoom/shift for near pixels
        z, tx, ty, pz, px, py = 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
        if a.move == "push":
            z, pz = 0.06 * t, 0.07 * t
        elif a.move == "pull":
            z, pz = 0.06 * (1 - t), 0.07 * (1 - t)
        elif a.move == "orbit":
            z, px = 0.03, 0.035 * s
            tx = -0.02 * s * W
        elif a.move == "rise":
            z, py = 0.03, 0.03 * s
            ty = 0.015 * s * H
        elif a.move == "pan":
            z, px, tx = 0.02, 0.03 * s, -0.05 * s * W
        elif a.move == "kenburns":
            z, tx = 0.08 * t, -0.02 * s * W
        # depth sampled at the output grid position (in big-image coordinates)
        bxg, byg = gx + x0, gy + y0
        d = cv2.remap(depth, bxg, byg, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        scale = 1 + z + pz * d
        mapx = (gx - cx) / scale + cx + x0 - tx - px * k * d
        mapy = (gy - cy) / scale + cy + y0 - ty - py * k * d
        frame = cv2.remap(big, mapx, mapy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        ff.stdin.write(frame.tobytes())
    ff.stdin.close(); ff.wait()
    print(f"saved {a.out}: {n} frames, {a.move}, {W}x{H}")


if __name__ == "__main__":
    main()
