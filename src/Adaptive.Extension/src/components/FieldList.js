import { FieldButtons } from "./FieldButtons";

let fieldIndex = 1;
const fieldList = document.createElement("div");

export function FieldList() {
  fieldList.id = "field-list";

  fieldList.appendChild(ComponentField());

  return fieldList;
}

function ComponentField() {
  const field = document.createElement("div");
  field.classList.add("field");
  field.id = "field-nr-" + fieldIndex;

  const inner = document.createElement("div");
  inner.classList.add("inner");

  const top = document.createElement("div");
  top.classList.add("top");
  const fieldNameInput = document.createElement("input");
  fieldNameInput.placeholder = "field name";
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
  xpathInput.id = "xpathInput";
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
