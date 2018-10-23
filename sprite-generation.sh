sprity create pictures/out pictures/heroes/Seasonal/*.png -e jimp -s seasonal.css
sed -i -- '0,/.icon/s/.icon/.seasonal-hero-icon/; s/sprite.png/seasonal-sprite.png/' pictures/out/seasonal.css
mv pictures/out/sprite.png images/seasonal-sprite.png
sprity create pictures/out pictures/heroes/Limited/*.png -e jimp -s limited.css
sed -i -- '0,/.icon/s/.icon/.limited-hero-icon/; s/sprite.png/limited-sprite.png/' pictures/out/limited.css
mv pictures/out/sprite.png images/limited-sprite.png
sprity create pictures/out pictures/heroes/Star/*.png -e jimp -s star.css
sed -i -- '0,/.icon/s/.icon/.star-hero-icon/; s/sprite.png/star-sprite.png/' pictures/out/star.css
mv pictures/out/sprite.png images/star-sprite.png
sprity create pictures/out pictures/heroes/Standard/*.png -e jimp -s standard.css
sed -i -- '0,/.icon/s/.icon/.hero-icon/; s/sprite.png/standard-sprite.png/' pictures/out/standard.css
mv pictures/out/sprite.png images/standard-sprite.png
mv pictures/out/*.css css