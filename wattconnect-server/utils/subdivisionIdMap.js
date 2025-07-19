const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const filePath = path.join(__dirname, "../data/mstsubdivisionjec.csv");

const fileContent = fs.readFileSync(filePath, "utf8");

const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
  bom: true,
  relax_quotes: true,
  trim: true,
});

const subdivisionIdMap = {};

for (const row of records) {
  const name = row["sdName"]?.trim()?.toUpperCase(); // Normalize case
  const id = row["id"]?.trim();
  if (name && id) {
    subdivisionIdMap[name] = id.padStart(3, "0");
  }
}

console.log("✅ Subdivision ID map loaded.");
console.log("📌 Sample keys:", Object.keys(subdivisionIdMap).slice(0, 5));

module.exports = subdivisionIdMap;
