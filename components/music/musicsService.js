const musicsDal = require('./musicsDAL');

exports.uploadVideo = async(musica) =>{
    return await musicsDal.uploadVideo(musica);
}

exports.getVideo = async(idVideo) =>{
    return await musicsDal.getVideo(idVideo);
}

exports.getVideoPesquisa = async(pesquisaMusica) =>{
    return await musicsDal.getVideoPesquisa(pesquisaMusica);
}

exports.getNomeMusicaPesquisa = async(pesquisaMusica) =>{
    return await musicsDal.getNomeMusicaPesquisa(pesquisaMusica);
}


exports.getLastVideos = async() =>{
    return await musicsDal.getLastVideos();
}

exports.deleteMusic = async(idVideo) => {
    return await musicsDal.deleteMusic(idVideo);
}

exports.updateMusic = async(idVideo, emocao) => {
    return await musicsDal.updateMusic(idVideo, emocao);
}

exports.getMusicasUser = async(userFK) => {
    return await musicsDal.getMusicasUser(userFK);
}

exports.getMusicasID = async(musicFK) => {
    return await musicsDal.getMusicasID(musicFK);
}

exports.getMusicProcessing = async() => {
    return await musicsDal.getMusicProcessing();
}

exports.getMusicByEmotion = async(emocao) => {
    return await musicsDal.getMusicByEmotion(emocao);
}




