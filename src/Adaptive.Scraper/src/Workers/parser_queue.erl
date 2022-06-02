-module(parser_queue).
-behaviour(gen_server).
-export([send_message/1, start_link/0, init/1 ,handle_cast/2]).
% -export([setup_rules/2]).

start_link() ->
    gen_server:start_link({local, parser_queue}, ?MODULE, [], []).

init([]) ->
    QueueOfLinks = [],
    ListChildPids = [],
    {ok, {QueueOfLinks, ListChildPids}}.

send_message(Message) ->
    gen_server:cast(?MODULE, Message).


handle_cast({setup_rules_parser, Tags}, {QueueOfLinks, ListChildPids}) ->
    io:format("Message:= ~p~n",[Tags]),
    NumberOfChildren = length(ListChildPids),
    parser_pool_sup:create_children(NumberOfChildren),
    NewListChildPids = parser_pool_sup:get_all_children(),
    setup_rules(NewListChildPids, Tags),
    % distribute_links_to_workers(NewQueueOfLinks, NewListChildPids), 
    {noreply, {QueueOfLinks, NewListChildPids}};



handle_cast({push_link_to_queue, Links}, {QueueOfLinks, ListChildPids}) ->
    io:format("LinksToParse:= ~p~n",[Links]),
    NewQueueOfLinks = distribute_links_to_workers(Links, ListChildPids),
    % NewQueueOfLinks = lists:append(QueueOfLinks, Links),
    
    {noreply, {NewQueueOfLinks, ListChildPids}}.

distribute_links_to_workers(Links, ListChildPids) when length(ListChildPids) > 0, length(Links) > 0 ->
    [FirstLink | OtherLinks] = Links,
    [FirstChild | OtherChildren] = ListChildPids,
    parser:send_message({send_link, FirstLink}, FirstChild),
    distribute_links_to_workers(OtherLinks, OtherChildren);

distribute_links_to_workers(Links, _) ->
    Links.
    
% handle_cast({worker_free, WorkerPid}, {QueueOfLinks, ListChildPids}) when length(QueueOfLinks) > 1 ->
%     [Link | NewQueueOfLinks] = QueueOfLinks,
%     % Link = lists:last(QueueOfLinks),
%     % NewQueueOfLinks = drop_last_item(QueueOfLinks),
%     crawler:send_message({send_link, Link}, WorkerPid),
%     {noreply, {NewQueueOfLinks, ListChildPids}};

% handle_cast({worker_free, WorkerPid}, {QueueOfLinks, ListChildPids}) when length(QueueOfLinks) == 1 ->
%     [Link | _] = QueueOfLinks,
%     crawler:send_message({send_link, Link}, WorkerPid),
%     % NewQueueOfLinks = drop_last_item(QueueOfLinks),
%     {noreply, {[], ListChildPids}};

% handle_cast({worker_free, WorkerPid}, {QueueOfLinks, ListChildPids}) ->
%     crawler:send_message(wait_for_link, WorkerPid),
%     {noreply, {QueueOfLinks, ListChildPids}};

% handle_cast(Message, State) ->
%     io:format("Message:= ~p~n",[Message]),
%     io:format("State:= ~p~n",[State]),
%     {noreply, State}.

% drop_last_item(QueueOfLinks) when length(QueueOfLinks) > 0 ->
%     lists:droplast(QueueOfLinks);

% drop_last_item(QueueOfLinks) ->
%     [].

% push_to_queue(Message, QueueOfLinks) ->
%     [_, StartUrl, _, _] = Message,
%     [QueueOfLinks, StartUrl].

setup_rules(ListChildPids, Message) when length(ListChildPids) > 0 ->
    [Pid | NewListChildPids] = ListChildPids,
    parser:send_message({set_parsing_rules, Message}, Pid),
    setup_rules(NewListChildPids, Message);

setup_rules(_, _) ->
    ok.