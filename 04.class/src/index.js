#! /usr/bin/env node

const DB = require("./db");
const Select = require("./select");
const Minimist = require("minimist");
const Readline = require("readline");

const DBFilePath = "./db/memo.sqlite3";

async function main() {
  const db = new DB(DBFilePath);
  const argv = Minimist(process.argv.slice(2));

  if (!process.stdin.isTTY) {
    await createMemo(db);
  }

  if (argv.l) {
    await showAllMemos(db);
  } else if (argv.r) {
    await showMemo(db);
  } else if (argv.d) {
    await deleteMemo(db);
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

async function createMemo(db) {
  const lines = await readStdin();
  await db.insert("memos", "text", lines.join("\n"));
  console.log("\nSaving is complete.");
}

async function showAllMemos(db) {
  const allMemos = await db.selectAll("memos");
  if (!existsMemo(allMemos)) {
    return;
  }

  for (let memo of allMemos) {
    console.log(memo.text.split("\n")[0]);
  }
}

async function showMemo(db) {
  const allMemos = await db.selectAll("memos");
  if (!existsMemo(allMemos)) {
    return;
  }

  const options = generateOptions(allMemos);
  const select = new Select(options);
  const selectedOption = await select.selectItem("id", "see");

  const selectedRow = await db.select("memos", selectedOption.id);
  console.log("\n" + selectedRow.text);
}

async function deleteMemo(db) {
  const allMemos = await db.selectAll("memos");
  if (!existsMemo(allMemos)) {
    return;
  }

  const options = generateOptions(allMemos);
  const select = new Select(options);
  const selectedOption = await select.selectItem("id", "delete");

  await db.delete("memos", selectedOption.id);
  console.log("\nDeletion is complete.");
}

async function generateOptions(targets) {
  return targets.map((target) => ({
    name: target.text.split("\n")[0],
    value: target.id,
  }));
}

function existsMemo(memos) {
  if (memos.length === 0) {
    console.log("memo is empty.");
    return false;
  }

  return true;
}

main();
