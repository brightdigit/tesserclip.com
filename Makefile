# The front door for every task. Uses `mise exec -- npm` when mise is on PATH
# (Node 24 from .mise.toml); otherwise falls back to whatever npm is on PATH.
NPM := $(if $(shell command -v mise 2>/dev/null),mise exec -- npm,npm)

SCRIPTS := dev build preview lighthouse test check\:links generate\:icons

.PHONY: install clean build-production check-links $(SCRIPTS)

install:
	SHARP_IGNORE_GLOBAL_LIBVIPS=1 $(NPM) install

$(SCRIPTS):
	$(NPM) run $@

# Alias for check:links (D4 name). Run it after `make build`.
check-links:
	$(NPM) run check:links

# What the deploy job runs: config guards are fatal (spec §4).
build-production:
	SITE_DEPLOY=1 $(NPM) run build

clean:
	rm -rf dist .astro public/downloads node_modules/.astro
