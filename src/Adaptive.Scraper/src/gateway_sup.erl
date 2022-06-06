%%%-------------------------------------------------------------------
%% @doc gateway top level supervisor.
%% @end
%%%-------------------------------------------------------------------

-module(gateway_sup).

-behaviour(supervisor).

-export([start_link/0]).

-export([init/1]).

-define(SERVER, ?MODULE).

start_link() ->
    supervisor:start_link({local, ?SERVER}, ?MODULE, []).

%% sup_flags() = #{strategy => strategy(),         % optional
%%                 intensity => non_neg_integer(), % optional
%%                 period => pos_integer()}        % optional
%% child_spec() = #{id => child_id(),       % mandatory
%%                  start => mfargs(),      % mandatory
%%                  restart => restart(),   % optional
%%                  shutdown => shutdown(), % optional
%%                  type => worker(),       % optional
%%                  modules => modules()}   % optional
init([]) ->
    MaxRestart = 2,
    MaxTime = 100,
    SupFlags = #{
        strategy => one_for_all,
        intensity => MaxRestart, 
        period => MaxTime
    },

    Server = #{
        id => server,
        start => {server, start_link, []},
        restart => permanent, 
        shutdown => 2000, 
        type => worker,
        modules => [server]
    },

    CrawlerPoolSupervisor = #{
        id => crawler_pool_sup,
        start => {crawler_pool_sup, start_link, [crawler]},
        restart => permanent, 
        shutdown => 2000, 
        type => supervisor,
        modules => [crawler_pool_sup]
    },

    ParserPoolSupervisor = #{
        id => parser_pool_sup,
        start => {parser_pool_sup, start_link, [parser]},
        restart => permanent, 
        shutdown => 2000, 
        type => supervisor,
        modules => [parser_pool_sup]
    },

    CrawlerQueue = #{
        id => crawler_queue,
        start => {crawler_queue, start_link, []},
        restart => permanent, 
        shutdown => 2000, 
        type => worker,
        modules => [crawler_queue]
        },

    ParserQueue = #{
        id => parser_queue,
        start => {parser_queue, start_link, []},
        restart => permanent, 
        shutdown => 2000, 
        type => worker,
        modules => [parser_queue]
    },

    Batcher = #{
        id => batcher,
        start => {batcher, start_link, []},
        restart => permanent, 
        shutdown => 2000, 
        type => worker,
        modules => [batcher]
    },

    Database = #{
        id => database,
        start => {database, start_link, []},
        restart => permanent, 
        shutdown => 2000, 
        type => worker,
        modules => [database]
    },

    ChildSpecs = [
        ParserPoolSupervisor, CrawlerPoolSupervisor, 
        CrawlerQueue, ParserQueue, 
        Batcher, Server],
    {ok, {SupFlags, ChildSpecs}}.

%% internal functions
