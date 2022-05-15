export function top_bar(startUrlInput) {
    var topBar = document.createElement("div");
    topBar.setAttribute("class", "top-bar-controls");
  
    var buttons = document.createElement("div");
    buttons.setAttribute("class", "top-bar-controls-buttons");
  
    var featureButtons = document.createElement("div");
    featureButtons.setAttribute("class", "feature-buttons");
    var newTemplateButton = document.createElement("button");
    newTemplateButton.classList.add("new-template-button", "plain-button");

    var doneButton = document.createElement("button");
    doneButton.classList.add("done-button", "plain-button");
  
    featureButtons.appendChild(newTemplateButton);
    featureButtons.appendChild(doneButton);
  
    var closeButton = document.createElement("button");
    closeButton.classList.add("plain-button", "close-button");
  
    var optionsInfoButton = document.createElement("button");
    optionsInfoButton.classList.add("plain-button", "option-info-button");
  
    buttons.appendChild(featureButtons);
    buttons.appendChild(optionsInfoButton);
    buttons.appendChild(closeButton);
  
    topBar.appendChild(buttons);
  
    var startUrlContainer = document.createElement("div");
    startUrlContainer.setAttribute("class", "start-url-container");
  
    var startUrlField = document.createTextNode(startUrlInput);
    var startUrlText = document.createTextNode("Start url: ");
  
    startUrlContainer.appendChild(startUrlText);
    startUrlContainer.appendChild(startUrlField);
  
    topBar.appendChild(startUrlContainer);
    return topBar;
  }
  