var models = require('../models/index');

exports.createList = async (lista) => {
    var listaR;
    await models.ListaRepro.create(lista).then(lis => listaR = lis).catch(err => console.log(err));
    return listaR;
}

exports.deleteList = async (listID) =>{
    var deleteList;
    await models.ListaRepro.destroy({where:{listaID:listID}}).then(usr => deleteList = usr).catch(err => console.log(err));
    return deleteList;
  }

  exports.getList = async (userFK, nomeLista) =>{
    var listaUser;
    await models.ListaRepro.findOne({where:{userFK:userFK,nomeLista:nomeLista}}).then(usr => listaUser = usr).catch(err => console.log(err));
    return listaUser;
  }

  exports.getListUser = async (userFK) =>{
    var listaUser;
    await models.ListaRepro.findAll({where:{userFK:userFK},include:[models.ListasMusicas]}).then(usr => listaUser = usr).catch(err => console.log(err));
    return listaUser;
  }