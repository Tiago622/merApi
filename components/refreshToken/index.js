module.exports = (app) => {
    var tokenController = require('./tokenController');
    app.post('/token/refresh',tokenController.refreshToken);
}