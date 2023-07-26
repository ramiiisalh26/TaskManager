const http = require('http');
const express   = require('express');
const app       = express();
const bodyParser  = require('body-parser');
const tasks     = require('./routes/tasks.js');
const con = require('./db/connect.js');
const path = require('path');
const router = express.Router();
const notFound = require('./middleware/not-found.js');
const errorHandlerMiddleware = require('./middleware/error-handler.js');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// routes
app.get('/hello', (req, res)=>{
  res.send('Task manager');
})
router.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname+'./public/index.html'));
})
const PORT =   3000;
app.use('/',bodyParser.json(),tasks);
app.use('https://68.66.226.118:3000/', bodyParser.json(),tasks);
// app.use('/api/v1/tasks/id', tasks);

app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await con;
    app.listen(PORT, console.log(`sever is work on port ${PORT}`));
  } catch (error) {
    console.log(error)
  }
}

start();    

// const server = http.createServer(function(req, res) {
//     res.writeHead(200, {'Content-Type': 'application/json'});
//     res.end(response);
// });

// server.listen();