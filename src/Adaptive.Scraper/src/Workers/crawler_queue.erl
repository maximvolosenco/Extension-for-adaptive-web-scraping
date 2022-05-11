-module(crawler_queue).
-behaviour(gen_server).
-export([send_message/1, start_link/0, init/1 ,handle_cast/2]).
-export([setup_rules/2]).

start_link() ->
    gen_server:start_link({local, crawler_queue}, ?MODULE, [], []).

init([]) ->
    QueueOfLinks = [],
    ListChildPids = [],
    {ok, {QueueOfLinks, ListChildPids}}.

send_message(Message) ->
    gen_server:cast(?MODULE, Message).
    
handle_cast({start_crawling, Message}, {QueueOfLinks, ListChildPids}) ->
    [_, StartUrl, _, _] = Message,
    NewQueueOfLinks = [lists:append(QueueOfLinks, StartUrl)],
    %  = push_to_queue(Message, QueueOfLinks),
    
    NumberOfChildren = length(ListChildPids),
    crawler_pool_sup:create_children(NumberOfChildren),
    NewListChildPids = crawler_pool_sup:get_all_children(),
    setup_rules(NewListChildPids, Message),
    % distribute_links_to_workers(NewQueueOfLinks, NewListChildPids), 
    {noreply, {NewQueueOfLinks, NewListChildPids}};

handle_cast({push_link_to_queue, Links}, {QueueOfLinks, ListChildPids}) ->
    % NewQueueOfLinks = push_to_queue(Links, QueueOfLinks),
    NewQueueOfLinks = lists:append(QueueOfLinks, Links),
    io:format("Obtained Links ~p~n",[NewQueueOfLinks]),
    % Send empty brackets because queue of links becomes empty
    {noreply, {NewQueueOfLinks, ListChildPids}};

handle_cast({worker_free, WorkerPid}, {QueueOfLinks, ListChildPids}) when length(QueueOfLinks) > 1 ->
    [Link | NewQueueOfLinks] = QueueOfLinks,
    % Link = lists:last(QueueOfLinks),
    % NewQueueOfLinks = drop_last_item(QueueOfLinks),
    % io:fwrite(QueueOfLinks),
    crawler:send_message({send_link, Link}, WorkerPid),
    {noreply, {NewQueueOfLinks, ListChildPids}};

handle_cast({worker_free, WorkerPid}, {QueueOfLinks, ListChildPids}) when length(QueueOfLinks) == 1 ->
    [Link | _] = QueueOfLinks,
    crawler:send_message({send_link, Link}, WorkerPid),
    % NewQueueOfLinks = drop_last_item(QueueOfLinks),
    {noreply, {[], ListChildPids}};

handle_cast(Message, State) ->
    io:format("Message:= ~p~n",[Message]),
    io:format("State:= ~p~n",[State]),
    {noreply, State}.

drop_last_item(QueueOfLinks) when length(QueueOfLinks) > 0 ->
    lists:droplast(QueueOfLinks);

drop_last_item(QueueOfLinks) ->
    [].


push_to_queue(Message, QueueOfLinks) ->
    [_, StartUrl, _, _] = Message,
    [QueueOfLinks, StartUrl].

setup_rules(ListChildPids, Message) when length(ListChildPids) > 0 ->
    [Pid | NewListChildPids] = ListChildPids,
    crawler:send_message({set_crawling_rules, Message}, Pid),
    setup_rules(NewListChildPids, Message);

setup_rules(_, _) ->
    ok.

