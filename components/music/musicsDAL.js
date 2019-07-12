var models = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;   

exports.uploadVideo = async (musica) => {
    await models.Music.create(musica);
}

exports.getVideo = async (idVideo) => {
    var musica;
    await models.Music.findOne({ where: { idVideo: idVideo },include:models.Feedback}).then(music => musica = music).catch(err => console.log(err))
    return musica;
}

exports.getVideoPesquisa = async (pesquisaMusica) => {
    var pesquisa;
     await models.Music.findAll({ where: { name: { $like: '%' + pesquisaMusica + '%' }, emocao: { [Op.ne]: "" } } }).then(music => pesquisa = music).catch(err => console.log(err))
    return pesquisa;
}

exports.getNomeMusicaPesquisa = async (pesquisaMusica) => {
    var pesquisa;
    await models.Music.findAll({ where: { name: { $like: '%' + pesquisaMusica + '%' },  emocao: { [Op.ne]: "" } } }).then(music => pesquisa = music).catch(err => console.log(err))
    return pesquisa;
}

exports.getLastVideos = async () => {
    var musicas;
    await models.Music.findAll({ where:{emocao: { [Op.ne]: "" }}, order: [['createdAt', 'DESC']], limit: 4 })
        .then(mus => musicas = mus).catch(err => console.log(err));
    return musicas;
}

exports.deleteMusic = async (idVideo) => {
    var musica
    await models.Music.destroy({ where: { idVideo: idVideo } }).then(mus => musica = mus).catch(err => console.log(err))
    return musica;
}

exports.updateMusic = async (idVideo, emocao) => {
    var musica
    await models.Music.update(emocao, { where: { idVideo: idVideo } }).then(mus => musica = mus).catch(err => console.log(err))
    return musica;
}