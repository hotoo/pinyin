test:
	@node_modules/.bin/mocha -R spec tests/test.js
publish:
	@npm publish

ZI_DICT = ./tools/dict/zi-frequent.js
dict:
	@echo 'module.exports = {' > $(ZI_DICT)
	@node ./tools/robot.js >> $(ZI_DICT)
	@echo '};' >> $(ZI_DICT)

infrequent:
	@node ./tools/infrequent.js > ./tools/zi/infrequent.js
