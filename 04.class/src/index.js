#! /usr/bin/env node

const Memo = require("./memo");
const Select = require("./select");
const Minimist = require("minimist");
const Readline = require("readline");

async function main() {
  const memo = new Memo();
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

async function createMemo(memo) {
  let lines = await readStdin();
  await memo.insert(lines.join("\n"));
  console.log("\nSaving is complete.");
}

async function showAllMemos(memo) {
  let rows = await memo.selectAll();
  for (let row of rows) {
    console.log(row.text.split("\n")[0]);
  }
}

async function showMemo(memo) {
  let allMemos = await memo.selectAll();
  if (allMemos.length === 0) {
    console.log("memo is empty.");
    return;
  }

  let options = generateOptions(allMemos);
  const select = new Select(options);
  const selectedOption = await select.selectItem("id", "see");

  let selectedRow = await memo.select(selectedOption.id);
  console.log("\n" + selectedRow.text);
}

async function deleteMemo(memo) {
  let allMemos = await memo.selectAll();
  if (allMemos.length === 0) {
    console.log("memo is empty.");
    return;
  }

  let options = generateOptions(allMemos);
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
