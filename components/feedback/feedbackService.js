const feedbackDAL = require('./feedbackDAL');

exports.newFeedback = async(feedback) =>{
    await feedbackDAL.createFeedback(feedback);
    return feedback;
}

exports.editFeedback = async(dadosFeedback,feedID) =>{
    return await feedbackDAL.editFeedback(dadosFeedback,feedID);
}

exports.listFeedback = async(userID,musicID) =>{
    return await feedbackDAL.listFeedback(userID,musicID);
}

exports.listFeedbackForUser = async(userID) =>{
    return await feedbackDAL.listFeedbackForUser(userID);
}