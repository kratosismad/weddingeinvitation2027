"""
Regenerates the two location QR codes (SVG + PNG) in assets/qr/.

Usage:   pip install qrcode pillow
         python tools/make_qr.py

To point a QR at an exact pin instead of a search, open the place in Google Maps,
press Share -> Copy link, and paste it into LINKS below.
"""
import os
import qrcode
from PIL import Image

LINKS = {
    "ceremony":  "https://www.google.com/maps/search/?api=1&query=Saint+William%27s+Cathedral%2C+Laoag+City%2C+Ilocos+Norte",
    "reception": "https://www.google.com/maps/search/?api=1&query=Las+Colinas%2C+Suba%2C+Paoay%2C+Ilocos+Norte",
}
DARK, LIGHT = "#5a0f22", "#fbf5ea"      # wine on ivory
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "qr")
os.makedirs(OUT, exist_ok=True)

def build(name, url):
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q, border=0)
    qr.add_data(url); qr.make(fit=True)
    m = qr.get_matrix(); n = len(m); b = 3          # quiet-zone modules
    size = n + 2 * b
    path = "".join(f"M{x+b} {y+b}h1v1h-1z" for y, row in enumerate(m) for x, on in enumerate(row) if on)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" shape-rendering="crispEdges">'
           f'<rect width="{size}" height="{size}" fill="{LIGHT}"/><path d="{path}" fill="{DARK}"/></svg>')
    open(os.path.join(OUT, f"{name}.svg"), "w").write(svg)
    s = 14
    img = Image.new("RGB", (size * s, size * s), LIGHT)
    px = img.load()
    for y, row in enumerate(m):
        for x, on in enumerate(row):
            if on:
                for dy in range(s):
                    for dx in range(s):
                        px[(x + b) * s + dx, (y + b) * s + dy] = tuple(int(DARK[i:i+2], 16) for i in (1, 3, 5))
    img.save(os.path.join(OUT, f"{name}.png"))
    print("wrote", name)

for k, v in LINKS.items():
    build(k, v)
