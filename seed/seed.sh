set -eu

cd seed

ruby convert.rb

zip data models.csv users.csv
cp categories-i18n.en.txt ../app/translations/en_categories.yml

cd ..

pos-cli data clean --auto-confirm --include-schema
pos-cli deploy
pos-cli data import --path=./seed/data.zip --zip
pos-cli uploads upload --path=seed/images
