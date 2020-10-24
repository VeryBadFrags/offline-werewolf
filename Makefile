dist/index.html: src/* dist/ src/style.css dist/qr.png bundle.py
	python3 bundle.py

dist/:
	mkdir -p dist

src/style.css: src/style.scss
	sass --no-source-map src/style.scss src/style.css

dist/qr.png:
	qrencode -s 4 -m 2 -o dist/qr.png "https://wolf.verybadfrags.com"

.PHONY: clean

clean:
	rm -rf dist/ lib/ node_modules/
