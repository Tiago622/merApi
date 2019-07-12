var feedbackService = require('./feedbackService');
var fetchVideoInfo = require('youtube-info');
const { check, validationResult } = require('express-validator/check');
var jwt = require('jsonwebtoken');
var amqp = require('amqplib/callback_api')

const ytdl = require('ytdl-core');


exports.newFeedback = async (req, res) => {
    let serverResponse = { status: "Feedback não adicionado", response: {} }
    //variável que guarda a query à base de dados
    var feedback;
    //variável que recolhe o parâmetro enviado na request
    var dadosFeedback = {
        feedback:req.body.feedback,
        userFK:req.body.userFK,
        musicFK: req.body.musicFK
    };

    await feedbackService.newFeedback(dadosFeedback).then(url => feedback = url).catch(err => console.log(err));
    if (feedback != null) {
        serverResponse = { status: "Feedback criado", response: feedback }
    }
    return res.send(serverResponse);
}

exports.editFeedback = async (req, res) => {
    let serverResponse = { status: "Feedback alterado", response: {} }
    //variável que guarda a query à base de dados
    var feedback;
    var feedID = req.params.id;
    //variável que recolhe o parâmetro enviado na request
    var dadosFeedback = {
        feedback:req.body.feedback,
        userFK:req.body.userFK,
        musicFK: req.body.musicFK
    };

    await feedbackService.editFeedback(dadosFeedback,feedID).then(url => feedback = url).catch(err => console.log(err));
    if (feedback != null) {
        serverResponse = { status: "Feedback alterado", response: feedback }
    }
    return res.send(serverResponse);
}