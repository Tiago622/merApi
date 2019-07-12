module.exports = (app) => {
    var feedbackController = require('./feedbackController');
    const rateLimit = require('express-rate-limit');
    //rate limit para o upload de músicas

    //rate limit para os restantes pedidos
    const requestsLimit = rateLimit({
        windowMs: 60*1000, // 60 segundos
        max: 15, // bloqueia após 15 pedidos
        message:{status:"Realizou demasiados pedidos ao servidor nos últimos minutos. Tente novamente mais tarde"}
    });
    app.post('/feedback/new', requestsLimit, feedbackController.newFeedback);
    app.post('/feedback/:id/edit', requestsLimit,feedbackController.editFeedback);
}