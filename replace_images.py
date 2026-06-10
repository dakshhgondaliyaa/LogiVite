import os
import re

html_files = []
for root, dirs, files in os.walk('.'):
    if 'products' in root or 'services' in root:
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))

# Regex pattern to match the 3-line placeholder block
pattern = re.compile(
    r'<div style="width:100%; aspect-ratio:4/3; background:var\(--bg-light-alt\); border-radius:var\(--radius-xl\); border:1px solid var\(--border\); display:flex; align-items:center; justify-content:center;">\s*<span class="text-muted font-mono">\[.*?\]</span>\s*</div>',
    re.DOTALL
)

replacement = '<img src="../images/dashboard.png" alt="LogiVite Dashboard Interface" style="width:100%; aspect-ratio:4/3; object-fit:cover; object-position:top; border-radius:var(--radius-xl); border:1px solid var(--border); box-shadow:var(--shadow-lg);">'

for path in html_files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = pattern.sub(replacement, content)
    
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Replaced in {path}")
