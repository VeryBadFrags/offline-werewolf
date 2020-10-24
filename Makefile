dist/index.html: node_modules/ lib/ lib/index.html src/* src/style.css dist/ dist/qr.png bundle.py
	python3 bundle.py

node_modules/:
	npm install

lib/:
	npm run babel

src/style.css: src/style.scss src/style/
	npm run sass

dist/:
	mkdir -p dist

lib/index.html:
	npm run html-minifier

dist/qr.png:
	npm run qrcode

.PHONY: clean

clean:
	rm -rf dist/ lib/ node_modules/ src/*.css src/*.css.map package-lock.json
