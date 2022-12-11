#! /usr/bin/env node

const { prompt } = require("enquirer");

module.exports = class Select {
  constructor(selectItems) {
    this.selectItems = selectItems;
  }

  selectItem(name, action) {
    return new Promise((resolve) => {
      resolve(
        prompt({
          type: "select",
          name: name,
          message: "Choose a note you want to " + action + ":",
          choices: this.selectItems,
          result() {
            return this.focused.value;
          },
        })
      );
    });
  }
};
