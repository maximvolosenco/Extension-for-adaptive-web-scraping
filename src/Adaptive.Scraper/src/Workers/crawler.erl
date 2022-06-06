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
    % io:format("WorkerPID rules setUP:= ~p~n",[self()]),
    crawler_queue:send_message({worker_free, self()}),
    {noreply, {AllowedDomains, RegexLinksToFollow, RegexLinksToParse}};

handle_cast({send_link, CurrentLink}, {AllowedDomains, RegexLinksToFollow, RegexLinksToParse}) ->
    % io:format("crawler:send_link_recieved:= ~p~n", [CurrentLink]),
    Body = download_web_page(CurrentLink),
    handle_html_body(Body, CurrentLink, AllowedDomains, RegexLinksToFollow, RegexLinksToParse),
    crawler_queue:send_message({worker_free, self()}),
    {noreply, {AllowedDomains, RegexLinksToFollow, RegexLinksToParse}};

handle_cast(wait_for_link, State) ->
    timer:sleep(1000),
    crawler_queue:send_message({worker_free, self()}),
    {noreply, State};

handle_cast(Message, State) ->
    {noreply, State}.

handle_html_body(HtmlPage, CurrentLink , AllowedDomains, RegexLinksToFollow, RegexLinksToParse) when HtmlPage =/= error ->
    Links = parse_all_links_from_page(HtmlPage),
    AbsolutePathLinks = resolve_relative_links(Links, CurrentLink),
    ListWithoutDuplicates = delete_duplicated_links(AbsolutePathLinks),
    % io:format("Links from body:= ~p~n",[ListWithoutDuplicates]),
    AllowedDomainsLinks = get_allowed_domains_link(ListWithoutDuplicates, AllowedDomains),
    LinksToFollow = filter_links(AllowedDomainsLinks, RegexLinksToFollow),
    LinksToParse = filter_links(AllowedDomainsLinks, RegexLinksToParse),
    % io:format("All links ~p~n",[AllowedDomainsLinks]),
    % io:format("Links to Parse ~p~n",[LinksToParse]),
    crawler_queue:send_message({push_link_to_queue, LinksToFollow}),
    parser_queue:send_message({push_link_to_queue, LinksToParse}).

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

resolve_relative_links(Links, CurrentLink) ->
    RelativePathPred = fun(Link) -> re:run(Link, "^http") == nomatch end,
    NonAbsolutePaths = lists:filter(RelativePathPred, Links),
    OriginalAbsolutePaths = filter_links(Links, "^http"),
    PathConstructorPred = fun(Link) -> uri_string:resolve(Link, CurrentLink) end,
    DuplicatedResolvedAbsolutePaths = lists:map(PathConstructorPred, NonAbsolutePaths),
    lists:append(OriginalAbsolutePaths, DuplicatedResolvedAbsolutePaths).

delete_duplicated_links(Links) ->
    RemoveAnchorPred = fun(Link) ->
        {Scheme, Netloc, Path, Query, _} = mochiweb_util:urlsplit(Link),
        mochiweb_util:urlunsplit({Scheme, Netloc, Path, Query, []})
    end,
    LinksWithoutAnchors = lists:map(RemoveAnchorPred, Links),
    SetOfLinks = sets:from_list(LinksWithoutAnchors),
    sets:to_list(SetOfLinks).