const CLI = require("./cli");

module.exports = class Memo {
  constructor(db) {
    this.db = db;
  }

  async create(lines) {
    await this.db.insert("memos", "text", lines.join("\n"));
    console.log("\nSaving memo is complete.");
  }

  async showAll() {
    const allMemos = await this.db.selectAll("memos");
    if (!this.#existsMemo(allMemos)) {
      return;
    }

    for (let memo of allMemos) {
      console.log(memo.text.split("\n")[0]);
    }
  }

  async show() {
    const allMemos = await this.db.selectAll("memos");
    if (!this.#existsMemo(allMemos)) {
      return;
    }
    const selectedMemo = await this.#select(allMemos, "see");
    const selectedRow = await this.db.select("memos", selectedMemo.id);
    console.log("\n" + selectedRow.text);
  }

  async delete() {
    const allMemos = await this.db.selectAll("memos");
    if (!this.#existsMemo(allMemos)) {
      return;
    }
    const selectedMemo = await this.#select(allMemos, "delete");
    await this.db.delete("memos", selectedMemo.id);
    console.log("\nDeletion is complete.");
  }

  async #select(memos, purpose) {
    const memoCLI = new CLI(memos);
    return await memoCLI.selectItem("id", purpose);
  }

  #existsMemo(memos) {
    if (memos.length === 0) {
      console.log("memo is empty.");
      return false;
    }

    return true;
  }
};
