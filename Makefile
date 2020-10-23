release/index.html: src/* release/ release/qr.png src/style.css
	cp src/* release/

release/:
	mkdir -p release

release/qr.png:
	qrencode -s 4 -m 2 -o release/qr.png "https://wolf.verybadfrags.com"

src/style.css:
	sass src/style.scss src/style.css

.PHONY: clean

clean:
	rm -rf release/
