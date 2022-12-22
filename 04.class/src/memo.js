const Menu = require("./menu");

module.exports = class Memo {
  constructor(table) {
    this.table = table;
  }

  async create(lines) {
    await this.table.insert("text", lines.join("\n"));
    console.log("\nSaving memo is complete.");
  }

  async showAll() {
    const allMemos = await this.table.selectAll();
    if (!this.#existsMemo(allMemos)) {
      return;
    }

    for (let memo of allMemos) {
      console.log(memo.text.split("\n")[0]);
    }
  }

  async show() {
    const allMemos = await this.table.selectAll();
    if (!this.#existsMemo(allMemos)) {
      return;
    }
    const selectedMemo = await this.#select(allMemos, "see");
    const selectedRow = await this.table.select(selectedMemo.id);
    console.log("\n" + selectedRow.text);
  }

  async delete() {
    const allMemos = await this.table.selectAll();
    if (!this.#existsMemo(allMemos)) {
      return;
    }
    const selectedMemo = await this.#select(allMemos, "delete");
    await this.table.delete(selectedMemo.id);
    console.log("\nDeleting memo is complete.");
  }

  async #select(memos, purpose) {
    const menu = new Menu(memos);
    return await menu.choose("id", purpose);
  }

  #existsMemo(memos) {
    if (memos.length === 0) {
      console.log("memo is empty.");
      return false;
    }

    return true;
  }
};
