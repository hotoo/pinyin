THEME = $(HOME)/.spm/themes/arale

build-doc:
	@nico build -C $(THEME)/nico.js

debug:
	@nico server -C $(THEME)/nico.js --watch debug

server:
	@nico server -C $(THEME)/nico.js

watch:
	@nico server -C $(THEME)/nico.js --watch

publish-doc: clean build-doc
	@ghp-import _site
	@git push origin gh-pages

build:
	@spm build

publish:
	@spm publish -s spmjs

clean:
	@rm -fr _site


runner = _site/tests/runner.html
test-src:
	@mocha-browser ${runner} -S
test-dist:
	@mocha-browser ${runner}?dist -S
test: test-src test-dist

output = _site/coverage.html
coverage: build-doc
	@rm -fr _site/src-cov
	@jscoverage --encoding=utf8 src _site/src-cov
	@mocha-browser ${runner}?cov -S -R html-cov > ${output}
	@echo "Build coverage to ${output}"


.PHONY: build-doc publish-doc server clean test coverage
