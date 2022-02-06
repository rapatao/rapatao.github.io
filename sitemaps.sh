#! /usr/bin/env sh

echo "notify sitemap update to google"

curl -s http://www.google.com/ping\?sitemap\=https://www.rapatao.com/sitemap.xml
curl -s http://www.google.com/ping\?sitemap\=https://www.rapatao.com/pt/sitemap.xml
curl -s http://www.google.com/ping\?sitemap\=https://www.rapatao.com/en/sitemap.xml
