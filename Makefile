dist/index.html: build/index.html dist/ dist/qr.png package.json node_modules/
	npm run html-minifier

build/index.html: bundle.js build/ src/index.html build/rules.html build/footer.html build/constants.js build/footer.js build/style.css
	node bundle.js

build/rules.html: build/ src/rules.md package.json node_modules/
	npm run marked

build/footer.html: build/ src/footer.md package.json node_modules/
	npm run marked

node_modules/:
	npm install

build/constants.js: src/constants.js package.json node_modules/
	npm run babel

build/footer.js: src/footer.js package.json node_modules/
	npm run babel

build/style.css: src/*.scss package.json node_modules/
	npm run sass

build/:
	mkdir -p build

dist/qr.png:  dist/ package.json node_modules/
	npm run qrcode

dist/:
	mkdir -p dist

.PHONY: clean

clean:
	rm -rf build/ dist/ node_modules/ src/*.css src/*.css.map
