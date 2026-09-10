#!/usr/bin/env python3
"""Bundles source/markup.html + source/data.js + source/app.js + source/styles.css
into the single self-contained HTML files GitHub Pages actually serves.

This exists so the two installable app shells (index.html for everyone,
manager.html as the manager's separate home-screen icon) can never drift
apart from each other or from source/ — every previous version of this step
was done by hand with an ad hoc Python one-liner, which is exactly how the
Cafe Bistro name mismatch and a couple of stale-file bugs happened. Now
there is exactly one template (source/markup.html) and one script; run this
after editing anything under source/ and both HTML files regenerate
identically except for the manifest/icon/title swap below.

Usage: python3 build.py   (run from the repo root — the folder this file is in)
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / 'source'

def read(name):
    return (SRC / name).read_text()

def build_base_html():
    markup = read('markup.html')
    data_js = read('data.js')
    app_js = read('app.js')
    styles_css = read('styles.css')

    # Inline the two <script src="..."> tags into one <script> block holding
    # data.js followed by app.js, in that order (app.js depends on data.js's
    # globals already being defined).
    script_tag_re = re.compile(r'<script src="data\.js"></script>\s*<script src="app\.js"></script>')
    m = script_tag_re.search(markup)
    if not m:
        sys.exit('build.py: could not find the data.js/app.js <script> tags in source/markup.html')
    merged_js = '<script>\n' + data_js + '\n' + app_js + '\n</script>'
    html = markup[:m.start()] + merged_js + markup[m.end():]

    # Inline the stylesheet <link> into a <style> block.
    link_re = re.compile(r'<link rel="stylesheet" href="styles\.css">')
    m2 = link_re.search(html)
    if not m2:
        sys.exit('build.py: could not find the styles.css <link> tag in source/markup.html')
    html = html[:m2.start()] + ('<style>\n' + styles_css + '\n</style>') + html[m2.end():]
    return html

def variant(html, title, manifest, icon192, icon512, iconMaskable, appleTouch):
    out = html
    out = out.replace('<title>Uzbegim Warehouse</title>', '<title>' + title + '</title>')
    out = out.replace('href="manifest.json"', 'href="' + manifest + '"')
    out = out.replace('href="icon-192.png"', 'href="' + icon192 + '"')
    out = out.replace('href="apple-touch-icon.png"', 'href="' + appleTouch + '"')
    return out

def main():
    base = build_base_html()

    worker_html = variant(base, 'Uzbegim Warehouse', 'manifest.json',
                           'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png')
    (ROOT / 'index.html').write_text(worker_html)

    manager_html = variant(base, 'Uzbegim Manager', 'manifest-manager.json',
                            'icon-192-manager.png', 'icon-512-manager.png', 'icon-maskable-512-manager.png', 'apple-touch-icon-manager.png')
    (ROOT / 'manager.html').write_text(manager_html)

    print('Wrote index.html (%d bytes) and manager.html (%d bytes)' % (len(worker_html), len(manager_html)))

if __name__ == '__main__':
    main()
