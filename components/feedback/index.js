module.exports = (app) => {
    var feedbackController = require('./feedbackController');
    const rateLimit = require('express-rate-limit');
    //rate limit para o upload de músicas

    //rate limit para os restantes pedidos
    const requestsLimit = rateLimit({
        windowMs: 40*1000, // 40 segundos
        max: 15, // bloqueia após 15 pedidos
        message:{status:"Realizou demasiados pedidos ao servidor nos últimos minutos. Tente novamente mais tarde"}
    });

    const requestsLimitPesquisa = rateLimit({
        windowMs: 5*1000, // 40 segundos
        max: 50, // bloqueia após 50 pedidos
        message:{status:"Realizou demasiados pedidos ao servidor nos últimos minutos. Tente novamente mais tarde"}
    });
    app.post('/feedback/new', requestsLimit, feedbackController.newFeedback);
    app.post('/feedback/:id/edit', requestsLimit,feedbackController.editFeedback);
    //listar o feedback de uma determinada musica de um determinado utilizador
    app.post('/feedback/list',requestsLimitPesquisa,feedbackController.listFeedback);
    //listar os feedbacks de um utilizador
    app.get('/feedback/:id/list',requestsLimit,feedbackController.listFeedbackForUser)
}