dist/index.html: node_modules/ build/ build/index.html src/style.css dist/ dist/qr.png src/*
	npm run html-minifier

node_modules/: package.json
	npm install

build/: package.json
	mkdir -p build
	npm run babel

build/index.html: src/index.html bundle.py
	python3 bundle.py

src/style.css: src/style.scss src/style/* package.json
	npm run sass

dist/:
	mkdir -p dist

dist/qr.png: package.json
	npm run qrcode

.PHONY: clean

clean:
	rm -rf dist/ lib/ node_modules/ src/*.css src/*.css.map package-lock.json
