FROM python:3.11-alpine

WORKDIR /app

COPY app /app
COPY run.sh /run.sh

RUN chmod +x /run.sh

EXPOSE 8090

CMD ["/run.sh"]