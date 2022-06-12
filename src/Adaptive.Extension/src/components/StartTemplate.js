import { FieldButtons } from "./FieldButtons";
import { StartTemplateModel } from "./StartTemplateModel";
import {   StartFindXpath } from "./XpathManager";

let minPageLinksToView = 2;
let minParseLinksToView = 3;

let minPageLinksToCount = 2;
let minParseLinksToCount = 3;

let pageLinkIndex = 1;
let parseLinkIndex = 1;

// let temporaryID = 0;

const pageLinksContainer = document.createElement("div");
const parseLinksContainer = document.createElement("div");
const startUrlContainer = document.createElement("div");

export function StartTemplate(handleNextButton) {
  const template = document.createElement("div");
  template.id = "adaptive-tempalte-id";
  template.classList.add("start-template-container");

  const nextButton = document.createElement("button");
  nextButton.classList.add("next-button", "field-name-button", "plain-button");

  nextButton.onclick = function () {
    if (ValidateInput() === true) {
      handleNextButton();
    }
  };
  const startExtractionContainer = document.createElement("div");
  startExtractionContainer.classList.add("start-extraction-container");

  startExtractionContainer.appendChild(nextButton);
  startUrlContainer.classList.add("template-field-container");
  startUrlContainer.appendChild(StartUrlBlock());

  pageLinksContainer.id = "page-links-container";
  pageLinksContainer.classList.add("template-field-container");
  pageLinksContainer.appendChild(PageLinkBlock());

  parseLinksContainer.id = "parse-links-container";
  parseLinksContainer.classList.add("template-field-container");
  parseLinksContainer.appendChild(ParseLinkBlock());

  template.appendChild(startExtractionContainer);
  template.appendChild(startUrlContainer);
  template.appendChild(pageLinksContainer);
  template.appendChild(parseLinksContainer);

  return template;
}

function StartUrlBlock() {
  const startUrlBlock = document.createElement("div");
  startUrlBlock.id = "start-url-id-0";

  const startUrlInput = document.createElement("input");
  startUrlInput.placeholder = "start url";
  startUrlInput.id = "start-url-field-0";
  startUrlInput.classList.add(
    "input-field",
    "input-field-placeholder",
    "input-field-template"
  );
  const getPresentUrlButton = document.createElement("button");
  getPresentUrlButton.classList.add(
    "pick-href-button",
    "field-name-button",
    "plain-button"
  );

  getPresentUrlButton.onclick = function () {
    startUrlInput.value = window.location.href;
    StartTemplateModel.start_url = window.location.href;
  };
  const resetSelectorButton = document.createElement("button");
  resetSelectorButton.classList.add(
    "reset-selector-button",
    "field-name-button",
    "plain-button"
  );

  resetSelectorButton.onclick = function () {
    handleResetSelectorButton(startUrlBlock.id);
  };

  const buttons = document.createElement("div");
  buttons.classList.add("field-buttons-container");

  buttons.appendChild(getPresentUrlButton);
  buttons.appendChild(resetSelectorButton);

  startUrlBlock.appendChild(startUrlInput);
  startUrlBlock.appendChild(buttons);
  return startUrlBlock;
}

function PageLinkBlock() {
  const pageLinkInput = document.createElement("input");
  pageLinkInput.id = "page-link-id-" + pageLinkIndex;
  pageLinkInput.placeholder = "pagination link";
  pageLinkInput.classList.add(
    "input-field",
    "input-field-placeholder",
    "input-field-template"
  );

  const pageLinkBlock = document.createElement("div");
  pageLinkBlock.id = "page-block-id-" + pageLinkIndex;

  const pageLinkButtons = FieldButtons(
    pageLinkBlock.id,
    handlePickButtonPageLink,
    handleResetSelectorButton,
    handleDeleteFieldButtonPageLink
  );

  pageLinkBlock.appendChild(pageLinkInput);
  pageLinkBlock.appendChild(pageLinkButtons);
  pageLinkBlock.appendChild(CountRequiredPageLinks());

  return pageLinkBlock;
}

