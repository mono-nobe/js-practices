const { prompt } = require("enquirer");

module.exports = class Menu {
  constructor(choices) {
    this.choices = choices.map((item) => ({
      name: item.text.split("\n")[0],
      value: item.id,
    }));
  }

  choose(name, action) {
    return new Promise((resolve) => {
      resolve(
        prompt({
          type: "select",
          name: name,
          message: "Choose a note you want to " + action + ":",
          choices: this.choices,
          result() {
            return this.focused.value;
          },
        })
      );
    });
  }
};
