image := hugomods/hugo:exts-0.135.0

all: unai build images

serve:
	hugo serve

build-docker:
	@docker run --rm -v .:/src ${image} hugo --gc -d docs --minify --cleanDestinationDir

build:
	@hugo --gc -d docs --minify --cleanDestinationDir

images:
	@find docs/images -type f -name "*" -exec magick -verbose {} -strip {} \;

unai:
	@find content/ -type f -name "*.md" -exec perl -Mutf8 -CSD -i -pe 's/[\x{200B}-\x{200F}\x{202A}-\x{202E}\x{2060}-\x{206F}\x{FEFF}\x{00AD}]//g; s/\x{00A0}/ /g; s/\x{202F}/ /g' {} +;
