module.exports = (app) => {
    var musicsController = require('./musicsController');
    const rateLimit = require('express-rate-limit');
    //rate limit para o upload de músicas
    const uploadLimiter = rateLimit({
        windowMs: 60*1000, // 60 segundos
        max: 10, // bloqueia após 10 pedidos
        message: {status:"Foram feitos demasiados uploads nos últimos minutos! Volte a tentar mais tarde"}
    });
    //rate limit para os restantes pedidos
    const requestsLimit = rateLimit({
        windowMs: 60*1000, // 60 segundos
        max: 15, // bloqueia após 15 pedidos
        message:{status:"Realizou demasiados pedidos ao servidor nos últimos minutos. Tente novamente mais tarde"}
    });
    app.post('/music/upload', uploadLimiter, musicsController.uploadVideo);
    app.get('/music/:idVideo', requestsLimit,musicsController.getVideo);
    app.get('/music', requestsLimit,musicsController.getLastVideos);
    app.post('/music/:idVideo/delete',requestsLimit, musicsController.deleteMusic);
    app.get('/music/search/:pesquisaMusica', musicsController.getNomeMusicaPesquisa);
    app.post('/music/update', musicsController.updateEmocao);
    app.get('/music/search/result/:pesquisaMusica', musicsController.getVideoPesquisa)
}