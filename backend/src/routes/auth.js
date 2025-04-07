const bcrypt = require('bcrypt');
const User = require('../models/user');

async function authRoutes(fastify, options) {
  // Route d'inscription
  fastify.post('/register', async (request, reply) => {
    const { username, password, email } = request.body;
    
    // Validation 
    if (!username || !password || !email) {
      return reply.status(400).send({ error: 'Tous les champs sont requis' });
    }
    
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return reply.status(400).send({ error: 'Utilisateur déjà existant' });
      }
      
      // Créer un nouvel utilisateur
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ 
        username, 
        email, 
        password: hashedPassword 
      });
      
      await user.save();
      
      // Générer un token JWT
      const token = fastify.jwt.sign({ 
        id: user._id, 
        username: user.username 
      });
      
      reply.send({ 
        message: 'Utilisateur créé',
        token
      });
    } catch (error) {
      reply.status(500).send({ error: 'Erreur serveur' });
    }
  });

  // Route de connexion
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body;
    
    try {
      // Trouver l'utilisateur
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return reply.status(401).send({ error: 'Identifiants incorrects' });
      }
      
      // Générer un token JWT
      const token = fastify.jwt.sign({ 
        id: user._id, 
        username: user.username 
      });
      
      reply.send({ 
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      reply.status(500).send({ error: 'Erreur serveur' });
    }
  });
  
  // Route protégée 
  fastify.get('/profile', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const user = await User.findById(request.user.id).select('-password');
      reply.send(user);
    } catch (error) {
      reply.status(500).send({ error: 'Erreur serveur' });
    }
  });
}

module.exports = authRoutes;