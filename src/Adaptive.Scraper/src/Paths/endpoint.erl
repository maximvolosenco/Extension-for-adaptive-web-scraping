-module(endpoint).

-export([init/2]).
-export([service_available/2, allowed_methods/2, content_types_provided/2, content_types_accepted/2]).
-export([to_json/2, from_json/2]).
init(Req, State) ->
    
    % io:format("~p: ~p~n", ["Request:", Req]),
    % Body = <<"Hello World">>,
    % Reply = cowboy_req:reply(200, #{
    %     <<"content-type">> => <<"text/plain">>
    % }, Body, Req),
    {cowboy_rest, Req, State}.

service_available(Req, State) ->
    % Check if db is up
    % false if not
    {true, Req, State}.

% resource_exists(Req, _State) ->
%     io:format("~p: ~p~n", ["Request:", Req]),
%     case cowboy_req:binding(url, Req) of
%         undefined ->
%             {true, Req, #{index => true}};
%         Url ->
%             {true, Req, #{url => Url}}
%             % and file_exists(QuoteID)
%             % case valid_path(QuoteID) of
%             %     true -> {true, Req, #{quote_id => QuoteID}};
%             %     false -> {false, Req, #{quote_id => QuoteID}}
%             % end
%     end.

allowed_methods(Req, State) ->
    Result = [
        <<"OPTIONS">>, 
        <<"GET">>, <<"HEAD">>,
        <<"POST">>
    ],
    {Result, Req, State}.

content_types_provided(Req, State) ->
    Result = [
        {<<"application/json">>, to_json}
    ],
    {Result, Req, State}.

content_types_accepted(Req, State) ->
    Result = [
        {{<<"application">>, <<"json">>, '*'}, from_json}
    ],
    {Result, Req, State}.

to_json(Req, State) ->
    io:format("~p: ~p~n", ["Request:", Req]),
    Answer = "Byte",
    {useful_functions:json_encode(Answer), Req, State}.

from_json(Req, State) ->
    {ok, Data, _} = cowboy_req:read_body(Req),
    DecodedJson = useful_functions:json_decode(Data),
    #{
        <<"user_id">> := UserId,
        <<"allowed_domains">> := BinaryAllowedDomains,
        <<"start_url">> := BinaryUrl,
        <<"links_to_follow">> := BinaryLinksToFollow,
        <<"links_to_parse">> := BinaryLinksToParse,
        <<"tags">> := BinaryTags
    } = DecodedJson,
    AllowedDomains = binary_to_list(BinaryAllowedDomains),
    StartUrl = binary_to_list(BinaryUrl),
    LinksToFollow = binary_to_list(BinaryLinksToFollow),
    LinksToParse = binary_to_list(BinaryLinksToParse),
    crawler_queue:send_message(
        {
            start_crawling,
            [AllowedDomains, StartUrl, LinksToFollow, LinksToParse]
        }
    ),
    
    parser_queue:send_message(
        {
            setup_rules_parser,
            BinaryTags
        }
    ),

    batcher:send_message({set_user_id, UserId}),
    % crawler:send_message([AllowedDomains, StartUrl, LinksToFollow, LinksToParse], ),
    % As a variant return estimated time to the client because now code 204 is returned
    % Result = {true, <<"url/", Url/binary>>},
    % server:download_web_page(Url),
    {true, Req, State}.