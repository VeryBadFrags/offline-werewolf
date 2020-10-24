import os
import re
import htmlmin

source_folder = "src/"
lib_folder = "lib/"
input_html = lib_folder + "index.html"
input_css = source_folder + "style.css"

constants_js = lib_folder + "constants.js"
footer_js = lib_folder + "footer.js"

output_folder = "dist/"
output_path = output_folder + "index.html"

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# Minify HTML
html_file = open(input_html, "r")

content = re.sub(r'  +', ' ', html_file.read())
html_file.close()

content = htmlmin.minify(content, remove_comments=True, remove_empty_space=True)

# Inject CSS
css_file = open(input_css, "r")
css_link = "<link rel=stylesheet href=style.css>"
content = content.replace(css_link, "<style>" + css_file.read() + "</style>")
css_file.close()

# Inject JS
script_open = "<script>"
script_close = "</script>"

## Constants
constants_file = open(constants_js, "r")
js_link = "<script src=constants.js></script>"
content = content.replace(js_link, script_open + constants_file.read() + script_close)
constants_file.close()

## Footer script
footer_file = open(footer_js, "r")
js_link = "<script src=footer.js></script>"
content = content.replace(js_link, script_open + footer_file.read() + script_close)
footer_file.close()

# Output content

output_file = open(output_path, "w")
output_file.write(content)

output_file.close()

print("Bundled " + source_folder + " into " + output_path)

html_size = os.stat(input_html).st_size
css_size = os.stat(input_css).st_size
constants_size = os.stat(constants_js).st_size
footer_size = os.stat(footer_js).st_size


input_size = html_size + css_size + constants_size + footer_size
print("Input size: " + str(input_size) + "B")
output_size = os.stat(output_path).st_size
print("Output size: " + str(output_size) + "B")
compression_ratio = round((input_size - output_size) / input_size * 100, 1)
print("Compression: " + str(compression_ratio) + "%")
