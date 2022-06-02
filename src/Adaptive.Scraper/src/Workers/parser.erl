-module(parser).

-export([start_link/0, init/1, handle_cast/2, send_message/2]).

start_link() ->
    gen_server:start_link(?MODULE, [], []).

init([]) ->
    Tags = #{},
    MapToSend = #{},
    % io:format("parser:= ~p~n", [self()]),
    {ok, 
            Tags
    }.

send_message(Message, Pid) ->
    gen_server:cast(Pid, Message).

handle_cast({set_parsing_rules, RecievedTags}, _) ->
    Tags = RecievedTags,
    % io:format("Parser PID:= ~p~n",[self()]),
    {noreply, Tags};

handle_cast({send_link, CurrentLink}, Tags) ->
    io:format("CurrentLink:= ~p~n",[CurrentLink]),
    Body = download_web_page(CurrentLink),
    % io:format("Body:= ~p~n",[Tags]),
    % io:format("Keys:= ~p~n",[maps:keys(Tags)]),
    TagsIterator = maps:iterator(Tags),
    MapToSend = extract_data_by_tags(Body, TagsIterator, #{}),
    % batcher:send_message({push_map, MapToSend}),
    % parser_queue:send_message({worker_free, self()}),
    {noreply, Tags}.

extract_data_by_tags(HtmlPage, TagsIterator, MapToSend) when HtmlPage =/= error, TagsIterator =/= none ->
    {Key, BinaryXpath, Iterator} = maps:next(TagsIterator),

    Xpath = binary_to_list(BinaryXpath),
    Tree = mochiweb_html:parse(HtmlPage),
    Data = mochiweb_xpath:execute(Xpath, Tree),
    io:format("Tree:= ~p~n",[HtmlPage]),
    io:format("Xpath:= ~p~n",[Xpath]),
    io:format("Data:= ~p~n",[Data]),
    NewMapToSend = maps:put(Key, Data, MapToSend),
    
    extract_data_by_tags(HtmlPage, Iterator, NewMapToSend);

extract_data_by_tags(_, _, MapToSend) ->
    MapToSend.

download_web_page(Url) ->
    Method = get,
    % URL = "http://localhost:8081/server_get_cache",
    Header = [],
    Type = [], %"application/json",
    % BodyString = "{\"rest\":" ++ HandlerName  ++ "}",
    % Body =  list_to_binary(BodyString),
    HTTPOptions = [],
    Options = [],
    case httpc:request(Method, {Url, Header}, HTTPOptions, Options) of
        {ok, {_,_,Body}}-> 
            % io:format("receive body:~p~n", [Bodys]),
            % Result = start_scraper("<div>", Bodys),
            Body;
        {error, Reason}->
            io:format("error cause ~p~n",[Reason]),
            % exit(normal),
            error
        end.
