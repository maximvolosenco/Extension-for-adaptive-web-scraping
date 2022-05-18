var skip_class = ['select-tool-bar',
                  'done-select',
                  'button-div',
                  'show-select-xpath',
                  'cancel-select',
                  'input-field'                  
                ]

var selected_elements = []

var xpath_result = ''
var css_result = ''

// function SelectDone() {
//     console.log('msg_to_background:', xpath_result);

//     StopFindXpath()    
// }

export function StartFindXpath(){
    selected_elements = []
    // SideBar()
    DisableLinks()
    window.onmousemove = track_mouse
    window.onmousedown = ChooseElement
}

export function StopFindXpath() {    
    RemoveHighlight('selected')
    RemoveHighlight('hover')
    window.onmousedown = null
    window.onmousemove = null
    EnableLinks()
    var body = document.getElementsByTagName('body')[0]
    var done = document.querySelector('.select-tool-bar')
    body.removeChild(done)
}

function Highlight(element, light_type){
    if (element === null) {
        return
    }
    if (light_type === 'selected') {
        RemoveHighlight('hover')
        element.classList.add('seleted-element-highlight')
    } else if (light_type === 'hover') {
        RemoveHighlight('hover')
        element.classList.add('hovered-element-highlight')
    }
}

function HighlightSelected(css_selector) {
    RemoveHighlight('selected')
    var elements = document.querySelectorAll(css_selector)
    elements.forEach(function(element) {
        element.classList.add('seleted-element-highlight')
    })
}

function DisableLinks() {
    var a_tags = document.getElementsByTagName('a')
    for (var i=0; i<a_tags.length; i++){
        var element = a_tags[i]
        element.onclick = function() {return false}
    }
}

function EnableLinks() {
    var a_tags = document.getElementsByTagName('a')
    for (var i=0; i<a_tags.length; i++){
        var element = a_tags[i]
        element.onclick = null
    }
}

function RemoveHighlight(light_type){
    if (light_type === 'hover') {
        var element = document.querySelector('.hovered-element-highlight')
        if (element) {
            element.classList.remove('hovered-element-highlight')
        }
    } else if (light_type === 'selected') {
        document.querySelectorAll('.seleted-element-highlight').forEach(el => {
        el.classList.remove('seleted-element-highlight')
        })
    }
}

function GetCurrentElement(event){
    var x = event.clientX, y = event.clientY,
        element = document.elementFromPoint(x, y);
    return element
}

function track_mouse(event){
    var elementMouseIsOver = GetCurrentElement(event)
    if (!elementMouseIsOver) {
        return
    }
    var class_name = elementMouseIsOver.className
    if (class_name && skip_class.includes(class_name)) {
        return
    }
    Highlight(elementMouseIsOver, 'hover')
}

function ChooseElement(event) {
    const getXPath = require('get-xpath');
    const csspath = require('cssman');

    var element = GetCurrentElement(event)
    if (!element) {
        return
    }
    var class_name = element.className
    if(class_name && skip_class.includes(class_name)) {
        return
    }
    RemoveHighlight('hover')
    if (selected_elements.length === 0) {
        selected_elements.push(element)
        
        xpath_result = getXPath(element);
        css_result = csspath(element);
    } else {
        css_result = csspath(element);

        if (!element) {
            return
        }
    }
    HighlightSelected(css_result)
    console.log('the merged selector is :', xpath_result)
    var input = document.querySelector('.show-select-xpath')
    input.value = xpath_result
}
