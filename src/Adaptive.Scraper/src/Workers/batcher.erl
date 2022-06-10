-module(batcher).

-behaviour(gen_server).
-export([send_message/1, start_link/0, init/1 ,handle_cast/2]).

start_link() ->
    gen_server:start_link({local, batcher}, ?MODULE, [], []).

init([]) ->
    % erlang:start_timer(10000, batcher, secondsexpired),
    ListOfMessages = [],
    UserId = 0,
    {ok, {ListOfMessages, UserId}}.

send_message(Message) ->
    gen_server:cast(?MODULE, Message).


handle_cast({send_message, RecievedMessage}, {ListOfMessages, UserId}) ->
    % io:format("Data persisted:= ~p~n",[ListOfMessages]),
    AppendedListOfMessages = collect_messages(RecievedMessage, ListOfMessages),
    UpdatedListOfMessages = send_message_to_server(length(AppendedListOfMessages), 
                                    AppendedListOfMessages, UserId),
    {noreply, {UpdatedListOfMessages, UserId}};

handle_cast({set_user_id, RecievedUserId}, {ListOfMessages, UserId}) ->
    {noreply, {ListOfMessages, RecievedUserId}}.


collect_messages(Message, ListOfMessages) ->
    % io:format("Message Recieved= ~p~n",[Message]),
    [Message | ListOfMessages].

send_message_to_server(10, ListOfMessages, UserId) ->
    % database:send_message(ListOfMessages),
    send_data_to_client(ListOfMessages, UserId),
    [];

send_message_to_server(_, ListOfMessages, _)->
    ListOfMessages.

transform_list_to_string(ListOfMessages, StringList) when length(ListOfMessages) > 1 ->
    
    FinalString = lists:map(fun(X) ->
        io:format("Message:= ~p~n", [X]),
        Json = useful_functions:json_encode(X),
        string:concat(Json, StringList)
    end, 
    ListOfMessages),
    io:format("FinalString:= ~p~n", [FinalString]),
    % [FirstElement, LastElements] = ListOfMessages,
    % NewStringList = string:concat(StringList, FirstElement),
    transform_list_to_string(ListOfMessages, StringList);

transform_list_to_string(ListOfMessages, StringList) ->
    [Element] = ListOfMessages,
    string:concat(Element, StringList).

send_data_to_client(Messages, UserId) ->
    % io:format("Data sent to server:= ~p~n",[Messages]),
    Method = post,
    Url = "https://localhost:44350/Scraper",
    Header = [],
    Type = "application/json",
    % {\"data\":\"useful_functions:json_encode(Messages)\"}
    % BodyString = "{\"rest\":" ++ HandlerName  ++ "}",
    % Body = "{\"data\":\" huiata \"}",
    % transform_list_to_string(Messages, ""),
    Body = useful_functions:json_encode(
        #{
            id => UserId,
            isFinalPackage => false,
            data => Messages
        }),
    % io:format("Body:= ~p~n",lists:flatten(Messages)),
    HTTPOptions = [],
    Options = [],
    Response = httpc:request(Method, {Url, Header, Type, Body}, HTTPOptions, Options),
    io:format("Response:= ~p~n",[Response]).
