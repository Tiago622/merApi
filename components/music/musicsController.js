
var musicsService = require('./musicsService');
var fetchVideoInfo = require('youtube-info');
const { check, validationResult } = require('express-validator/check');
var jwt = require('jsonwebtoken');
var amqp = require('amqplib/callback_api')

const ytdl = require('ytdl-core');


exports.uploadVideo = async (req, res) => {
    let serverResponse = { status: "Not Uploaded", response: {} }
    //variável que guarda a query à base de dados
    var existsMusica;
    //validar url
    //req.checkBody('url', 'URL is required or is not valid').isURL().notEmpty();
    //endereço do vídeo do youtube
    const url = req.body.urlInput + "";
    //Returns a video ID from a YouTube URL.
    const idVideo = ytdl.getURLVideoID(url);

    //verificar se a música já existe na base de dados
    await musicsService.getVideo(idVideo).then(mus => existsMusica = mus).catch(err => console.log(err));

    if (existsMusica != null) {
        serverResponse = { status: "URL já existe na base de dados", response: existsMusica }
        return res.send(serverResponse)
    }

    //verificar erros 
    var errors = req.validationErrors();
    //se existir erros de validação
    if (errors) {
        serverResponse = { status: "Erros na validação", response: errors }
        return res.send(errors)
    }
    else {
        if (url != null) {
            var nome;
            var dadosMusica = {};
            fetchVideoInfo(idVideo, async function (err, videoInfo) {
                if (err) throw new Error(err);
                nome = videoInfo.title;
                dadosMusica = { idVideo: idVideo, name: nome, url: url, emocao: "", userFK: req.body.userFK }

                await musicsService.uploadVideo(dadosMusica);
            });



            /*amqp.connect('amqp://merUser:passwordMER@192.168.137.42', function (err, conn) {
                conn.createChannel(function (err, ch) {
                    var q = 'musicExtraction';
                    //console.log("Conn = " + conn);
                    //console.log("Ch = " + ch);

                    ch.assertQueue(q, { durable: false });
                    ch.sendToQueue(q, new Buffer(url), { persistent: false });
                    console.log(" [x] Sent '%s'", url);
                });
                setTimeout(function () { conn.close(); process.exit(0) }, 500);
            });*/

            serverResponse = { status: "Upload", response: {} }
            return res.send(serverResponse);
        }
        else {
            return res.send(serverResponse);
        }
    }

}

exports.getVideo = async (req, res) => {
    let serverResponse = { status: "URL não está presente na base de dados", response: {} }
    //variável que guarda a query à base de dados
    var urlBD;
    //variável que recolhe o parâmetro enviado na request
    var idVideo = req.params.idVideo;
    await musicsService.getVideo(idVideo).then(url => urlBD = url).catch(err => console.log(err));

    if (urlBD != null) {
        serverResponse = { status: "URL com o id " + idVideo + " está na base de dados", response: urlBD }
    }
    return res.send(serverResponse);
}

exports.getVideoPesquisa = async (req, res) => {
    let serverResponse = { status: "A pesquisa não retornou nenhuma música", response: "teste" }

    var musicas;
    var pesquisaRealizada = req.params.pesquisaMusica;
    await musicsService.getVideoPesquisa(pesquisaRealizada).then(music => musicas = music).catch(err => console.log(err));
    if (pesquisaRealizada != null) {
        var size = Object.keys(musicas).length;
        var dadosEnviar = [];
        for (let i = 0; i < size; i++) {

            await fetchVideoInfo(musicas[i].idVideo).then(videoInfo => {
                const autor = videoInfo.owner;
                const dataPublicacao = videoInfo.datePublished;
                const numViews = videoInfo.views;
                const numDislikes = videoInfo.dislikeCount;
                const numLikes = videoInfo.likeCount;
                const numComentarios = videoInfo.commentCount;
                dadosEnviar[i] = {
                    idVideo: musicas[i].idVideo, nome: musicas[i].name, url: musicas[i].url, autor: autor, dataPublicacao: dataPublicacao,
                    numViews: numViews, numDislikes: numDislikes, numLikes: numLikes, numComentarios: numComentarios, emocao: musicas[i].emocao
                }
            });
        }

        serverResponse = { status: "Musicas encontradas que contem o seguinte conjunto de caracteres " + pesquisaRealizada, response: dadosEnviar }
    }
    return res.send(serverResponse);
}

