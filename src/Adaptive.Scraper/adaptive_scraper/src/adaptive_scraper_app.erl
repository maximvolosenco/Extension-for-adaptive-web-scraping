%%%-------------------------------------------------------------------
%% @doc adaptive_scraper public API
%% @end
%%%-------------------------------------------------------------------

-module(adaptive_scraper_app).

-behaviour(application).

-export([start/2, stop/1]).

start(_StartType, _StartArgs) ->
    adaptive_scraper_sup:start_link().

stop(_State) ->
    ok.

%% internal functions
