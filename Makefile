version = $(shell cat package.json | grep version | awk -F'"' '{print $$4}')

install:
	@spm install
	@npm install

build:
	@spm build

publish: publish-doc
	@spm publish
	@npm publish
	@git tag $(version)
	@git push origin $(version)

build-doc: clean
	@spm doc build

watch:
	@spm doc watch

publish-doc: clean build-doc
	@ghp-import _site
	@git push origin gh-pages
	@spm doc publish

clean:
	@rm -fr _site


runner = _site/tests/runner.html

benchmark:
	@node tests/benchmark.test.js

test-cli:
	@mocha -R spec --timeout 5000 tests/cli.test.js

test-npm:
	@./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha \
		-- \
		--harmony \
		--require should \
		--reporter spec \
		--timeout 2000 \
		--inline-diffs \
		./tests/test.js


test-spm:
	@spm test

lint:
	@./node_modules/eslint/bin/eslint.js ./src/pinyin.js ./tests/

test: lint test-spm test-npm test-cli benchmark

output = _site/coverage.html
coverage: build-doc
	@rm -fr _site/src-cov
	@jscoverage --encoding=utf8 src _site/src-cov
	@mocha-browser ${runner}?cov -S -R html-cov > ${output}
	@echo "Build coverage to ${output}"


ZI_DICT_FREQUENT = ./tools/dict/zi-frequent.js
ZI_DICT_INFREQUENT = ./tools/dict/zi-infrequent.js
ZI_DICT= ./tools/dict/dict-zi.js
ZI_DICT_WEB= ./tools/dict/dict-zi-web.js

dict-web:
	@echo 'module.exports = {'        >  $(ZI_DICT_FREQUENT)
	@node ./tools/robot-frequent.js   >> $(ZI_DICT_FREQUENT)
	@echo '};'                        >> $(ZI_DICT_FREQUENT)
	@echo 'module.exports = {'        >  $(ZI_DICT_INFREQUENT)
	@node ./tools/robot-infrequent.js >> $(ZI_DICT_INFREQUENT)
	@echo '};'                        >> $(ZI_DICT_INFREQUENT)
	@node ./tools/combo-dict.js 			 > $(ZI_DICT_WEB)

dict-node:
	@echo 'var dict = [];'            >  $(ZI_DICT)
	@node ./tools/robot-zdic-zi.js    >> $(ZI_DICT)
	@echo 'module.exports = dict;'    >> $(ZI_DICT)

infrequent:
	@node ./tools/infrequent.js > ./tools/zi/infrequent.js

.PHONY: build-doc publish-doc server clean test coverage test-spm test-npm test-cli lint
