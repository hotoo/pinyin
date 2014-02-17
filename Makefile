test:
	@node_modules/.bin/mocha -R spec tests/test.js
publish:
	@npm publish

ZI_DICT_FREQUENT = ./tools/dict/zi-frequent.js
ZI_DICT_INFREQUENT = ./tools/dict/zi-infrequent.js
ZI_DICT= ./tools/dict/dict-zi.js

dict-web:
	@echo 'module.exports = {'        >  $(ZI_DICT_FREQUENT)
	@node ./tools/robot-frequent.js   >> $(ZI_DICT_FREQUENT)
	@echo '};'                        >> $(ZI_DICT_FREQUENT)
	@echo 'module.exports = {'        >  $(ZI_DICT_INFREQUENT)
	@node ./tools/robot-infrequent.js >> $(ZI_DICT_INFREQUENT)
	@echo '};'                        >> $(ZI_DICT_INFREQUENT)

dict-node:
	@echo 'var dict = [];'            >  $(ZI_DICT)
	@node ./tools/robot-zdic-zi.js    >> $(ZI_DICT)
	@echo 'module.exports = dict;'    >> $(ZI_DICT)

infrequent:
	@node ./tools/infrequent.js > ./tools/zi/infrequent.js
