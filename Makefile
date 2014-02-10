test:
	@node_modules/.bin/mocha -R spec tests/test.js
publish:
	@npm publish


infrequent:
	@node ./tools/infrequent.js > ./tools/zi/infrequent.js
