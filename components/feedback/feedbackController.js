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
        feedback: req.body.feedback,
        userFK: req.body.userFK,
        musicFK: req.body.musicFK
    };

    await feedbackService.newFeedback(dadosFeedback).then(url => feedback = url).catch(err => console.log(err));
    if (feedback != null) {
        serverResponse = { status: "Feedback criado", response: feedback }
    }
    return res.send(serverResponse);
}

exports.editFeedback = async (req, res) => {
    let serverResponse = { status: "Feedback não alterado", response: {} }
    //variável que guarda a query à base de dados
    var resultEdit;
    var feedback;
    var feedID = req.params.id;
    var feedbackRecebido;
    var count = Object.keys(req.body).length;
    if (count != 3) {
        feedbackRecebido = null;
    }
    else {
        feedbackRecebido = req.body.feedback
    }

    //variável que recolhe o parâmetro enviado na request
    var dadosFeedback = {
        feedback: feedbackRecebido,
        userFK: req.body.userFK,
        musicFK: req.body.musicFK
    };

    await feedbackService.editFeedback(dadosFeedback, feedID).then(url => resultEdit = url).catch(err => console.log(err));
    if (resultEdit != null) {

        await feedbackService.listFeedback(dadosFeedback.userFK, dadosFeedback.musicFK).then(url => feedback = url).catch(err => console.log(err));
        serverResponse = { status: "Feedback alterado", response: feedback }
    }
    return res.send(serverResponse);
}

exports.listFeedback = async (req, res) => {
    let serverResponse = { status: "Não existe feedback ainda para esta música", response: {} }
    //variável que guarda a query à base de dados
    var feedback;
    var userID = req.body.userFK;
    var musicID = req.body.musicFK;

    //token
    var token = req.headers['x-access-token'];
    if (!token) {
        serverResponse = { status: "Nao está autenticado", response: {} }
        return res.send(serverResponse);
    }

    try{
        jwt.verify(token, 'secret');
        await feedbackService.listFeedback(userID, musicID).then(url => feedback = url).catch(err => console.log(err));

        if (feedback != null) {
            serverResponse = { status: "Feedback listado com sucesso", response: feedback }
        }
        return res.send(serverResponse);
    }catch(err){
        serverResponse = { status: "Nao está autenticado | token expirou", response: {} }
        return res.send(serverResponse);    
    
    }
    
}

exports.listFeedbackForUser = async (req, res) => {
    let serverResponse = { status: "Utillizador ainda sem feedbacks", response: {} }
    //variável que guarda a query à base de dados
    var feedback;
    var userID = req.params.id;

    //token
    var token = req.headers['x-access-token'];
    if (!token) {
        serverResponse = { status: "Nao está autenticado", response: {} }
        return res.send(serverResponse);
    }

    try{
        jwt.verify(token, 'secret');
        await feedbackService.listFeedbackForUser(userID).then(url => feedback = url).catch(err => console.log(err));

        if (feedback != null) {
            serverResponse = { status: "Feedback listados com sucesso", response: feedback }
        }
        return res.send(serverResponse);
    }catch(err){
        serverResponse = { status: "Nao está autenticado | token expirou", response: {} }
        return res.send(serverResponse);    
    
    }
    
}