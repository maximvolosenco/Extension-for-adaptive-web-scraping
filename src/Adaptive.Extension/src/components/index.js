/* eslint-disable */
import { TopBar } from "./TopBar";
import { FieldList } from "./FieldList";
import { StartTemplate } from "./StartTemplate";
import { StartTemplateModel } from "./StartTemplateModel";
import { ComponentManager } from "./ComponentManager";
import { StartFindXpath, StopFindXpath} from "./XpathManager";

console.log('start to inject content js')

let sideBar = null;

chrome.runtime.onMessage.addListener(
    function(request, sender) {
        // console.log(sender.tab ?
        //     "from a content script:" + sender.tab.url :
        //     "from the extension");
        if (request.command === 'Start') {
            // console.log('receive command to trigger...', request)
            sideBar = SideBar()
            // uncomment to start find xpath
            //start_to_find_xpath()
        }
        return true
    }
)

function SideBar() {

    let sideBar = document.createElement("div");

    sideBar.setAttribute("class", "side-bar");
    sideBar.id = "adaptive-side-bar";
    sideBar.appendChild(TopBar());

    ComponentManager.startTemplate = StartTemplate(handleNextButton);
    sideBar.appendChild(ComponentManager.startTemplate);

    let body = document.getElementsByTagName("body")[0];
    body.appendChild(sideBar);

    handleTemplateListeners();
    // handleFields()
    return sideBar;
}


function handleNextButton() {
    let side_bar_elem = document.getElementById("adaptive-side-bar");
    side_bar_elem.removeChild(ComponentManager.startTemplate);
  
    sideBar.appendChild(FieldList());
    handleFields();
  }
  
function handleTemplateListeners() {
    let startUrlContainer = document.querySelector("#start-url-field-0");

    startUrlContainer.addEventListener("change", function (element) {
        StartTemplateModel.start_url = element.target.value;
    });

    let pageContainer = document.querySelector("#page-links-container");

    pageContainer.addEventListener("change", function (element) {
        if (element.target.classList.contains("input-field-template")) {
        StartTemplateModel.links_to_follow[element.target.id] =
            element.target.value;
        }
    });

    let parseContainer = document.querySelector("#parse-links-container");

    parseContainer.addEventListener("change", function (element) {
        if (element.target.classList.contains("input-field-template")) {
        StartTemplateModel.links_to_parse[element.target.id] =
            element.target.value;
        }
    });
}

function handleFields() {
    let fieldList = document.querySelector("#field-list");
  
    if (fieldList) {
      fieldList.addEventListener("change", function (element) {
        if (element.target.classList.contains("input-field-field-name")) {
          StartTemplateModel.tags[element.target.id.replace(/^\D+/g, "")][0] =
            element.target.value;
        }
      });
      fieldList.addEventListener("change", function (element) {
        if (element.target.classList.contains("input-field-xpath")) {
          StartTemplateModel.tags[element.target.id.replace(/^\D+/g, "")][1] =
            element.target.value;
        }
      });
      fieldList.addEventListener("change", function (element) {
        if (element.target.classList.contains("input-field-field-mail")) {
          StartTemplateModel.email = element.target.value;
        }
      });
    }
  }
