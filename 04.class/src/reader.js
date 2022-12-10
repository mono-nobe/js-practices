#! /usr/bin/env node

const Readline = require("readline");

module.exports = function read() {
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
};
