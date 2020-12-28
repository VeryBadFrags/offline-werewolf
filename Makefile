ASSETS = assets
SRC = src

BUILD = build
DIST = dist

NODE_DEPS = package.json node_modules/

# Generate all the output files
.PHONY: generate
generate: ${DIST}/qr.svg ${DIST}/index.html ${DIST}/favicon.svg
	@echo 'Generated site into: ${DIST}/'

# Minify final HTML
dist/index.html: ${DIST} ${BUILD}/index.html ${NODE_DEPS}
	npm run html-minifier

# Bundle all sources into a single HTML page
${BUILD}/index.html: bundle.js ${SRC}/index.html ${BUILD}/rules.html ${BUILD}/footer.html ${BUILD}/constants.js ${BUILD}/footer.js ${BUILD}/style.css
	node bundle.js

# Transpile rules.md
${BUILD}/rules.html: ${BUILD} ${SRC}/rules.md ${NODE_DEPS}
	npm run marked

# Transpile footer.md
${BUILD}/footer.html: ${BUILD} ${SRC}/footer.md ${NODE_DEPS}
	npm run marked

# Run constants.js through Babel
${BUILD}/constants.js: ${SRC}/constants.js ${NODE_DEPS}
	npm run babel

# Run footer.js through Babel
${BUILD}/footer.js: ${SRC}/footer.js ${NODE_DEPS}
	npm run babel

# Compile Sass
${BUILD}/style.css: ${SRC}/*.scss ${NODE_DEPS}
	npm run sass

# Add favicon
${DIST}/favicon.svg: ${DIST} ${ASSETS}/wolf-emoji.svg
	cp ${ASSETS}/wolf-emoji.svg ${DIST}/favicon.svg

# Generate QR Code - run in background because of missing exit value
${DIST}/qr.svg: ${DIST} ${NODE_DEPS}
	npm run qrcode&

${BUILD}:
	mkdir -p ${BUILD}

${DIST}:
	mkdir -p ${DIST}

node_modules/:
	npm install

.PHONY: clean
clean:
	rm -rf ${BUILD}/ ${DIST}/ node_modules/ ${SRC}/*.css ${SRC}/*.css.map
