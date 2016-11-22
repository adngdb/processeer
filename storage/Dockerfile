FROM kinto/kinto-server

ADD ./conf/kinto.ini /etc/kinto/kinto.ini

ENV PYTHONPATH "/code/;$PYTHONPATH"
ADD ./kinto_github.py /code/kinto_github.py
