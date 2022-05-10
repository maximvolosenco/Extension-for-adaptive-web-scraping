-module(useful_functions).

-export([get_atom/2]).


get_atom(TypeOfPool, Name) when is_number(Name) ->
    AtomNameInString = atom_to_list(TypeOfPool),
    WorkerNumber = integer_to_list(Name),
    RouterNameInString = string:concat(AtomNameInString, WorkerNumber),
    list_to_atom(RouterNameInString);

get_atom(TypeOfPool, Name) ->
    AtomNameInString = atom_to_list(TypeOfPool),
    RouterNameInString = string:concat(AtomNameInString, Name),
    list_to_atom(RouterNameInString).