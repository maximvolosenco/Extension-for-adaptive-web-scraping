-module(parser_pool_sup).

-behaviour(supervisor).

-export([start_link/1, init/1]).
-export([add_new_child/1, get_all_children/0, remove_one_child/0, create_children/1]).

start_link(TypeOfPool) ->
    % AtomFromString = useful_functions:get_atom(TypeOfPool, "supervisor"),
    {ok, Pid} = supervisor:start_link({local, ?MODULE}, ?MODULE, [TypeOfPool]),
    {ok, Pid}.

init(TypeOfPool) ->
    MaxRestart = 6,
    MaxTime = 100,
    
    SupFlags = #{
        strategy => simple_one_for_one,
		intensity => MaxRestart, 
        period => MaxTime
    },
    
    Parser = #{
        id => parser,
	    start => {parser, start_link, []},
	    restart => permanent, 
        shutdown => 2000,
        type => worker,
	    modules => [parser]
    },
    
    ChildSpecs = [Parser],
    {ok, {SupFlags, ChildSpecs}}.

add_new_child(WorkerId) ->
    supervisor:start_child(?MODULE, []).

remove_one_child() ->
    ChildPIDS = get_all_children(),
    [FirstChild | _ ] = ChildPIDS,
    supervisor:terminate_child(?MODULE, FirstChild).

get_all_children() ->
    ChildrenProcessData = supervisor:which_children(?MODULE),
    lists:map(fun({_, ChildPid, _, _}) -> ChildPid end, ChildrenProcessData).

create_children(CurrentNrOfChildren) when CurrentNrOfChildren < 3 ->
    NewChildPid = CurrentNrOfChildren + 1,
    ChildrenPid = add_new_child(NewChildPid),
    create_children(NewChildPid);

create_children(NrOfChildren) ->
    ok.