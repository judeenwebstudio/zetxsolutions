"""Reconstruct a dark-surface matte from approved pixels. No generated artwork.
Requires Pillow and numpy; not part of the application build.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'public/assets'
source = Image.open(ASSETS / 'zetx-official-blue.webp').convert('RGB')
rgb = np.array(source, dtype=np.float64)
h, w = rgb.shape[:2]
y, x = np.indices((h, w))
# Keep the approved icon's opaque internal whites. Only exterior matte is removed.
icon = (x < 156) & (y < 157)
white = Image.fromarray(np.uint8(np.min(rgb, axis=2) >= 249) * 255).copy()
ImageDraw.floodfill(white, (0, 0), 128, thresh=0)
exterior = np.array(white) == 128
outside = np.uint8(exterior) * 255
edge = (np.array(Image.fromarray(outside).filter(ImageFilter.MaxFilter(9))) > 0) & ~exterior
alpha = np.ones((h, w), dtype=np.float64)
alpha[icon & exterior] = 0
# Unmatte just the icon's boundary; leave all interior artwork/color pixels unchanged.
edge_icon = icon & edge
edge_alpha = np.clip((255 - rgb[:, :, 0]) / 235, 0, 1)
alpha[edge_icon] = edge_alpha[edge_icon]
result = rgb.copy()
partial = edge_icon & (alpha > 0) & (alpha < 1)
result[partial] = np.clip((rgb[partial] - 255 * (1-alpha[partial,None])) / alpha[partial,None], 0, 255)
# Recolor original glyph coverage only. These regions never overlap the icon.
foreground = np.full((h, w), 12.0)
foreground[y >= 177] = 60.0
rules = ((x >= 162) & (x <= 178) & (y < 155)) | ((y >= 161) & (y <= 172))
foreground[rules] = 136
letter_x = (x >= 350) & (y < 96)
foreground[letter_x] = 28
coverage = np.clip((255 - np.min(rgb, axis=2) - 4) / (255 - foreground - 4), 0, 1)
coverage[coverage < 0.035] = 0
alpha[~icon] = coverage[~icon]
result[~icon] = (233,239,255) # Ice Blue: wordmark and original tagline glyphs.
result[(rules | letter_x) & ~icon] = (57,121,246) # Electric Blue: X and rules.
rgba = np.dstack((np.round(result).astype(np.uint8), np.round(alpha*255).astype(np.uint8)))
rgba[rgba[:,:,3] == 0,:3] = 0
output = Image.fromarray(rgba, 'RGBA')
output.save(ASSETS/'zetx-official-dark.webp', lossless=True, method=6)
output.crop((0,0,w,157)).save(ASSETS/'zetx-official-dark-compact.webp', lossless=True, method=6)
# Deterministic checks: clear outer matte, preserved internal white strokes and core blue.
assert output.getpixel((0,0))[3] == 0
for point in [(50,51),(50,110),(30,80),(80,90)]:
    assert output.getpixel(point)[:3] == source.getpixel(point)
    assert output.getpixel(point)[3] == 255
assert np.any((rgba[:,:,3] > 0) & (rgba[:,:,3] < 255))
# Local QA contact sheet at the requested raster zoom scales against Carbon Black.
qa = Image.new('RGB',(1000,1140),(11,13,18))
draw = ImageDraw.Draw(qa)
top = 12
for scale in (1,1.5,2):
    draw.text((20,top),f'{int(scale*100)}% / Carbon Black', fill=(233,239,255))
    resized = output.resize((round(w*scale),round(h*scale)),Image.Resampling.LANCZOS)
    qa.paste(resized,(20,top+23),resized)
    top += round(h*scale)+55
qa_dir = ROOT/'docs/branding'
qa_dir.mkdir(parents=True, exist_ok=True)
qa.save(qa_dir/'v2.3-dark-logo-qa.png')
print('Transparent assets exported; opaque icon details and antialias alpha checks passed.')
