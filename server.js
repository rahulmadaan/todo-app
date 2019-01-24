const http = require('http');
const app = require('./src/app.js');

const PORT = process.env.PORT || 8000;

// const app = function(req,res){
// 	console.log('chal gya mein');
// 	res.end();
// }

const server = http.createServer(app);

const serverListener = () => console.log(`server listening on port ${PORT}`);
server.listen(PORT, serverListener);
