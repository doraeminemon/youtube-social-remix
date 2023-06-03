const { WebSocketServer, OPEN } = require('ws');
const http = require('http');
const uuidv4 = require('uuidv4')

// Spinning the http server and the WebSocket server.
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

// I'm maintaining all active connections in this object
const clients = {};

// A new client connection request received
wsServer.on('connection', function (connection) {
  // Generate a unique code for every user
  const userId = uuidv4.uuid();
  console.log(`Received a new connection.`);
  connection.on('message', (data) => {
    try {
      console.log(`received: %s`, data)
      if (typeof data === 'object') {
        data = JSON.stringify(data)
      }
      // broadcast message to all clients
      if (typeof data === 'string') {
        console.log(`clients arr: %s`, clients)
        console.log(`clients %s`, wsServer.clients)
        wsServer.clients.forEach((client) => {
          if (client !== connection && client.readyState === OPEN) {
            client.send(data, { binary: false });
          }
        })
      }
    } catch (err) {
      console.log(err)
    }
  })

  // Store the new connection and handle messages
  clients[userId] = connection;
  console.log(`${userId} connected.`);
});