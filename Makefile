release/index.html: src/* release/ release/qr.png
	cp src/* release/

release/:
	mkdir -p release

release/qr.png:
	qrencode -s 4 -m 2 -o release/qr.png "https://wolf.verybadfrags.com"

.PHONY: clean

clean:
	rm -rf release/
