#! /usr/bin/env node

const DB = require("./db");
const Memo = require("./memo");
const Minimist = require("minimist");
const Readline = require("readline");

const DBFilePath = "./db/memo.sqlite3";

async function main() {
  const db = new DB(DBFilePath);
  const memo = new Memo(db);
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

  db.close();
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
