dist/index.html: node_modules/ build/index.html dist/ dist/favicon.svg dist/qr.svg package.json
	npm run html-minifier

build/index.html: bundle.js build/ src/index.html build/rules.html build/footer.html build/constants.js build/footer.js build/style.css
	node bundle.js

build/rules.html: node_modules/ build/ src/rules.md package.json
	npm run marked

build/footer.html: node_modules/ build/ src/footer.md package.json
	npm run marked

build/constants.js: node_modules/ src/constants.js package.json
	npm run babel

build/footer.js: node_modules/ src/footer.js package.json
	npm run babel

build/style.css: node_modules/ src/*.scss package.json
	npm run sass

dist/favicon.svg: dist/ assets/wolf-emoji.svg
	cp assets/wolf-emoji.svg dist/favicon.svg

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
