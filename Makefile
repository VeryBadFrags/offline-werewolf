node = package.json node_modules/

# Generate all the output files
.PHONY: generate
generate: dist/index.html dist/favicon.svg dist/qr.svg
	@echo 'Generated site into: dist/'

# Minify final HTML
dist/index.html: dist/ build/index.html ${node}
	npm run html-minifier

# Bundle all sources into a single HTML page
build/index.html: bundle.js src/index.html build/rules.html build/footer.html build/constants.js build/footer.js build/style.css
	node bundle.js

# Transpile rules.md
build/rules.html: build/ src/rules.md ${node}
	npm run marked

# Transpile footer.md
build/footer.html: build/ src/footer.md ${node}
	npm run marked

# Run constants.js through Babel
build/constants.js: src/constants.js ${node}
	npm run babel

# Run footer.js through Babel
build/footer.js: src/footer.js ${node}
	npm run babel

# Compile Sass
build/style.css: src/*.scss ${node}
	npm run sass

# Add favicon
dist/favicon.svg: dist/ assets/wolf-emoji.svg
	cp assets/wolf-emoji.svg dist/favicon.svg

# Build QR Code
dist/qr.svg: dist/ ${node}
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
