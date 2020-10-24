dist/index.html: node_modules/ lib/ src/* dist/ src/style.css dist/qr.png bundle.py
	npm run build
	python3 bundle.py

node_modules/:
	npm install

lib/:
	npm run build

dist/:
	mkdir -p dist

src/style.css: src/style.scss
	sass --no-source-map src/style.scss src/style.css

dist/qr.png:
	qrencode -s 4 -m 2 -o dist/qr.png "https://wolf.verybadfrags.com"

.PHONY: clean

clean:
	rm -rf dist/ lib/ node_modules/
