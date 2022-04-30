-module(scraper).

-export([start_link/0, init/1]).

start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

init([]) ->
    {ok, []}.