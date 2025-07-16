const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const subdivisionIdMap = {};
const filePath = path.join(__dirname, "../data/mstsubdivisionjec.csv");

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    const name = row["sdName"]?.trim().toLowerCase();
    const id = row["id"]?.trim();
    if (name && id) {
      subdivisionIdMap[name] = id.padStart(3, "0");
    }
  })
  .on("end", () => {
    console.log("✅ Subdivision ID map loaded.");
  });

module.exports = subdivisionIdMap;
