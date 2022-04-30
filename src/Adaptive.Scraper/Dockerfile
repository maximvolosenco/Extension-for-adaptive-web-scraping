FROM erlang:latest

WORKDIR /gateway

COPY rebar.config ./

RUN rebar3 compile

EXPOSE 8080