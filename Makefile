image := hugomods/hugo:exts-0.135.0

all: build images

serve:
	hugo serve

build:
	@docker run --rm -v .:/src ${image} hugo --gc -d docs --minify --cleanDestinationDir

images:
	@find docs/images -type f -name "*" -exec magick -verbose {} -strip {} \;
