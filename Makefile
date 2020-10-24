dist/index.html: build/ build/index.html src/style.css dist/ dist/qr.png package.json node_modules/ src/*
	npm run html-minifier

node_modules/: package.json
	npm install

build/: node_modules/ package.json
	npm run babel

build/index.html: src/index.html build/constants.js build/footer.js src/style.css bundle.py
	python3 bundle.py

src/style.css: src/style.scss src/style/* node_modules/ package.json
	npm run sass

dist/:
	mkdir -p dist

dist/qr.png: node_modules/ package.json
	npm run qrcode

.PHONY: clean

clean:
	rm -rf dist/ lib/ node_modules/ src/*.css src/*.css.map package-lock.json
