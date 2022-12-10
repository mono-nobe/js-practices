#! /usr/bin/env node

const DB = require("./db");
const read = require("./reader");
const Minimist = require("minimist");

const db = new DB();
const argv = Minimist(process.argv.slice(2));

if (!process.stdin.isTTY) {
  addMemo();
} else {
  if (argv.l) {
    selectAll();
  }
}

async function addMemo() {
  try {
    let lines = await read();
    await db.insert(lines.join("\n"));
    console.log("### Memo added ###");
  } finally {
    db.close;
  }
}

async function selectAll() {
  let rows = await db.selectAll();
  for (let row of rows) {
    console.log(row.text.split("\n")[0]);
  }
}
