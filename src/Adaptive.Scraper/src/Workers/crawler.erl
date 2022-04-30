-module(crawler).

-export([start_link/0, init/1, crawl_page/4]).

start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

init([]) ->
    {ok, []}.

crawl_page(StartHTMLPage, AllowedDomains, RegExLinksToFollow, RegExLinksToScrape) ->
     io:format("error cause ~p~n",[Reason]),

