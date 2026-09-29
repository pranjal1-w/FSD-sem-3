const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "requests.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readRequests() {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf8");

        if (!data.trim()) {
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveRequests(requests) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(requests, null, 2)
    );
}

// GET all
app.get("/api/requests", (req, res) => {
    res.json(readRequests());
});

// GET by ID
app.get("/api/requests/:id", (req, res) => {
    const requests = readRequests();

    const request = requests.find(
        item => item.id === Number(req.params.id)
    );

    if (!request) {
        return res.status(404).json({
            message: "Request not found"
        });
    }

    res.json(request);
});

// POST
app.post("/api/requests", (req, res) => {
    const requests = readRequests();

    const newRequest = {
        id: Date.now(),
        studentName: req.body.studentName,
        email: req.body.email,
        category: req.body.category,
        description: req.body.description,
        priority: req.body.priority
    };

    requests.push(newRequest);
    saveRequests(requests);

    res.status(201).json(newRequest);
});

// PUT
app.put("/api/requests/:id", (req, res) => {
    const requests = readRequests();

    const index = requests.findIndex(
        item => item.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Request not found"
        });
    }

    requests[index] = {
        ...requests[index],
        ...req.body
    };

    saveRequests(requests);

    res.json(requests[index]);
});

// DELETE
app.delete("/api/requests/:id", (req, res) => {
    const requests = readRequests();

    const filtered = requests.filter(
        item => item.id !== Number(req.params.id)
    );

    if (filtered.length === requests.length) {
        return res.status(404).json({
            message: "Request not found"
        });
    }

    saveRequests(filtered);

    res.json({
        message: "Request deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});