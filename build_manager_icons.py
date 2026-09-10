#!/usr/bin/env python3
"""Generates the manager-variant PWA icons by selectively hue-shifting the
existing teal icon family to a warm gold accent, leaving the white line art
and the orange badge untouched. Run once (or whenever the base icons
change) — outputs are committed as regular files, this script doesn't run
at build time.
"""
import colorsys
from PIL import Image

ROOT = '/tmp/claude-0/impl'
FILES = ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png']

# Teal hue is ~0.5 (180deg) in this icon set. Only pixels in that hue family,
# with enough saturation to be "the background" rather than a near-white or
# near-black edge, get shifted — the orange badge (~hue 0.06) and white line
# art (near-zero saturation) are left alone automatically by this range.
TEAL_HUE_LO, TEAL_HUE_HI = 0.40, 0.58
MIN_SAT = 0.12
TARGET_HUE = 0.13   # gold/mustard — further from the orange badge's ~0.06 hue than a straight amber would be, for contrast
SAT_SCALE = 0.92    # the teal gradient is fairly saturated; pull back slightly so gold doesn't look neon
VAL_SCALE = 1.35    # the teal gradient is fairly dark; brighten so this doesn't read as muddy brown
VAL_FLOOR = 0.28

def recolor(im):
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            hh, ss, vv = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
            if ss >= MIN_SAT and TEAL_HUE_LO <= hh <= TEAL_HUE_HI:
                vv2 = max(VAL_FLOOR, min(1.0, vv * VAL_SCALE))
                ss2 = max(0.0, min(1.0, ss * SAT_SCALE))
                r2, g2, b2 = colorsys.hsv_to_rgb(TARGET_HUE, ss2, vv2)
                px[x, y] = (int(round(r2 * 255)), int(round(g2 * 255)), int(round(b2 * 255)), a)
    return im

def main():
    for name in FILES:
        src = f'{ROOT}/{name}'
        im = Image.open(src)
        out = recolor(im)
        stem, ext = name.rsplit('.', 1)
        dest = f'{ROOT}/{stem}-manager.{ext}'
        out.save(dest)
        print('Wrote', dest)

if __name__ == '__main__':
    main()
