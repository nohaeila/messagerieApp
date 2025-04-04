const fastify = require('fastify')({ logger: true });
const WebSocket = require('ws');
const bcrypt = require('bcrypt');

// Enregistrement des plugins
fastify.register(require('@fastify/jwt'), {
  secret: 'secret-super-securise' 
});


fastify.decorate('bcrypt', bcrypt);

// routes
fastify.register(require('./routes/auth'));

// Lancement du serveur HTTP
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Serveur démarré sur http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

// Serveur WebSocket
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
  console.log('Nouvelle connexion WebSocket');
  ws.on('message', (message) => {
    console.log('Message reçu :', message);
    ws.send('Message bien reçu');
  });
});

module.exports = fastify;