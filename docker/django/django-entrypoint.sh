#!/usr/bin/env bash

until cd app
do
    echo "Waiting for django volume..."
done

until python ../manage.py migrate --settings=app.settings_docker
do
    echo "Waiting for postgres ready..."
    sleep 2
done

until python ../manage.py rebuild_index --noinput --settings=app.settings_docker
do
    echo "Waiting for elasticsearch ready..."
    sleep 2
done

python ../manage.py runserver 0.0.0.0:8000 --settings=app.settings_docker
