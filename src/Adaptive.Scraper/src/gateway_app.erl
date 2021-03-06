%%%-------------------------------------------------------------------
%% @doc gateway public API
%% @end
%%%-------------------------------------------------------------------

-module(gateway_app).

-behaviour(application).

-export([start/2, stop/1]).
 
start(_StartType, _StartArgs) ->
    Routes = [{
        '_',
        [
            {"/send_data", endpoint, [{op, create}]}
        ]
    }],
    Dispatch = cowboy_router:compile(Routes),
    Adress = [{ip, {0,0,0,0}}, {port, 8080}],
    Environment = #{env => #{dispatch => Dispatch}},
    {ok, _} = cowboy:start_clear(my_http_listener,
        Adress, Environment),
    gateway_sup:start_link().

stop(_State) ->
    ok = cowboy:stop_listener(my_http_listener).

%% internal functions