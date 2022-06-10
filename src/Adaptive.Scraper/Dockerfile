FROM erlang:latest

WORKDIR /ADAPTIVE.SCRAPER

COPY rebar.config ./

RUN rebar3 shell

EXPOSE 8080