function ParseLinkBlock() {
  const parseLinkInput = document.createElement("input");
  parseLinkInput.id = "parse-link-id-" + parseLinkIndex;
  parseLinkInput.placeholder = "parse link";
  parseLinkInput.classList.add(
    "input-field",
    "input-field-placeholder",
    "input-field-template"
  );

  const parseLinkBlock = document.createElement("div");
  parseLinkBlock.id = "parse-block-id-" + parseLinkIndex;

  const parseLinkButtons = FieldButtons(
    parseLinkBlock.id,
    handlePickButtonParseLink,
    handleResetSelectorButton,
    handleDeleteFieldButtonParseLink
  );

  parseLinkBlock.appendChild(parseLinkInput);
  parseLinkBlock.appendChild(parseLinkButtons);
  parseLinkBlock.appendChild(CountRequiredParseLinks());

  return parseLinkBlock;
}

function CountRequiredPageLinks() {
  const pageLinkText = document.createTextNode(minPageLinksToView);
  minPageLinksToCount -= 1;
  if (minPageLinksToView !== 0) {
    minPageLinksToView -= 1;
  }
  return pageLinkText;
}

function CountRequiredParseLinks() {
  const parseLinkText = document.createTextNode(minParseLinksToView);
  minParseLinksToCount -= 1;
  if (minParseLinksToView !== 0) {
    minParseLinksToView -= 1;
  }
  return parseLinkText;
}

function handleResetSelectorButton(fieldID) {
  const fieldToReset = document.getElementById(fieldID);

  let input = fieldToReset.querySelector(".input-field-template");
  input.value = "";
}

function handlePickButtonPageLink(fieldID) {
  StartFindXpath(fieldID, "links_to_follow");
  pageLinkIndex += 1;
  pageLinksContainer.appendChild(PageLinkBlock());
}

function handleDeleteFieldButtonPageLink(fieldID) {
  const fieldListChildren = pageLinksContainer.children.length;
  if (fieldListChildren <= 1) {
    return;
  }
  minPageLinksToCount += 1;

  const id = fieldID.charAt(fieldID.length - 1);
  delete StartTemplateModel.links_to_follow["page-link-id-" + id];

  const fieldToRemove = document.getElementById(fieldID);

  pageLinksContainer.removeChild(fieldToRemove);
}

function handlePickButtonParseLink(fieldID) {
  StartFindXpath(fieldID, "links_to_parse");

  parseLinkIndex += 1;
  parseLinksContainer.appendChild(ParseLinkBlock());
}

function handleDeleteFieldButtonParseLink(fieldID) {
  const fieldListChildren = parseLinksContainer.children.length;
  if (fieldListChildren <= 1) {
    return;
  }
  minParseLinksToCount += 1;
  const id = fieldID.charAt(fieldID.length - 1);
  delete StartTemplateModel.links_to_parse["parse-link-id-" + id];
  const fieldToRemove = document.getElementById(fieldID);

  parseLinksContainer.removeChild(fieldToRemove);
}

function ValidateInput() {
  console.log(StartTemplateModel)
  const linksToFollowDict = StartTemplateModel.links_to_follow;
  let linksToFollow = [];

  for (const [key, value] of Object.entries(linksToFollowDict)) {
    console.log(key);
    if (value) {
      linksToFollow.push(value);
    }
  }

  const linksToParseDict = StartTemplateModel.links_to_parse;
  let linksToParse = [];
  for (const [key, value] of Object.entries(linksToParseDict)) {
    console.log(key);
    if (value) {
      linksToParse.push(value);
    }
  }

  if (
    linksToFollow.length < 2 ||
    linksToParse.length < 3 ||
    !StartTemplateModel.start_url
  ) {

    // console.log(linksToFollow.length < 2);
    // console.log(linksToParse.length < 3);
    // console.log(linksToFollow.length);
    // console.log(linksToParse.length);
    // console.log(!StartTemplateModel.start_url);
    // console.log(StartTemplateModel.start_url);


    return false;
  }
  
  console.log(minPageLinksToCount);
  console.log(minParseLinksToCount);
  return true;
}
