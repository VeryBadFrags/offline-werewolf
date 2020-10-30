# Inputs
source_folder = "src/"
input_html = source_folder + "index.html"
build_folder = "build/"
input_css = build_folder + "style.css"
constants_js = build_folder + "constants.js"
footer_js = build_folder + "footer.js"
rules_path = build_folder + "rules.html"

output_path = build_folder + "index.html"


def inject_file_content(input_path, replacement_tag, destination_content, prefix="", suffix=""):
    input_file = open(input_path, "r")
    output_content = destination_content.replace(
        replacement_tag, prefix + input_file.read() + suffix)
    input_file.close()
    return output_content


# Get HTML
html_file = open(input_html, "r")
output_html = html_file.read()
html_file.close()

# Inject HTML Pages
output_html = inject_file_content(
    rules_path, "<!-- rules.html -->", output_html)

# Inject CSS
output_html = inject_file_content(
    input_css, '<link rel="stylesheet" type="text/css" href="style.css">', output_html, "<style>", "</style>")

# Inject JS
script_open = "<script>"
script_close = "</script>"

# Constants
constants_file = open(constants_js, "r")
js_link = '<script src="constants.js"></script>'
output_html = output_html.replace(
    js_link, script_open + constants_file.read() + script_close)
constants_file.close()

# Footer script
footer_file = open(footer_js, "r")
js_link = '<script src="footer.js"></script>'
output_html = output_html.replace(
    js_link, script_open + footer_file.read() + script_close)
footer_file.close()

# Output content
output_file = open(output_path, "w")
output_file.write(output_html)
output_file.close()

print("Bundled " + input_html + " into " + output_path)
