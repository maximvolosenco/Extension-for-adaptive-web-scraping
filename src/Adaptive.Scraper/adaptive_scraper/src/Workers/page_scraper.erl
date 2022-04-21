-module(page_scraper).

-export([get_cache/1]).

get_cache(HandlerName) ->
    Method = post,
    URL = "http://localhost:8081/server_get_cache",
    Header = [],
    Type = "application/json",
    BodyString = "{\"rest\":" ++ HandlerName  ++ "}",
    Body =  list_to_binary(BodyString),
    HTTPOptions = [],
    Options = [],
    case httpc:request(Method, {URL, Header, Type, Body}, HTTPOptions, Options) of
        {ok, {_,_,Bodys}}-> 
            io:format("receive body:~p~n", [Bodys]),
            Bodys;
        {error, Reason}->
            io:format("error cause ~p~n",[Reason]),
            error  
        end.