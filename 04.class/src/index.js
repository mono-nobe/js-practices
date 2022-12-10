#! /usr/bin/env node

const DB = require("./db");
const Select = require("./select");
const Minimist = require("minimist");
const Readline = require("readline");

function main() {
  const db = new DB();
  const argv = Minimist(process.argv.slice(2));

  if (!process.stdin.isTTY) {
    createMemo(db);
    return;
  }

  if (argv.l) {
    showAllMemos(db);
  } else if (argv.r) {
    showMemo(db);
  }

  db.close;
}

function readStdin() {
  return new Promise((resolve) => {
    let lines = [];
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

async function createMemo(db) {
  let lines = await readStdin();
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
  let firstLines = generateMemoChoices(db);
  if (firstLines.length === 0) {
    console.log("memo is empty.");
    return;
  }

  const select = new Select(firstLines);
  const selectedFirstLine = await select.selectItem("id");
  let selectedRow = await db.select(selectedFirstLine.id);

  console.log("\n" + selectedRow.text);
}

async function generateMemoChoices(db) {
  let firstLines = [];
  let rows = await db.selectAll();
  if (rows.length === 0) {
    return firstLines;
  }

  for await (let row of rows) {
    firstLines.push({
      name: row.text.split("\n")[0],
      value: row.id,
    });
  }
}

main();
