-module(server).

-export([process_html/2, download_web_page/1, start_link/0, init/1, start_scraper/5]).


start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

init([]) ->
    {ok, []}.

download_web_page(Url) ->
    Method = get,
    % URL = "http://localhost:8081/server_get_cache",
    Header = [],
    Type = [], %"application/json",
    % BodyString = "{\"rest\":" ++ HandlerName  ++ "}",
    % Body =  list_to_binary(BodyString),
    HTTPOptions = [],
    Options = [],
    case httpc:request(Method, {Url, Header}, HTTPOptions, Options) of
        {ok, {_,_,Bodys}}-> 
            % io:format("receive body:~p~n", [Bodys]),
            Result = start_scraper("<div>", Bodys),
            Bodys;
        {error, Reason}->
            io:format("error cause ~p~n",[Reason]),
            error  
        end.

start_scraper(StartHTMLPage, AllowedDomains, RegExLinksToFollow, RegExLinksToScrape, Xpath) ->

    Tree = mochiweb_html:parse(StartHTMLPage),
    Imgs = mochiweb_xpath:execute("//a/@href", Tree),
    io:format("error cause ~p~n",[Imgs]),
    Tree.

process_html(Url, ListOfTags) ->
    download_web_page(Url).