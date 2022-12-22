module.exports = class Table {
  constructor(db, tableName) {
    this.db = db;
    this.tableName = tableName;
  }

  selectAll() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM " + this.tableName, (err, rows) => {
        err ? reject(new Error(err)) : resolve(rows);
      });
    });
  }

  select(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM " + this.tableName + " WHERE id = ?",
        id,
        (err, row) => {
          err ? reject(new Error(err)) : resolve(row);
        }
      );
    });
  }

  insert(columnName, text) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO " + this.tableName + "(" + columnName + ")" + " values(?)",
        text,
        (err) => {
          err ? reject(new Error(err)) : resolve();
        }
      );
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "DELETE FROM " + this.tableName + " WHERE id = ?",
        id,
        (err) => {
          err ? reject(new Error(err)) : resolve();
        }
      );
    });
  }

  close() {
    this.db.close;
  }
};
