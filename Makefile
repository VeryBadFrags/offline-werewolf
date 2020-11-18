# Generate all the output files
.PHONY: distribute
distribute: dist/index.html dist/favicon.svg dist/qr.svg
	@echo 'Built site into "dist/"'

# Minify final HTML
dist/index.html: node_modules/ dist/ build/index.html package.json
	npm run html-minifier

# Bundle all sources into a single HTML page
build/index.html: node_modules/ bundle.js src/index.html build/rules.html build/footer.html build/constants.js build/footer.js build/style.css
	node bundle.js

# Transpile rules.md
build/rules.html: node_modules/ build/ src/rules.md package.json
	npm run marked

# Transpile footer.md
build/footer.html: node_modules/ build/ src/footer.md package.json
	npm run marked

# Run constants.js through Babel
build/constants.js: node_modules/ src/constants.js package.json
	npm run babel

# Run footer.js through Babel
build/footer.js: node_modules/ src/footer.js package.json
	npm run babel

# Compile Sass
build/style.css: node_modules/ src/*.scss package.json
	npm run sass

# Add favicon
dist/favicon.svg: dist/ assets/wolf-emoji.svg
	cp assets/wolf-emoji.svg dist/favicon.svg

# Build QR code
dist/qr.svg: node_modules/ dist/ package.json
	npm run qrcode

build/:
	mkdir -p build

dist/:
	mkdir -p dist

node_modules/:
	npm install

.PHONY: clean
clean:
	rm -rf build/ dist/ node_modules/ src/*.css src/*.css.map
