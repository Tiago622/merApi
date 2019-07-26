const Sequelize = require('sequelize');

var sequelize = new Sequelize('dbm7k835tulut9','bvkhykmoqygpoq','c641392c8697f38de5357d5261ec30e9000524e7dcfd7dc93ee9c6acde8c1ecd', {
  host: 'ec2-23-21-109-177.compute-1.amazonaws.com',
  dialect: 'postgres',
  timezone:"+01:00",
  port:5432,
  dialectOptions: {
    "ssl": true
  },
  define: {
      charset: 'utf8',
      collate: 'utf8_general_ci', 
    }
})

const models = {
  User: sequelize.import('./user'),
  Music:sequelize.import('./music'),
  Feedback: sequelize.import('./feedback'),
  ListaRepro: sequelize.import('./listaRepro'),
  ListasMusicas: sequelize.import('./listasMusicas')
};


Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;