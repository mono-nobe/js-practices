#! /usr/bin/env node

const DB = require("./db");
const read = require("./reader");
const Minimist = require("minimist");
const { prompt } = require("enquirer");

const db = new DB();
const argv = Minimist(process.argv.slice(2));

if (!process.stdin.isTTY) {
  createMemo();
} else {
  if (argv.l) {
    showAllMemos();
  } else if (argv.r) {
    showMemo();
  }
}

async function createMemo() {
  try {
    let lines = await read();
    await db.insert(lines.join("\n"));
    console.log("\nSaving is complete.");
  } finally {
    db.close;
  }
}

async function showAllMemos() {
  let rows = await db.selectAll();
  for (let row of rows) {
    console.log(row.text.split("\n")[0]);
  }
}

async function showMemo() {
  let rows = await db.selectAll();
  let firstLines = [];
  for await (let row of rows) {
    console.log(row.text.split("\n")[0]);
    firstLines.push({
      name: row.text.split("\n")[0],
      value: row.id,
    });
  }

  if (firstLines.length == 0) {
    console.log("memo is empty.");
    return;
  }

  const selectedFirstLine = await prompt({
    type: "select",
    name: "id",
    message: "Choose a note you want to see:",
    choices: firstLines,
    result() {
      return this.focused.value;
    },
  });

  let selectedRow = await db.select(selectedFirstLine.id);
  console.log("\n" + selectedRow.text);
}
