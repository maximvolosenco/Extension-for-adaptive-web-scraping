export function FieldButtons(
    fieldID,
    handlePickButton,
    handleResetSelectorButton,
    handleDeleteFieldButton
  ) {
    const pickButton = document.createElement("button");
    pickButton.classList.add("pick-button", "field-name-button", "plain-button");
    pickButton.onclick = handlePickButton;
  
    const resetSelectorButton = document.createElement("button");
    resetSelectorButton.classList.add(
      "reset-selector-button",
      "field-name-button",
      "plain-button"
    );
  
    resetSelectorButton.onclick = function () {
      handleResetSelectorButton(fieldID);
    };
    const deleteFieldButton = document.createElement("button");
    deleteFieldButton.classList.add(
      "delete-field-button",
      "field-name-button",
      "plain-button"
    );
    deleteFieldButton.onclick = function () {
      handleDeleteFieldButton(fieldID);
    };
  
    const buttons = document.createElement("div");
    buttons.classList.add("field-buttons-container");
    buttons.appendChild(pickButton);
    buttons.appendChild(resetSelectorButton);
    buttons.appendChild(deleteFieldButton);
  
    return buttons;
  }
  