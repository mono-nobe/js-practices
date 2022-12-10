#! /usr/bin/env node

const DB = require("./db");
const read = require("./reader");
const Select = require("./select");
const Minimist = require("minimist");

async function main() {
  const db = new DB();
  const argv = Minimist(process.argv.slice(2));

  if (!process.stdin.isTTY) {
    await createMemo(db);
    return;
  }

  if (argv.l) {
    showAllMemos(db);
  } else if (argv.r) {
    showMemo(db);
  }

  db.close;
}

async function createMemo(db) {
  let lines = await read();
  await db.insert(lines.join("\n"));
  console.log("\nSaving is complete.");
}

async function showAllMemos(db) {
  let rows = await db.selectAll();
  for (let row of rows) {
    console.log(row.text.split("\n")[0]);
  }
}

async function showMemo(db) {
  let rows = await db.selectAll();
  if (rows.length == 0) {
    console.log("memo is empty.");
    return;
  }

  let firstLines = [];
  for await (let row of rows) {
    console.log(row.text.split("\n")[0]);
    firstLines.push({
      name: row.text.split("\n")[0],
      value: row.id,
    });
  }

  const select = new Select(firstLines);
  const selectedFirstLine = await select.selectItem("id");

  let selectedRow = await db.select(selectedFirstLine.id);
  console.log("\n" + selectedRow.text);
}

main();
