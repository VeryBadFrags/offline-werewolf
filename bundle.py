import os
import htmlmin

source_folder = "src/"
build_folder = "build/"
input_html = build_folder + "index.html"
input_css = source_folder + "style.css"

constants_js = build_folder + "constants.js"
footer_js = build_folder + "footer.js"

output_folder = "dist/"
output_path = output_folder + "index.html"

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# Get HTML
html_file = open(input_html, "r")
content = html_file.read()
html_file.close()

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
