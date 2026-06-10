import glob

def bust_cache(file_list):
    for filepath in file_list:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace existing schedule-demo.html links with a cache-busting query parameter
        new_content = content.replace('href="/schedule-demo.html"', 'href="/schedule-demo.html?v=2"')
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated {filepath}')

product_files = glob.glob('products/*.html')
bust_cache(product_files)
print('Done!')
