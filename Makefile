SRC = src

BUILD = build
DIST = dist

${BUILD}/index.html: snowpack.config.js ${SRC}/* package.json node_modules/
	npm run build

# Standalone site
${DIST}/standalone.html: bundle.js ${BUILD}/index.html ${DIST}
	node bundle.js

# Final output folder
${DIST}:
	mkdir -p ${DIST}

node_modules/: package.json
	npm i --only=prod --no-optional

.PHONY: clean
clean:
	rm -rf ${BUILD}/ ${DIST}/ node_modules/
