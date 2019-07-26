var listaMusicasService = require('./listasMusicasService');
var fetchVideoInfo = require('youtube-info');
const { check, validationResult } = require('express-validator/check');
var jwt = require('jsonwebtoken');
var amqp = require('amqplib/callback_api')

const ytdl = require('ytdl-core');


exports.addMusic = async (req, res) => {
    let serverResponse = { status: "Musica não adicionada à lista", response: {} }
    //variável que guarda a query à base de dados
    var novaMusica;
    //variável que verifica se a música já existe na lista de reprodução
    var existsMusicList;
    //variável que recolhe o parâmetro enviado na request
    var dados = {
        musicFK: req.body.musicFK,
        listaFK: req.body.listaFK
    };
    var token = req.headers['x-access-token'];

    if (!token) {
        serverResponse = { status: "Nao está autenticado", response: {} }
        return res.send(serverResponse);
    }
    try {
        jwt.verify(token, 'secret');

        await listaMusicasService.existsMusicList(req.body.listaFK, req.body.musicFK).then(url => existsMusicList = url).catch(err => console.log(err));

        if (existsMusicList != null) {
            serverResponse = { status: "Musica já existe na lista", response: existsMusicList }


        }
        else {
            await listaMusicasService.addMusic(dados).then(url => novaMusica = url).catch(err => console.log(err));
            if (novaMusica != null) {
                serverResponse = { status: "Musica adicionada à lista", response: novaMusica }
            }
        }

        return res.send(serverResponse);
    } catch (err) {
        serverResponse = { status: "Nao está autenticado | token expirou", response: {} }
        return res.send(serverResponse);
    }
}

exports.deleteMusicList = async (req, res) => {

    let serverResponse = { status: "Musica não eliminada da lista", response: {} }
    //variável que guarda a query à base de dados
    var musicaEliminada;
    var musicID = req.body.musicFK;
    var listID = req.body.listaFK;
    var token = req.headers['x-access-token'];

    if (!token) {
        serverResponse = { status: "Nao está autenticado", response: {} }
        return res.send(serverResponse);
    }
    try{
        jwt.verify(token, 'secret');

    await listaMusicasService.deleteMusicList(musicID, listID).then(url => musicaEliminada = url).catch(err => console.log(err));
    if (musicaEliminada != null) {
        serverResponse = { status: "Música Eliminada da lista com sucesso", response: musicaEliminada }
    }
    return res.send(serverResponse);
}catch(err){
    serverResponse = { status: "Nao está autenticado | token expirou", response: {} }
    return res.send(serverResponse);
}
}

exports.getMusicList = async (req, res) => {
    let serverResponse = { status: "Lista sem músicas", response: {} }
    //variável que guarda a query à base de dados
    var musicasLista;
    var listaFK = req.body.listaFK;
    var token = req.headers['x-access-token'];

if (!token) {
        serverResponse = { status: "Nao está autenticado", response: {} }
        return res.send(serverResponse);
    }
    try{
        jwt.verify(token, 'secret');

    await listaMusicasService.getMusicList(listaFK).then(url => musicasLista = url).catch(err => console.log(err));
    var count = Object.keys(musicasLista).length;
    if (count != 0) {
        serverResponse = { status: "Existem músicas nesta lista", response: musicasLista }
    }
    return res.send(serverResponse);
}catch(err){
    serverResponse = { status: "Nao está autenticado | token expirou", response: {} }
    return res.send(serverResponse);
}
}