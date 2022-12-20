#! /usr/bin/env node

const Memo = require("./memo");
const Select = require("./select");
const Minimist = require("minimist");
const Readline = require("readline");

const DBFilePath = "./db/memo.sqlite3";

async function main() {
  const memo = new Memo(DBFilePath);
  const argv = Minimist(process.argv.slice(2));

  if (!process.stdin.isTTY) {
    await createMemo(memo);
  }

  if (argv.l) {
    await showAllMemos(memo);
  } else if (argv.r) {
    await showMemo(memo);
  } else if (argv.d) {
    await deleteMemo(memo);
  }

  memo.close();
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

async function createMemo(memo) {
  const lines = await readStdin();
  await memo.insert(lines.join("\n"));
  console.log("\nSaving is complete.");
}

async function showAllMemos(memo) {
  const allMemos = await memo.selectAll();
  if (allMemos.length === 0) {
    console.log("memo is empty.");
    return;
  }

  for (let memo of allMemos) {
    console.log(memo.text.split("\n")[0]);
  }
}

async function showMemo(memo) {
  const allMemos = await memo.selectAll();
  if (allMemos.length === 0) {
    console.log("memo is empty.");
    return;
  }

  const options = generateOptions(allMemos);
  const select = new Select(options);
  const selectedOption = await select.selectItem("id", "see");

  const selectedRow = await memo.select(selectedOption.id);
  console.log("\n" + selectedRow.text);
}

async function deleteMemo(memo) {
  const allMemos = await memo.selectAll();
  if (allMemos.length === 0) {
    console.log("memo is empty.");
    return;
  }

  const options = generateOptions(allMemos);
  const select = new Select(options);
  const selectedOption = await select.selectItem("id", "delete");

  await memo.delete(selectedOption.id);
  console.log("\nDeletion is complete.");
}

async function generateOptions(targets) {
  return targets.map((target) => ({
    name: target.text.split("\n")[0],
    value: target.id,
  }));
}

main();
