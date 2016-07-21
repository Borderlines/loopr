#!/bin/sh
docker-compose run web ./manage.py flush --noinput
docker-compose run web ./manage.py loaddata tests
./node_modules/protractor/bin/protractor protractor.js --baseUrl=http://localhost:8000
