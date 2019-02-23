var WebSocketServer = new require('ws');

// Clients 
var clients = {};

// WebSocket on port 8081
var webSocketServer = new WebSocketServer.Server({
  port: 8081
});

webSocketServer.on('connection', function(ws) {
  var id = Math.random();
  clients[id] = ws;
  console.log("New Connection " + id);

  ws.on('message', function(message) {
    console.log('Message ' + message);

    for (var key in clients) {
      clients[key].send(message);
    }
  });

  ws.on('close', function() {
    console.log('Connection closed ' + id);
    delete clients[id];
  });

});