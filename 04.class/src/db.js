#! /usr/bin/env node

const Sqlite3 = require("sqlite3");

module.exports = class DB {
  constructor() {
    this.sqlite3 = new Sqlite3.Database("./db/memo.sqlite3");
  }

  selectAll() {
    return new Promise((resolve, reject) => {
      this.sqlite3.all("SELECT * FROM memos", (err, rows) => {
        if (err) {
          reject(new Error(err));
        }

        resolve(rows);
      });
    });
  }

  select(id) {
    return new Promise((resolve, reject) => {
      this.sqlite3.get("SELECT * FROM memos WHERE id = ?", id, (err, row) => {
        if (err) {
          reject(new Error(err));
        }

        resolve(row);
      });
    });
  }

  insert(text) {
    return new Promise((resolve, reject) => {
      this.sqlite3.run("INSERT INTO memos(text) values(?)", text, (err) => {
        if (err) {
          reject(new Error(err));
        }

        resolve();
      });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.sqlite3.run("DELETE FROM memos WHERE id = ?", id, (err) => {
        if (err) {
          reject(new Error(err));
        }

        resolve();
      });
    });
  }
};
