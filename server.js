const http = require('http');
const app = require('./src/app.js');

const PORT = 8000;

const server = http.createServer(app);

const serverListener = () => console.log(`server listening on port ${PORT}`);
server.listen(PORT, serverListener);
