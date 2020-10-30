dist/index.html: build/index.html dist/ dist/qr.png package.json node_modules/
	npm run html-minifier

build/index.html: build/ src/index.html build/rules.html build/constants.js build/footer.js build/style.css bundle.py
	python3 bundle.py

build/rules.html: build/ src/rules.md package.json node_modules/
	npm run marked

node_modules/:
	npm install

build/constants.js: build/ src/constants.js package.json node_modules/
	npm run babel

build/footer.js: build/ src/footer.js package.json node_modules/
	npm run babel

build/style.css: build/ src/*.scss package.json node_modules/
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
