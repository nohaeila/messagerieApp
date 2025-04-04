async function authRoutes(fastify, options) {
    // Simulation d'une base de données
    const users = [];
  
    // Route d'inscription
    fastify.post('/register', async (request, reply) => {
      const { username, password } = request.body;
      const hashedPassword = await fastify.bcrypt.hash(password, 10); 
      const user = { id: users.length + 1, username, password: hashedPassword };
      users.push(user);
      reply.send({ message: 'Utilisateur créé', userId: user.id });
    });
  
    // Route de connexion
    fastify.post('/login', async (request, reply) => {
      const { username, password } = request.body;
      const user = users.find(u => u.username === username);
      if (!user || !(await fastify.bcrypt.compare(password, user.password))) {
        return reply.status(401).send({ error: 'Identifiants incorrects' });
      }
      const token = fastify.jwt.sign({ id: user.id, username: user.username });
      reply.send({ token });
    });
  }
  
  module.exports = authRoutes;