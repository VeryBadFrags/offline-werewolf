dist/index.html: node_modules/ build/ build/index.html src/style.css dist/ dist/qr.png bundle.py package.json src/*
	python3 bundle.py

node_modules/:
	npm install

build/:
	mkdir -p build
	npm run babel

build/index.html:
	npm run html-minifier

src/style.css: src/style.scss src/style/
	npm run sass

dist/:
	mkdir -p dist

dist/qr.png:
	npm run qrcode

.PHONY: clean

clean:
	rm -rf dist/ lib/ node_modules/ src/*.css src/*.css.map package-lock.json
