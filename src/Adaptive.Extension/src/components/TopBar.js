export function TopBar() {
  const topBar = document.createElement("div");
  topBar.setAttribute("class", "top-bar-controls");

  const buttons = document.createElement("div");
  buttons.setAttribute("class", "top-bar-controls-buttons");

  const featureButtons = document.createElement("div");
  featureButtons.setAttribute("class", "feature-buttons");

  const newTemplateButton = document.createElement("button");
  newTemplateButton.classList.add("new-template-button", "plain-button");

  const showTemplateButton = document.createElement("button");
  showTemplateButton.classList.add("show-templates-button", "plain-button");
  
  const doneButton = document.createElement("button");
  doneButton.classList.add("done-button", "plain-button");

  featureButtons.appendChild(newTemplateButton);
  featureButtons.appendChild(showTemplateButton);
  featureButtons.appendChild(doneButton);

  const closeButton = document.createElement("button");
  closeButton.classList.add("plain-button", "close-button");

  const optionsInfoButton = document.createElement("button");
  optionsInfoButton.classList.add("plain-button", "option-info-button");

  buttons.appendChild(featureButtons);
  buttons.appendChild(optionsInfoButton);
  buttons.appendChild(closeButton);

  topBar.appendChild(buttons);

  const siteDomainContainer = document.createElement("div");
  siteDomainContainer.setAttribute("class", "site-domain-container");

  const siteDomainName = window.location.origin;
  const siteDomainField = document.createTextNode(siteDomainName);
  const siteDomainText = document.createTextNode("Site domain: ");

  siteDomainContainer.appendChild(siteDomainText);
  siteDomainContainer.appendChild(siteDomainField);

  topBar.appendChild(siteDomainContainer);
  return topBar;
}
