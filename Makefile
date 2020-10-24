dist/index.html: node_modules/ lib/ src/* src/style.css dist/ dist/qr.png bundle.py
	python3 bundle.py

node_modules/:
	npm install

lib/:
	npm run babel

src/style.css: src/style.scss src/style/
	npm run sass

dist/:
	mkdir -p dist

dist/qr.png:
	qrencode -s 4 -m 2 -o dist/qr.png "https://wolf.verybadfrags.com"

.PHONY: clean

clean:
	rm -rf dist/ lib/ node_modules/ src/*.css src/*.css.map
