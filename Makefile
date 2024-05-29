image := hugomods/hugo:exts-0.126.1

all: libs build images

serve:
	hugo serve

build:
	@docker run --rm -v .:/src ${image} hugo --gc -d docs --minify --cleanDestinationDir

libs:
	@curl -s -o static/js/reaktions.js https://reaktions.rapatao.com/reaktions.js

images:
	@find docs/images -type f -name "*" -exec convert -verbose -strip {} {} \;

sitemaps:
	@curl -s "https://www.google.com/ping\?sitemap\=https://www.rapatao.com/sitemap.xml"
	@curl -s "https://www.google.com/ping\?sitemap\=https://www.rapatao.com/pt/sitemap.xml"
	@curl -s "https://www.google.com/ping\?sitemap\=https://www.rapatao.com/en/sitemap.xml"
