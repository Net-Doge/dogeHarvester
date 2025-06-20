# Setup Instructions
2. Ensure RootCA.key and RootCA.crt are in the project root and readable.
3. Install dependencies:
```bash
npm install express.
```
4. Run the server:
```bash
node server.js # (port 443 may require sudo on Linux/Mac).
```
5. Access the login page at https://localhost.

# Brief explanation
- This HTTPS server is a simple way to gather credentials via a login page.
- It was prompt engineered with GROK 3.
- It is not intended for production use. Only for pentesting / CTF purposes.
