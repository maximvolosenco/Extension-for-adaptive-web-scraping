import { FieldButtons } from "./FieldButtons";
import { StartTemplateModel } from "./StartTemplateModel";

let fieldIndex = 0;
const fieldList = document.createElement("div");

export function FieldList(handleDoneButton) {
  fieldList.id = "field-list";

  const backButton = document.createElement("button");
  backButton.classList.add("back-button", "field-name-button", "plain-button");
  backButton.onclick = function () {};

  const doneButton = document.createElement("button");
  doneButton.classList.add("done-button", "field-name-button", "plain-button");
  doneButton.onclick = function () {
    if (ValidateInput() === true) {
      handleDoneButton();
    }
  };

  const buttons = document.createElement("buttonsContainer");
  buttons.classList.add("buttons-temp");

  const mailInput = document.createElement("input");
  mailInput.placeholder = "mail";
  mailInput.id = "mail-field";
  mailInput.classList.add(
    "input-field",
    "input-field-placeholder",
    "input-field-field-mail"
  );

  buttons.appendChild(backButton);
  buttons.appendChild(doneButton);

  fieldList.classList.add("field-list-temp");
  fieldList.appendChild(buttons);
  fieldList.appendChild(mailInput);
  fieldList.appendChild(ComponentField());

  return fieldList;
}

function ComponentField() {
  StartTemplateModel.tags[fieldIndex] = ["", ""];
  const field = document.createElement("div");
  field.classList.add("field");
  field.id = "field-nr-" + fieldIndex;

  const inner = document.createElement("div");
  inner.classList.add("inner");

  const top = document.createElement("div");
  top.classList.add("top");
  const fieldNameInput = document.createElement("input");
  fieldNameInput.placeholder = "field name";
  fieldNameInput.id = "field-name-" + fieldIndex;
  fieldNameInput.classList.add(
    "input-field",
    "input-field-placeholder",
    "input-field-field-name"
  );

  const buttons = FieldButtons(
    field.id,
    handlePickButton,
    handleResetSelectorButton,
    handleDeleteFieldButton
  );

  top.appendChild(fieldNameInput);
  top.appendChild(buttons);

  const xpathInput = document.createElement("input");
  xpathInput.id = "xpathInput" + fieldIndex;
  xpathInput.placeholder = "xpath";
  xpathInput.classList.add(
    "input-field",
    "input-field-placeholder",
    "input-field-xpath"
  );

  const bottom = document.createElement("div");
  bottom.appendChild(xpathInput);

  inner.appendChild(top);
  inner.appendChild(bottom);

  field.appendChild(inner);
  return field;
}

function handlePickButton() {
  fieldIndex += 1;
  console.log(fieldIndex);
  fieldList.appendChild(ComponentField());
}

function handleDeleteFieldButton(fieldID) {
  const fieldListChildren = fieldList.children.length;
  if (fieldListChildren <= 1) {
    return;
  }
  const fieldToRemove = document.getElementById(fieldID);

  fieldList.removeChild(fieldToRemove);
  console.log("fielndID: " + fieldID);
}

function handleResetSelectorButton(fieldID) {
  const fieldToReset = document.getElementById(fieldID);

  let xpathInput = fieldToReset.querySelector(".input-field-xpath");
  xpathInput.value = "";

  let fieldNameInput = fieldToReset.querySelector(".input-field-field-name");
  fieldNameInput.value = "";
}

function ValidateInput() {
  const tags = StartTemplateModel.tags.reduce((a, [val, key]) => {
    a[val] = key;
    return a;
  }, {});
  console.log(tags);
  console.log(StartTemplateModel);
}
