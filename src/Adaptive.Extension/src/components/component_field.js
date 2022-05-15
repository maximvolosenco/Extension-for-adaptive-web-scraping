export function component_field() {
    var field = document.createElement("div");
    field.classList.add("field");
  
    var inner = document.createElement("div");
    inner.classList.add("inner");
  
    var top = document.createElement("div");
    top.classList.add("top");
    var fieldNameInput = document.createElement("input");
    fieldNameInput.placeholder = "field name";
    fieldNameInput.classList.add(
      "input-field",
      "input-field-placeholder",
      "input-field-field-name"
    );
  
    var pickButton = document.createElement("button");
    pickButton.classList.add("pick-button", "field-name-button", "plain-button");
  
    var resetSelectorButton = document.createElement("button");
    resetSelectorButton.classList.add(
      "reset-selector-button",
      "field-name-button",
      "plain-button"
    );
  
    var deleteFieldButton = document.createElement("button");
    deleteFieldButton.classList.add(
      "delete-field-button",
      "field-name-button",
      "plain-button"
    );
  
    var buttons = document.createElement("div");
    buttons.appendChild(pickButton);
    buttons.appendChild(resetSelectorButton);
    buttons.appendChild(deleteFieldButton);
  
    top.appendChild(fieldNameInput);
    top.appendChild(pickButton);
    top.appendChild(resetSelectorButton);
    top.appendChild(deleteFieldButton);
  
    var xpathInput = document.createElement("input");
    xpathInput.placeholder = "xpath";
    xpathInput.classList.add(
      "input-field",
      "input-field-placeholder",
      "input-field-xpath"
    );
  
    var bottom = document.createElement("div");
    bottom.appendChild(xpathInput);
  
    inner.appendChild(top);
    inner.appendChild(bottom);
  
    field.appendChild(inner);
    return field;
  }
  