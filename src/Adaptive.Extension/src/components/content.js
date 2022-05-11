/* eslint-disable */

console.log('start to inject content js')

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
    console.log('msg_to_background:', xpath_result);

    // const message_body = {
    //     email: "ameno@gmail.com",
    //     allowedDomains: ["https://999.md/"],
    //     startUrl: "https://999.md/ru/list/transport/cars",
    //     linksToFollow: ["https://999.md/ru/77579423"],
    //     linksToParse: ["https://999.md/ru/77579423"],
    //     tags: {
    //         "ameno1": "ameno2",
    //         "ameno2": "ameno3",
    //     }
    // }
    // send_message_selector_info(message_body);
    
    // console.log(getUserInfo())
    stop_finding_xpath()    
}

function add_side_bar() {
    //Add a button in the lower left corner of the web page to refine the red box of the picker

    

    var modal = document.createElement('div');
    modal.style.top = '0px'
    modal.style.left = '0px'
    modal.setAttribute('class', 'select-tool-bar');

    var title = document.createTextNode('Adaptive');
    
    var div = document.createElement('div')
    div.appendChild(title)

    var allowedDomains = document.createElement('input')
    allowedDomains.setAttribute('class', 'input-field')
    allowedDomains.setAttribute('type', 'text')
    allowedDomains.placeholder = 'Allowed Domains'
    
    var startUrl = document.createElement('input')
    startUrl.setAttribute('class', 'input-field')
    startUrl.setAttribute('type', 'text')
    startUrl.placeholder = 'Start Url'
    
    var linksToFollow = document.createElement('input')
    linksToFollow.setAttribute('class', 'input-field')
    linksToFollow.setAttribute('type', 'text')
    linksToFollow.placeholder = 'Links to follow'
    
    var linksToParse = document.createElement('input')
    linksToParse.setAttribute('class', 'input-field')
    linksToParse.setAttribute('type', 'text')
    linksToParse.placeholder = 'Links to parse'
    
    var elementXpath = document.createElement('input')
    elementXpath.setAttribute('class', 'show-select-xpath')
    elementXpath.setAttribute('type', 'text')
    elementXpath.placeholder = 'element Xpath'
        

    var done_button = document.createElement('button')
    var text = document.createTextNode('Submit')
    done_button.appendChild(text)
    done_button.onclick = select_done
    done_button.setAttribute('class', 'done-select')

    var cancel_button = document.createElement('button')
    cancel_button.appendChild(document.createTextNode('Cancel'))
    cancel_button.setAttribute('class', 'cancel-select')
    cancel_button.onclick = stop_finding_xpath

    var button_div = document.createElement('div');
    button_div.setAttribute('class', 'button-div')
    button_div.appendChild(cancel_button);
    button_div.appendChild(done_button);

    modal.appendChild(div);
    modal.appendChild(allowedDomains)
    modal.appendChild(startUrl)
    modal.appendChild(linksToFollow)
    modal.appendChild(linksToParse)
    modal.appendChild(elementXpath)
    modal.appendChild(button_div)
    // var div = document.createElement('div')
    // div.appendChild(input_field)
    // div.setAttribute('class', 'select-tool-bar')
    var body = document.getElementsByTagName('body')[0]
    body.appendChild(modal)
}


// function send_message_selector_info(message) {
//     chrome.runtime.sendMessage(message)
// }

// let backend = 'https://localhost:7000/Selector'

// function send_message_selector_info(msg) {
//     var options = {
//         method: "post",
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json;charset=UTF-8'
//         },
//         body: JSON.stringify({data: msg})
//     }
//     chrome.storage.sync.get('backend_address', ({backend_address}) => {
//         if (backend_address) {
//             backend = backend_address
//         }
//         console.log('send data to backend: ' + backend)
//         fetch(backend, options)
//          .then(response => response.json())
//          .then(response => {
//              console.log(response)
//          }).catch((err) => {
//              console.log('xxxx', err)
//          })
//     })
// }

// function getUserInfo(){

//     let response = fetch("https://localhost:7000/Selector");

//     if (!response.ok) {
//         let errorMessage = response.text();
//         console.error('Error message: ', errorMessage);

//         return errorMessage;
//    }
//    else {

//         let data =  response.text() ;
//         return data;
//    }
// }
