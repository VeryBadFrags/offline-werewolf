dist/index.html: build/index.html dist/ dist/favicon.svg dist/qr.svg package.json node_modules/
	npm run html-minifier

build/index.html: bundle.js build/ src/index.html build/rules.html build/footer.html build/constants.js build/footer.js build/style.css
	node bundle.js

build/rules.html: build/ src/rules.md package.json node_modules/
	npm run marked

build/footer.html: build/ src/footer.md package.json node_modules/
	npm run marked

build/constants.js: src/constants.js package.json node_modules/
	npm run babel

build/footer.js: src/footer.js package.json node_modules/
	npm run babel

build/style.css: src/*.scss package.json node_modules/
	npm run sass

dist/favicon.svg: dist/ assets/wolf-emoji.svg
	cp assets/wolf-emoji.svg dist/favicon.svg

dist/qr.svg: dist/ package.json node_modules/
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
