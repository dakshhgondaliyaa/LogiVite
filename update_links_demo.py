import os
import glob

def replace_in_files(file_list, replacements):
    for filepath in file_list:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for old, new in replacements:
            new_content = new_content.replace(old, new)
            
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated {filepath}')

product_files = glob.glob('products/*.html')
service_files = glob.glob('services/*.html')

replace_in_files(product_files, [
    ('<a href="/contact-us.html" class="btn btn--primary btn--lg hover-lift">Book a Demo</a>', '<a href="/schedule-demo.html" class="btn btn--primary btn--lg hover-lift">Book a Demo</a>'),
    ('<a href="/contact-us.html" class="btn btn--white btn--lg hover-lift">Get Started</a>', '<a href="/schedule-demo.html" class="btn btn--white btn--lg hover-lift">Get Started</a>')
])

replace_in_files(service_files, [
    ('<a href="/contact-us.html" class="btn btn--primary btn--lg hover-lift">Schedule Consultation</a>', '<a href="/schedule-demo.html" class="btn btn--primary btn--lg hover-lift">Schedule Consultation</a>')
])
print('Done!')
