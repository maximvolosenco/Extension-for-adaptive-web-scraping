-module(batcher).

-behaviour(gen_server).
-export([send_message/1, start_link/0, init/1 ,handle_cast/2]).

start_link() ->
    gen_server:start_link({local, batcher}, ?MODULE, [], []).

init([]) ->
    % erlang:start_timer(10000, batcher, secondsexpired),
    ListOfMessages = [],
    UserId = 0,
    Count = 0,
    {ok, {ListOfMessages, UserId, Count}}.

send_message(Message) ->
    gen_server:cast(?MODULE, Message).


handle_cast({send_message, RecievedMessage}, {ListOfMessages, UserId, Count}) ->
    % io:format("Data persisted:= ~p~n",[ListOfMessages]),
    NewCount = Count + 1,
    % io:format("Count:= ~p~n",[NewCount]),
    AppendedListOfMessages = collect_messages(RecievedMessage, ListOfMessages),
    UpdatedListOfMessages = send_message_to_server(length(AppendedListOfMessages), 
                                        AppendedListOfMessages, UserId, NewCount),
    {noreply, {UpdatedListOfMessages, UserId, NewCount}};

handle_cast({set_user_id, RecievedUserId}, {ListOfMessages, UserId, Count}) ->
    {noreply, {ListOfMessages, RecievedUserId, Count}}.


collect_messages(Message, ListOfMessages) ->
    % io:format("Message Recieved= ~p~n",[Message]),
    [Message | ListOfMessages].



send_message_to_server(10, ListOfMessages, UserId, 100) ->
    % database:send_message(ListOfMessages),
    send_data_to_client(ListOfMessages, UserId, true),
    [];

send_message_to_server(10, ListOfMessages, UserId, Count) when Count < 100 ->
    % database:send_message(ListOfMessages),
    io:format("MessageNumber:= ~p~n", [Count]),
    % io:format("List Of Message:= ~p~n", [Count]),
    
    send_data_to_client(ListOfMessages, UserId, false),
    [];

send_message_to_server(_, ListOfMessages, _, _)->
    ListOfMessages.

transform_list_to_string(ListOfMessages, StringList) when length(ListOfMessages) > 1 ->
    
    FinalString = lists:map(fun(X) ->
        % io:format("Message:= ~p~n", [X]),
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

send_data_to_client(Messages, UserId, IsFinalPackage) ->
    io:format("Data sent to server:= ~p~n",[Messages]),
    Method = post,
    Url = "https://localhost:7000/Scraper",
    Header = [],
    Type = "application/json",
    % {\"data\":\"useful_functions:json_encode(Messages)\"}
    % BodyString = "{\"rest\":" ++ HandlerName  ++ "}",
    % Body = "{\"data\":\" huiata \"}",
    % transform_list_to_string(Messages, ""),

    Body = useful_functions:json_encode(
        #{
            id => UserId,
            isFinalPackage => IsFinalPackage,
            data => Messages
        }),
    % io:format("Body:= ~p~n",lists:flatten(Messages)),
    HTTPOptions = [],
    Options = [],
    Response = httpc:request(Method, {Url, Header, Type, Body}, HTTPOptions, Options),
    io:format("Response:= ~p~n",[Response]).