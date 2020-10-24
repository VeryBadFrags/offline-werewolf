dist/index.html: build/index.html dist/ dist/qr.png package.json node_modules/
	npm run html-minifier

build/index.html: src/index.html build-js build/style.css bundle.py
	python3 bundle.py

dist/:
	mkdir -p dist

node_modules/: package.json
	npm install

build-js: build/ node_modules/ package.json src/*.js
	npm run babel

build/style.css: build/ src/style.scss src/style/* node_modules/ package.json
	npm run sass

build/:
	mkdir -p build

dist/qr.png:  dist/ node_modules/ package.json
	npm run qrcode

.PHONY: clean build-js

clean:
	rm -rf dist/ lib/ node_modules/ src/*.css src/*.css.map package-lock.json
