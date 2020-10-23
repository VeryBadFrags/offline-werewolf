release/index.html: src/* release/ src/style.css release/qr.png bundle.py
	python3 bundle.py

release/:
	mkdir -p release

src/style.css: src/style.scss
	sass --no-source-map src/style.scss src/style.css

release/qr.png:
	qrencode -s 4 -m 2 -o release/qr.png "https://wolf.verybadfrags.com"

.PHONY: clean

clean:
	rm -rf src/*.css src/*.css.map release/
