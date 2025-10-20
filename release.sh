find . -type f -name ".DS_Store" -delete
cd chrome
zip -r chrome.zip . --exclude ".git/*" --exclude "release.sh" --exclude .DS_Store
mv chrome.zip ~/Downloads/labubu-chrome.zip
cd ..
cd firefox
zip -r firefox.zip . --exclude ".git/*" --exclude "release.sh" --exclude .DS_Store
mv firefox.zip ~/Downloads/labubu-firefox.zip