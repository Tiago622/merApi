
var models = require('../models')

exports.createUser = async (user) => {
    await models.User.create(user);
}

exports.getUserByUsername = async (username) => {
  var user;
  await models.User.findOne( {where: {username:username},include:[models.Music]}).then(usr => user = usr).catch(err => console.log(err));
  return user
}

exports.getUserByEmail = async (email) =>{
  var user;
  await models.User.findOne( {where: {email:email},include:[models.Music]}).then(usr => user = usr).catch(err => console.log(err));
  return user;
}

exports.getAllUsers = async () =>{
  var users;
  await models.User.findAll({include:[models.Music]}).then(usr => users = usr).catch(err => console.log(err));
  return users;
}

exports.editUser = async (user,username) =>{
  var update;
  await models.User.update(user,{where:{username:username}}).then(usr => update = usr).catch(err => console.log(err));
  return update;
}

exports.deleteUser = async (username) =>{
  var deletedUser;
  await models.User.destroy({where:{username:username}}).then(usr => deletedUser = usr).catch(err => console.log(err));
  return deletedUser;
}

