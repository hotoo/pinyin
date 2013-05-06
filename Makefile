THEME = $(HOME)/.spm/themes/arale

build-doc:
	@nico build -v -C $(THEME)/nico.js

debug:
	@nico server -C $(THEME)/nico.js --watch debug

server:
	@nico server -C $(THEME)/nico.js

watch:
	@nico server -C $(THEME)/nico.js --watch

publish: clean build-doc
	@ghp-import _site
	@git push origin gh-pages

clean:
	@rm -fr _site


reporter = spec
url = tests/runner.html
test:
	@mocha-phantomjs --reporter=${reporter} http://127.0.0.1:8000/${url}

coverage:
	@rm -fr _site/src-cov
	@jscoverage --encoding=utf8 src _site/src-cov
	@$(MAKE) test reporter=json-cov url=tests/runner.html?coverage=1 | node $(THEME)/html-cov.js > tests/coverage.html
	@echo "Build coverage to tests/coverage.html"


.PHONY: build-doc debug server publish clean test coverage

