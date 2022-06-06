-module(useful_functions).

-export([get_atom/2, json_encode/1, json_decode/1]).


get_atom(TypeOfPool, Name) when is_number(Name) ->
    AtomNameInString = atom_to_list(TypeOfPool),
    WorkerNumber = integer_to_list(Name),
    RouterNameInString = string:concat(AtomNameInString, WorkerNumber),
    list_to_atom(RouterNameInString);

get_atom(TypeOfPool, Name) ->
    AtomNameInString = atom_to_list(TypeOfPool),
    RouterNameInString = string:concat(AtomNameInString, Name),
    list_to_atom(RouterNameInString).

json_encode(Answer) ->
    jsx:encode(Answer).

json_decode(Data) ->
    jsx:decode(Data).