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