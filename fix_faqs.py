import re

f = open('d:/vision infotech/LogiVite/faqs.html', 'r', encoding='utf-8')
content = f.read()
f.close()

# Replace the faq wrapper
content = re.sub(
    r'<div class="card card--bordered js-accordion mb-4 hover-border" data-group="faq">\s*<div class="flex--between js-accordion-header" style="cursor:pointer;">\s*<h4 class="text-base font-semibold">',
    '<div class="js-accordion mb-4 hover-border" data-group="faq" style="cursor:pointer; background-color: var(--bg-white); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-4) var(--space-5);">\n                                <div class="flex--between js-accordion-header">\n                                    <h4 class="text-sm font-semibold">',
    content
)

# Fix icon size
content = re.sub(
    r'width="20" height="20"',
    'width="18" height="18"',
    content
)

# Fix answer text
content = re.sub(
    r'<p class="text-sm text-muted mt-4">',
    '<p class="text-xs text-muted mt-3">',
    content
)

# Fix the contact section image and space
content = re.sub(
    r'<img src="images/mobile\.png" alt="LogiVite Mobile App" style="width:100%; height:auto; max-height: 200px; object-fit: contain; background:var\(--bg-light-alt\); border-radius:var\(--radius-lg\);">',
    '<img src="images/dashboard.png" alt="LogiVite Support" style="width:100%; height:auto; object-fit: cover; border-radius:var(--radius-lg); box-shadow: var(--shadow-md);">',
    content
)

f = open('d:/vision infotech/LogiVite/faqs.html', 'w', encoding='utf-8')
f.write(content)
f.close()
