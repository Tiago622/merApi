var listaReproducaoService = require('./listaReproducaoService');
var fetchVideoInfo = require('youtube-info');
const { check, validationResult } = require('express-validator/check');
var jwt = require('jsonwebtoken');
var amqp = require('amqplib/callback_api')

const ytdl = require('ytdl-core');


exports.createList = async (req, res) => {

    let serverResponse = { status: "Lista não criada", response: {} }
    //variável que guarda a query à base de dados
    var lista;
    //variavel que verifica se já existe uma lista com o mesmo nome
    var existsNomeLista;
    var existsNomeListaConfirm;
    //variável que recolhe o parâmetro enviado na request
    var dadosLista = {
        nomeLista: req.body.nomeLista,
        userFK: req.body.userFK
    };
    var token = req.headers['x-access-token'];
    if (!token) {
        serverResponse = { status: "Nao está autenticado", response: {} }
        return res.send(serverResponse);
    }
    try {
        jwt.verify(token, 'secret');

        await listaReproducaoService.getList(dadosLista.userFK, dadosLista.nomeLista).then(url => existsNomeLista = url).catch(err => console.log(err));
        if (existsNomeLista == null) {
            await listaReproducaoService.createList(dadosLista).then(url => lista = url).catch(err => console.log(err));

            if (lista != null) {
                await listaReproducaoService.getList(dadosLista.userFK, dadosLista.nomeLista).then(url => existsNomeListaConfirm = url).catch(err => console.log(err));

                serverResponse = { status: "Lista criada", response: existsNomeListaConfirm }
            }
        }
        else {
            serverResponse = { status: "Já existe uma lista com o nome escolhido", response: {} }

        }

        return res.send(serverResponse);
    }
    catch (err) {
        serverResponse = { status: "Nao está autenticado | token expirou", response: {} }
        return res.send(serverResponse);
    }
}

exports.deleteList = async (req, res) => {
    let serverResponse = { status: "Lista não eliminada", response: {} }
    //variável que guarda a query à base de dados
    var lista;
    var listaID = req.params.id;

    var token = req.headers['x-access-token'];
    if (!token) {
        serverResponse = { status: "Nao está autenticado", response: {} }
        return res.send(serverResponse);
    }
    try {
        jwt.verify(token, 'secret');

        await listaReproducaoService.deleteList(listaID).then(url => lista = url).catch(err => console.log(err));
        if (lista != null) {
            serverResponse = { status: "Lista Eliminada com sucesso", response: lista }
        }
        return res.send(serverResponse);
    }
    catch (err) {
        serverResponse = { status: "Nao está autenticado | token expirou", response: {} }
        return res.send(serverResponse);
    }
}

exports.getListUser = async (req, res) => {
    let serverResponse = { status: "Não existe listas", response: {} }
    //variável que guarda a query à base de dados
    var listas;
    var userFK = req.body.userFK;
    var token = req.headers['x-access-token'];

    if (!token) {
        serverResponse = { status: "Nao está autenticado", response: {} }
        return res.send(serverResponse);
    }
    try{
        jwt.verify(token, 'secret');

    await listaReproducaoService.getListUser(userFK).then(url => listas = url).catch(err => console.log(err));
    if (listas != null) {
        serverResponse = { status: "Lista Listadas com sucesso", response: listas }
    }
    return res.send(serverResponse);
}catch(err){
    serverResponse = { status: "Nao está autenticado | token expirou", response: {} }
    return res.send(serverResponse);
}
}