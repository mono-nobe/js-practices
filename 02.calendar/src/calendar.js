#! /usr/bin/env node

const DateFns = require("date-fns");

const argv = require("minimist")(process.argv.slice(2));
const today = new Date();
const year = argv.y || today.getFullYear();
const month = argv.m || today.getMonth() + 1;
const startDate = new Date(year, month - 1, 1);
const endDate = DateFns.subDays(DateFns.addMonths(startDate, 1), 1);
const targetDates = DateFns.eachDayOfInterval({
  start: startDate,
  end: endDate,
});

console.log(month.toString().padStart(8, " ") + "月 " + year);
console.log("日 月 火 水 木 金 土");

let displayStr = "";

if (!DateFns.isSunday(targetDates[0])) {
  displayStr += "   ".repeat(DateFns.getISODay(targetDates[0]));
}

for (let targetDate of targetDates) {
  if (DateFns.getDate(targetDate) < 10) {
    displayStr += " ";
  }

  displayStr += DateFns.getDate(targetDate).toString() + " ";

  if (DateFns.isSaturday(targetDate)) {
    displayStr += "\n";
  }
}

if (!DateFns.isSaturday(targetDates.slice(-1)[0])) {
  displayStr += "\n";
}

console.log(displayStr);
