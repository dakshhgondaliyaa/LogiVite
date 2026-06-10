import html.parser
import re

class P(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.t = []
        self.hide = False
    def handle_starttag(self, tag, attrs):
        if tag in ['script', 'style']: self.hide = True
    def handle_endtag(self, tag):
        if tag in ['script', 'style']: self.hide = False
    def handle_data(self, data):
        if not self.hide and data.strip(): self.t.append(data.strip())

with open(r'C:\Users\Daksh\.gemini\antigravity-ide\brain\4d9a478d-43fc-4fe9-a24f-b70eb4c7c0e1\.system_generated\steps\625\content.md', 'r', encoding='utf-8') as f:
    p = P()
    p.feed(f.read())
    with open('scraped_people.txt', 'w', encoding='utf-8') as out:
        out.write('\n'.join(p.t))
