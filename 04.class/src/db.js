const Sqlite3 = require("sqlite3");

module.exports = class DB {
  constructor(filePath) {
    this.sqlite3 = new Sqlite3.Database(filePath);
  }

  selectAll(tableName) {
    return new Promise((resolve, reject) => {
      this.sqlite3.all("SELECT * FROM " + tableName, (err, rows) => {
        err ? reject(new Error(err)) : resolve(rows);
      });
    });
  }

  select(tableName, id) {
    return new Promise((resolve, reject) => {
      this.sqlite3.get(
        "SELECT * FROM " + tableName + " WHERE id = ?",
        id,
        (err, row) => {
          err ? reject(new Error(err)) : resolve(row);
        }
      );
    });
  }

  insert(tableName, columnName, text) {
    return new Promise((resolve, reject) => {
      this.sqlite3.run(
        "INSERT INTO " + tableName + "(" + columnName + ")" + " values(?)",
        text,
        (err) => {
          err ? reject(new Error(err)) : resolve();
        }
      );
    });
  }

  delete(tableName, id) {
    return new Promise((resolve, reject) => {
      this.sqlite3.run(
        "DELETE FROM " + tableName + " WHERE id = ?",
        id,
        (err) => {
          err ? reject(new Error(err)) : resolve();
        }
      );
    });
  }

  close() {
    this.sqlite3.close;
  }
};
