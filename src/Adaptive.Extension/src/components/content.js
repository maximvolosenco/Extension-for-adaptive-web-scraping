/* eslint-disable */

console.log('start to inject content js')
var skip_class = ['select-tool-bar',
                  'done-select',
                  'show-select-xpath',
                  'cancel-select'
                ]

var selected_elements = []

var xpath_result = ''
var css_result = ''

chrome.runtime.onMessage.addListener(
    function(request, sender) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.command === 'Start') {
            console.log('receive command to trigger...', request)
            start_to_find_xpath()
        }
        return true
    }
)

function highlight(element, light_type){
    if (element === null) {
        return
    }
    if (light_type === 'selected') {
        remove_highlight('hover')
        element.classList.add('seleted-element-highlight')
    } else if (light_type === 'hover') {
        remove_highlight('hover')
        element.classList.add('hovered-element-highlight')
    }
}

function highlight_selected(css_selector) {
    remove_highlight('selected')
    var elements = document.querySelectorAll(css_selector)
    elements.forEach(function(element) {
        element.classList.add('seleted-element-highlight')
    })
}

function disable_links() {
    var a_tags = document.getElementsByTagName('a')
    for (var i=0; i<a_tags.length; i++){
        var element = a_tags[i]
        element.onclick = function() {return false}
    }
}

function enable_links() {
    var a_tags = document.getElementsByTagName('a')
    for (var i=0; i<a_tags.length; i++){
        var element = a_tags[i]
        element.onclick = null
    }
}

function remove_highlight(light_type){
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

function get_current_element(event){
    var x = event.clientX, y = event.clientY,
        element = document.elementFromPoint(x, y);
    return element
}

function track_mouse(event){
    var elementMouseIsOver = get_current_element(event)
    if (!elementMouseIsOver) {
        return
    }
    var class_name = elementMouseIsOver.className
    if (class_name && skip_class.includes(class_name)) {
        return
    }
    highlight(elementMouseIsOver, 'hover')
}

function choose_element(event) {
    const getXPath = require('get-xpath');
    const csspath = require('cssman');

    var element = get_current_element(event)
    if (!element) {
        return
    }
    var class_name = element.className
    if(class_name && skip_class.includes(class_name)) {
        return
    }
    remove_highlight('hover')
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
    highlight_selected(css_result)
    console.log('the merged selector is :', xpath_result)
    var input = document.querySelector('.show-select-xpath')
    input.value = xpath_result
}

function start_to_find_xpath(){
    selected_elements = []
    add_side_bar()
    disable_links()
    window.onmousemove = track_mouse
    window.onmousedown = choose_element
}

function stop_finding_xpath() {    
    remove_highlight('selected')
    remove_highlight('hover')
    window.onmousedown = null
    window.onmousemove = null
    enable_links()
    var body = document.getElementsByTagName('body')[0]
    var done = document.querySelector('.select-tool-bar')
    body.removeChild(done)
}
function select_done() {
    console.log('msg_to_background:', xpath_result)
    stop_finding_xpath()    
}

function add_side_bar() {
    //Add a button in the lower left corner of the web page to refine the red box of the picker
    var done_button = document.createElement('button')
    var text = document.createTextNode('Submit_Test')
    done_button.appendChild(text)
    done_button.onclick = select_done
    done_button.setAttribute('class', 'done-select')

    var input_field = document.createElement('input')
    input_field.setAttribute('class', 'show-select-xpath')
    input_field.setAttribute('type', 'text')

    var cancel_button = document.createElement('button')
    cancel_button.appendChild(document.createTextNode('Cancel_Test'))
    cancel_button.setAttribute('class', 'cancel-select')
    cancel_button.onclick = stop_finding_xpath


    var div = document.createElement('div')
    div.appendChild(input_field)
    div.appendChild(cancel_button)
    div.appendChild(done_button)
    div.setAttribute('class', 'select-tool-bar')
    var body = document.getElementsByTagName('body')[0]
    body.appendChild(div)
}
