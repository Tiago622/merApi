const feedbackDAL = require('./feedbackDAL');

exports.newFeedback = async(feedback) =>{
    await feedbackDAL.createFeedback(feedback);
    return feedback;
}

exports.editFeedback = async(dadosFeedback,feedID) =>{
    return await feedbackDAL.editFeedback(dadosFeedback,feedID);
}