exports.getNomeMusicaPesquisa = async (req, res) => {
    let serverResponse = { status: "A pesquisa não retornou nenhuma música", response: {} }

    var musicas;
    var pesquisaRealizada = req.params.pesquisaMusica;
    await musicsService.getNomeMusicaPesquisa(pesquisaRealizada).then(music => musicas = music).catch(err => console.log(err));
    if (pesquisaRealizada != null) {
        

        serverResponse = { status: "Musicas encontradas que contem o seguinte conjunto de caracteres " + pesquisaRealizada, response: musicas }
    }
    return res.send(serverResponse);
}

exports.getLastVideos = async (req, res) => {
    let serverResponse = { status: "Ainda não existem músicas na Base de Dados", response: {} }
    //variável que guarda a query à base de dados
    var musicas;
    var token;
    token = req.headers['x-access-token'];
    console.log(token);
    if (token == "null") {
        await musicsService.getLastVideos().then(mus => musicas = mus).catch(err => console.log(err))
        if (musicas.length > 0) {
            var size = Object.keys(musicas).length;
            var dadosEnviar = [];
            for (let i = 0; i < size; i++) {
                await fetchVideoInfo(musicas[i].idVideo).then(videoInfo => {
                    const autor = videoInfo.owner;
                    const dataPublicacao = videoInfo.datePublished;
                    const numDislikes = videoInfo.dislikeCount;
                    const numViews = videoInfo.views;
                    const numLikes = videoInfo.likeCount;
                    const numComentarios = videoInfo.commentCount;
                    dadosEnviar[i] = {
                        numViews: numViews, numDislikes: numDislikes, numLikes: numLikes, numComentarios: numComentarios, emocao: musicas[i].emocao,
                        idVideo: musicas[i].idVideo, nome: musicas[i].name, url: musicas[i].url, autor: autor, dataPublicacao: dataPublicacao,
                    }
                });
            }
            serverResponse = { status: "Últimas músicas classificadas", response: dadosEnviar }
        }
        return res.send(serverResponse);
    }
    else {
        try {
            jwt.verify(token, 'secret');
            await musicsService.getLastVideos().then(mus => musicas = mus).catch(err => console.log(err))
            if (musicas.length > 0) {
                var size = Object.keys(musicas).length;
                var dadosEnviar = [];
                for (let i = 0; i < size; i++) {
                    await fetchVideoInfo(musicas[i].idVideo).then(videoInfo => {
                        const autor = videoInfo.owner;
                        const dataPublicacao = videoInfo.datePublished;
                        const numViews = videoInfo.views;
                        const numDislikes = videoInfo.dislikeCount;
                        const numLikes = videoInfo.likeCount;
                        const numComentarios = videoInfo.commentCount;
                        dadosEnviar[i] = {
                            idVideo: musicas[i].idVideo, nome: musicas[i].name, url: musicas[i].url, autor: autor, dataPublicacao: dataPublicacao,
                            numViews: numViews, numDislikes: numDislikes, numLikes: numLikes, numComentarios: numComentarios, emocao: musicas[i].emocao
                    }
                        });
                }
                serverResponse = { status: "Últimas músicas classificadas", response: dadosEnviar }
            }
            return res.send(serverResponse);
        } catch (err) {
            serverResponse = { status: "token expired", response: {} }
            return res.send(serverResponse);
        }
    }
}

exports.deleteMusic = async (req, res) => {
    let serverResponse = { status: "Not Deleted | Música não está na base de dados", response: {} }
    var musicaDelete;
    //musica a apagar
    var musicaApagar = req.params.idVideo;
    var token = req.headers['x-access-token'];
    //se o token não existir
    if (!token) {
        serverResponse = {status:'No token provided.'}
        return res.send(serverResponse);
    }
    //se existir
    try {
        //validar
        jwt.verify(token, 'secret');
        //apagar música
        await musicsService.deleteMusic(musicaApagar).then(mus => musicaDelete = mus).catch(err => console.log(err));
        if (musicaDelete != 0) {
            serverResponse = { status: "Deleted", response: musicaDelete }
        }
        return res.send(serverResponse);
    } catch (err) {
        serverResponse = {status:"Failed to authenticate token."}
        return res.send( serverResponse)
    }
}



exports.updateEmocao = async (req, res) => {
    let serverResponse = { status: "Não classificada | Música não está na base de dados", response: {} }
    //musica a atualizar
    var musicaUpdate = req.body.idVideo;
    var emocao = req.body.emocao;
    var musicaAtualizada;
    var dadosEmocao = { emocao: emocao }

    //atualizar música
    await musicsService.updateMusic(musicaUpdate, dadosEmocao).then(mus => musicaAtualizada = mus).catch(err => console.log(err));
    if (musicaAtualizada != 0) {
        serverResponse = { status: "Atualizada", response: musicaAtualizada }
    }
    return res.send(serverResponse);
}
