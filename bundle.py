# Inputs
source_folder = "src/"
input_html_path = source_folder + "index.html"
build_folder = "build/"
rules_path = build_folder + "rules.html"
footer_html_path = build_folder + "footer.html"
input_css_path = build_folder + "style.css"
constants_js_path = build_folder + "constants.js"
footer_js_path = build_folder + "footer.js"

output_path = build_folder + "index.html"


def inject_file_content(input_path, replacement_tag, destination_content, prefix="", suffix=""):
    input_file = open(input_path, "r")
    output_content = destination_content.replace(
        replacement_tag, prefix + input_file.read() + suffix)
    input_file.close()
    return output_content


# Get HTML
html_file = open(input_html_path, "r")
output_html = html_file.read()
html_file.close()

# Inject HTML Pages
output_html = inject_file_content(
    rules_path, "<!-- rules.html -->", output_html)
output_html = inject_file_content(
    footer_html_path, "<!-- footer.html -->", output_html)

# Inject CSS
output_html = inject_file_content(
    input_css_path, '<link rel="stylesheet" type="text/css" href="style.css">', output_html, "<style>", "</style>")

# Inject JS
script_open = "<script>"
script_close = "</script>"

output_html = inject_file_content(
    constants_js_path, '<script src="constants.js"></script>', output_html, script_open, script_close)
output_html = inject_file_content(
    footer_js_path, '<script src="footer.js"></script>', output_html, script_open, script_close)

# Output content
output_file = open(output_path, "w")
output_file.write(output_html)
output_file.close()

print("Bundled " + input_html_path + " into " + output_path)
