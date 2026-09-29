const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

function serveHtml(fileName, res) {
  const filePath = path.join(__dirname, fileName);

  fs.readFile(filePath, "utf8", (error, data) => {
    if (error) {
      return res.status(500).send("HTML file read nahi ho saki");
    }

    res.type("html").send(data);
  });
}

app.get("/", (req, res) => {
  serveHtml("home.html", res);
});

app.get("/about", (req, res) => {
  serveHtml("about.html", res);
});

app.get("/contact", (req, res) => {
  serveHtml("contact.html", res);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});