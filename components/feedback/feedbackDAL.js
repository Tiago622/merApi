var models = require('../models/index');

exports.createFeedback = async (feedback) => {
    await models.Feedback.create(feedback);
}

exports.editFeedback = async (dadosFeedback,feedID) =>{
    var update;
    await models.Feedback.update(dadosFeedback,{where:{id:feedID}}).then(usr => update = usr).catch(err => console.log(err));
    return update;
  }

  exports.listFeedback = async (userID,musicID) =>{
    var feedback;
    await models.Feedback.findOne({where:{userFK:userID,musicFK:musicID},include:[models.Music]}).then(usr => feedback = usr).catch(err => console.log(err));
    return feedback;
  }

  exports.listFeedbackForUser = async (userID) =>{
    var feedback;
    await models.Feedback.findAll({where:{userFK:userID},include:[models.Music]}).then(usr => feedback = usr).catch(err => console.log(err));
    return feedback;
  }
