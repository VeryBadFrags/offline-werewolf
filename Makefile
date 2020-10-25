dist/index.html: build/index.html dist/ dist/qr.png package.json node_modules/
	npm run html-minifier

build/index.html: build/ src/index.html build/constants.js build/footer.js build/style.css bundle.py
	python3 bundle.py

dist/:
	mkdir -p dist

node_modules/: package.json
	npm install

build/constants.js: build/ package.json src/constants.js
	npm run babel

build/footer.js: build/ package.json src/footer.js
	npm run babel

build/style.css: build/ src/*.scss node_modules/ package.json
	npm run sass

build/:
	mkdir -p build

dist/qr.png:  dist/ node_modules/ package.json
	npm run qrcode

.PHONY: clean

clean:
	rm -rf build/ dist/ node_modules/ src/*.css src/*.css.map
