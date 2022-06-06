-module(batcher).

-behaviour(gen_server).
-export([send_message/1, start_link/0, init/1 ,handle_cast/2, handle_info/2]).

start_link() ->
    gen_server:start_link({local, batcher}, ?MODULE, [], []).

init([]) ->
    % erlang:start_timer(10000, batcher, secondsexpired),
    {ok, []}.

send_message(Message) ->
    gen_server:cast(?MODULE, {send_message, Message}).


handle_cast({send_message, RecievedMessage}, ListOfMessages) ->
    io:format("Data persisted:= ~p~n",[ListOfMessages]),
    AppendedListOfMessages = collect_messages(RecievedMessage, ListOfMessages),
    UpdatedListOfMessages = send_message_to_server(length(AppendedListOfMessages), AppendedListOfMessages),
    {noreply, UpdatedListOfMessages}.

handle_info({_, _, secondsexpired}, ListOfMessages) ->
    % send_message_from_timer(ListOfMessages),
    send_data_to_client(ListOfMessages),
    erlang:start_timer(10000, self(), secondsexpired),
    {noreply, []}.

collect_messages(Message, ListOfMessages) ->
    [Message | ListOfMessages].

send_message_to_server(10, ListOfMessages) ->
    % database:send_message(ListOfMessages),
    send_data_to_client(ListOfMessages),
    [];

send_message_to_server(_, ListOfMessages)->
    ListOfMessages.

send_data_to_client(Messages) ->
    io:format("Data sent to server:= ~p~n",[Messages]),
    Method = post,
    Url = "https://localhost:7016/ScrapedData",
    Header = [],
    Type = "application/json",
    % {\"data\":\"useful_functions:json_encode(Messages)\"}
    % BodyString = "{\"rest\":" ++ HandlerName  ++ "}",
    Body = "{\"data\":\" huiata \"}",
    io:format("Body:= ~p~n",[Body]),
    HTTPOptions = [],
    Options = [],
    Response = httpc:request(Method, {Url, Header, Type, Body}, HTTPOptions, Options),
    io:format("Response:= ~p~n",[Response]).
