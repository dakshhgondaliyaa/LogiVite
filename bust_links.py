import glob
import re

def bust_page_cache(file_list):
    for filepath in file_list:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Add ?v=2 to any /products/link.html
        new_content = re.sub(r'href="(/products/[^"]+\.html)"', r'href="\1?v=2"', content)
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated links in {filepath}')

files_to_update = ['index.html', 'logivite.html', 'includes/navbar.html', 'includes/footer.html']
bust_page_cache(files_to_update)
print('Done!')
