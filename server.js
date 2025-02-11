const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Allowed users with password "Momo"
const AUTH_USERS = {
    "Damien": "Momo",
    "Clement": "Momo"
};

// ✅ Authentication Middleware (Skip /health route)
app.use((req, res, next) => {
    if (req.path === "/health") {
        return next(); // ✅ Skip authentication for /health
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Mushroom Map"');
        return res.status(401).send('Authentication required');
    }

    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const [username, password] = credentials;

    if (AUTH_USERS[username] && AUTH_USERS[username] === password) {
        return next(); // ✅ User authenticated
    }

    res.setHeader('WWW-Authenticate', 'Basic realm="Mushroom Map"');
    return res.status(401).send('Unauthorized');
});

// ✅ Serve static files from "cmc" and "cmc/data"
app.use('/cmc', express.static(path.join(__dirname, 'cmc')));
app.use('/cmc/data', express.static(path.join(__dirname, 'cmc/data')));

// ✅ Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'cmc', 'index.html'));
});

// ✅ Test JSON file serving
app.get('/test-json', (req, res) => {
    res.sendFile(path.join(__dirname, 'cmc/data', 'suisse-ouest-bolet-bai.json'), err => {
        if (err) {
            res.status(404).send('JSON file not found.');
        }
    });
});

// ✅ Health Check Route for UptimeRobot (No Authentication Required)
app.get('/health', (req, res) => {
    res.status(200).send("OK");
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
