const Sequelize = require('sequelize');

var sequelize = new Sequelize('ddg2c4nng0ebdb','osniaamvqmbdwc','5fccf57b5a373715da1d1f7c778a138c41a5201a8700e832dc404596ae7f73c9', {
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
  Feedback:sequelize.import('./feedback')
};


Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;