module.exports = (app) => {
    var listasMusicasController = require('./listasMusicasController');
    const rateLimit = require('express-rate-limit');
    //rate limit para o upload de músicas

    //rate limit para os restantes pedidos
    const requestsLimit = rateLimit({
        windowMs: 40*1000, // 60 segundos
        max: 15, // bloqueia após 15 pedidos
        message:{status:"Realizou demasiados pedidos ao servidor nos últimos minutos. Tente novamente mais tarde"}
    });
    app.post('/listmusic/add', requestsLimit, listasMusicasController.addMusic);
    app.post('/listmusic/delete', requestsLimit,listasMusicasController.deleteMusicList);
    app.post('/listmusic/get', requestsLimit,listasMusicasController.getMusicList);
}