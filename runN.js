const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const FILE_PATH = path.join(__dirname, "./src/QnA/Language.json");

app.post("/add", (req, res) => {
  const { category, key, value } = req.body;

  if (!category || !key || !value) {
    return res.status(400).json({ message: "Invalid data!" });
  }

  fs.readFile(FILE_PATH, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ message: "Failed to read file." });
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res.status(500).json({ message: "Invalid JSON data." });
    }

    // Add new data to the JSON structure
    if (!jsonData[category]) {
      jsonData[category] = [{}];
    }
    jsonData[category][0][key] = value;

    fs.writeFile(FILE_PATH, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res.status(500).json({ message: "Failed to write file." });
      }

      res.status(200).json({ message: "Data added successfully!" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
