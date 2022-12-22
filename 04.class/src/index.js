#! /usr/bin/env node

const Table = require("./table");
const Memo = require("./memo");
const Minimist = require("minimist");
const Readline = require("readline");
const Sqlite3 = require("sqlite3");

async function main() {
  const sqlite3 = new Sqlite3.Database("./db/memo.sqlite3");
  const memoTable = new Table(sqlite3, "memos");
  const memo = new Memo(memoTable);
  const argv = Minimist(process.argv.slice(2));

  if (!process.stdin.isTTY) {
    const lines = await readStdin();
    await memo.create(lines);
  }

  if (argv.l) {
    await memo.showAll();
  } else if (argv.r) {
    await memo.show();
  } else if (argv.d) {
    await memo.delete();
  }

  sqlite3.close();
}

function readStdin() {
  return new Promise((resolve) => {
    const lines = [];
    const reader = Readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    reader.on("line", (line) => {
      lines.push(line);
    });

    reader.on("close", () => {
      resolve(lines);
    });
  });
}

main();
