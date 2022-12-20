#! /usr/bin/env node

const Sqlite3 = require("sqlite3");

module.exports = class Memo {
  constructor(filePath) {
    this.sqlite3 = new Sqlite3.Database(filePath);
  }

  selectAll() {
    return new Promise((resolve, reject) => {
      this.sqlite3.all("SELECT * FROM memos", (err, rows) => {
        err ? reject(new Error(err)) : resolve(rows);
      });
    });
  }

  select(id) {
    return new Promise((resolve, reject) => {
      this.sqlite3.get("SELECT * FROM memos WHERE id = ?", id, (err, row) => {
        err ? reject(new Error(err)) : resolve(row);
      });
    });
  }

  insert(text) {
    return new Promise((resolve, reject) => {
      this.sqlite3.run("INSERT INTO memos(text) values(?)", text, (err) => {
        err ? reject(new Error(err)) : resolve();
      });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.sqlite3.run("DELETE FROM memos WHERE id = ?", id, (err) => {
        err ? reject(new Error(err)) : resolve();
      });
    });
  }

  close() {
    this.sqlite3.close;
  }
};
