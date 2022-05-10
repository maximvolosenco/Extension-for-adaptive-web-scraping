-module(crawler).

-behaviour(gen_server).

-export([send_message/2, start_link/0, init/1 ,handle_cast/2]).

start_link() ->
    gen_server:start_link(?MODULE, [], []).

init([]) ->
    AllowedDomains = [],
    RegexLinksToFollow = "",
    RegexLinksToParse = "",
    {ok, 
        {
            AllowedDomains, 
            RegexLinksToFollow, 
            RegexLinksToParse
        }
    }.

send_message(Message, Pid) ->
    gen_server:cast(Pid, Message).
    
handle_cast({set_crawling_rules, Message}, _) ->
    [
        AllowedDomains, 
        _ ,
        RegexLinksToFollow, 
        RegexLinksToParse
    ] = Message,
    crawler_queue:send_message({worker_free, self()}),
    {noreply, {AllowedDomains, RegexLinksToFollow, RegexLinksToParse}};

handle_cast({send_link, Link}, {AllowedDomains, RegexLinksToFollow, RegexLinksToParse}) ->
    % io:format("Send Link:= ~p~n",[Message]),
    Body = download_web_page(Link),
    Links = parse_all_links_from_page(Body),
    AllowedDomainsLinks = get_allowed_domains_link(Links, AllowedDomains),
    LinksToFollow = filter_links(AllowedDomainsLinks, RegexLinksToFollow),
    LinksToParse = filter_links(AllowedDomainsLinks, RegexLinksToParse),
    io:format("Links to Follow ~p~n",[LinksToFollow]),
    io:format("Links to Parse ~p~n",[LinksToParse]),
    crawler_queue:send_message({push_link_to_queue, LinksToFollow}),
    {noreply, {AllowedDomains, RegexLinksToFollow, RegexLinksToParse}};

handle_cast(Message, State) ->
    % check_json(EventData, TypeOfPool),
    % io:format(":= ~p~n",[Message]),
    {noreply, State}.

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
            error  
        end.

parse_all_links_from_page(HtmlPage) ->
    Tree = mochiweb_html:parse(HtmlPage),
    Links = mochiweb_xpath:execute("//a/@href", Tree),
    ToBinaryPred = fun(Link) -> binary_to_list(Link) end,
    lists:map(ToBinaryPred, Links).


get_allowed_domains_link(Links, AllowedDomains) ->
    SplitUrlPred = fun(Link) ->
        {_, Netloc, _, _, _} = mochiweb_util:urlsplit(Link), 
        Netloc == AllowedDomains 
    end,
    lists:filter(SplitUrlPred, Links).

filter_links(Links, RegexLinksToFollow) ->
    Pred = fun(Link) -> re:run(Link, RegexLinksToFollow) =/= nomatch end,
    lists:filter(Pred, Links).