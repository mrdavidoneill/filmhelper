# The first instruction is what image we want to base our container on
FROM python:3.9-slim-buster

# set work directory
WORKDIR /usr/src/backend

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
COPY requirements.txt requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# copy project
COPY . .

# Run starting script
RUN chmod +x ./scripts/wait-for-it.sh ./scripts/docker-entrypoint.sh
CMD ["./scripts/docker-entrypoint.sh"]