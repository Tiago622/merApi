const listasMusicasDAL = require('./listasMusicasDAL');

exports.addMusic = async(musica) =>{
    await listasMusicasDAL.addMusic(musica);
    return musica;
}

exports.deleteMusicList = async(musicID,listID) =>{
    return await listasMusicasDAL.deleteMusicList(musicID,listID);
}

exports.getMusicList = async(listID) =>{
    return await listasMusicasDAL.getMusicList(listID);
}

exports.existsMusicList = async(listID,musicID) =>{
    return await listasMusicasDAL.existsMusicList(listID,musicID);
}