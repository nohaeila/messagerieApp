const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
const WebSocket = require('ws');

// Configuration JWT
fastify.register(require('@fastify/jwt'), {
  secret: 'mon-secret-jwt'
});

// Middleware d'authentification
fastify.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Non autorisé' });
  }
});

fastify.register(require('./routes/auth'));

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/auth-app')
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB:', err));

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

// WebSocket
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
  console.log('Nouvelle connexion WebSocket');
  ws.on('message', (message) => {
    console.log('Message reçu:', message.toString());
    ws.send('Message reçu!');
  });
});

module.exports = fastify;