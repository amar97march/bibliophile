release: python manage.py migrate
web: gunicorn bibliophile.wsgi --log-file -
celery:celery worker -A bibliophile -l info -c 4