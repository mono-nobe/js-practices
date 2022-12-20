const { prompt } = require("enquirer");

module.exports = class CLI {
  constructor(selectItems) {
    this.selectItems = selectItems.map((item) => ({
      name: item.text.split("\n")[0],
      value: item.id,
    }));
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
