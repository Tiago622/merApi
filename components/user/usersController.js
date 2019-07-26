//funções que retorna a resposta
const { check, validationResult } = require('express-validator/check');

var usersService = require('./usersService')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//var getToken = require('../auxiliares/token');
//criação de um novo utilizador
exports.createUser = async (req, res) => {
    //resposta por defeito do servidor
    let serverResponse = { status: "Not Created", response: {} }
    //variável que recebe a query da base de dados sobre o email
    var existsEmail;
    //variável que recebe a query da base de dados sobre o username
    var existsUserName;
    //token
    var token = req.headers['x-access-token'];
      if (!token) {
         serverResponse = {status:"Nao está autenticado | token expirou",response:{}}
          return res.send(serverResponse);
      }

    try {
        jwt.verify(token, 'secret');

        //***Validação do Email***/
        //verificar se o campo email está vazio e se é realmente um email
        req.checkBody('email', 'Email é obrigatório ou tem o formato errado').notEmpty().isEmail();

        //***Validação do Username***/
        req.checkBody('username', 'Username é obrigatório').notEmpty();

        //***Validação do Nome***/
        req.checkBody('nome', 'Nome é obrigatório').notEmpty();

        req.check('hashPassword', 'Password é obrigatória ou tem o formato errado').notEmpty().matches(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/);

        //verificar se o email inserido existe na base de dados
        await usersService.getUserByEmail(req.body.email).then(user => existsEmail = user).catch(err => console.log(err));

        //verificar se o username inserido existe na base de dados
        await usersService.getUser(req.body.username).then(user => existsUserName = user).catch(err => console.log(err));

        //se o email existe
        if (existsEmail != null || existsUserName != null) {

            serverResponse = { status: "Email e/ou username já existe(m) na base de dados", response: {} }
            return res.send(serverResponse);
        }

        //verificar erros 
        var errors = req.validationErrors();
        //se existir erros de validação
        if (errors) {
            console.log(errors)
            serverResponse = { status: "Erros na validação", response: errors }
            return res.send(serverResponse)
        }
        //caso contrário, cria o utilizador
        else {
            var hash = bcrypt.hashSync(req.body.hashPassword, 8);
            var newUser = {
                email: req.body.email,
                username: req.body.username,
                nome: req.body.nome,
                hashPassword: hash,
                isAdmin: req.body.isAdmin
            }
            var createUser;
            //criação de um novo user de acordo com os parâmetros recebidos
            await usersService.createUser(newUser).then(user => createUser = user).catch(err => console.log(err));
            if (createUser != null) {
                serverResponse = { status: "Utilizador Criado com Sucesso", response: createUser };
            }
            return res.send(serverResponse);
        }
    }
    catch (err) {
        console.log(err)
        serverResponse = { status: "Nao está autenticado | token expirou", response: {} }
        return res.send(serverResponse);
    }
}

//request a um utilizador de acordo com o seu username
exports.getUser = async (req, res) => {
    //resposta por defeito do servidor
    let serverResponse = { status: "Não existe na base de dados", response: {} }
    var getUser;
    const userName = req.params.username;
    //token recebido
    var token = req.headers['x-access-token'];
    //se não existir token
    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    //se existir token
    try {
        //validar
        jwt.verify(token, 'secret');
        await usersService.getUser(userName).then(user => getUser = user).catch(err => console.log(err));
        if (getUser != null) {
            serverResponse = { status: "Utilizador está na base de dados", response: getUser }
        }
        return res.send(serverResponse);
    } catch (err) {
        serverResponse = { status: "Nao está autenticado | token expirou", response: {} }
        return res.send(serverResponse);
    }

}

//request a todos os utilizadores
exports.getAllUsers = async (req, res) => {
    let serverResponse = { status: "Não existe utilizadores", response: {} }
    //variável que recebe a query da base de dados
    var allUsers;
    //token
    var token = req.headers['x-access-token'];
    //se o token não existir
    if (!token) {
        serverResponse = { status: "No token provided." }
        return res.send(serverResponse)
    }
    //caso exista
    try {
        //validar
        jwt.verify(token, 'secret');
        await usersService.getAllUsers().then(user => allUsers = user).catch(err => console.log(err));
        if (allUsers != null) {
            serverResponse = { status: "Utilizadores na Base de Dados", response: allUsers }
            return res.send(serverResponse);
        }

    } catch (err) {
        serverResponse = { status: "Failed to authenticate token." }
        return res.send(serverResponse)
    }
}

//editar um utilizador
exports.editUser = async (req, res) => {
    let serverResponse = { status: "Not Updated | Utilizador não está na base de dados | Username ou email já existem", response: {} }

    var count = Object.keys(req.body).length;
    var userUpdate;
    var email = req.body.email;
    var username = req.body.username;
    var nome = req.body.nome;
    var userAlterado;

    //username inserido no URL
    const userName = req.params.username;
    //hash da nova password inserida
    if (count === 1) {
        var hash = bcrypt.hashSync(req.body.hashPassword, 8);
        //user a atualizar
        var updateUser = {
            //email: req.body.email,
            //username: req.body.username,
            //nome: req.body.nome,
            hashPassword: hash
        }
    }
    else {
        if (req.body.email === "") {
            email = req.body.dadosExistentes.email;
        }
        if (req.body.username === "") {
            username = req.body.dadosExistentes.username;
        }
        if (req.body.nome === "") {
            nome = req.body.dadosExistentes.nome;
        }
        var updateUser = {
            email: email,
            username: username,
            nome: nome,

        }
    }

    //variável que recebe a query da base de dados sobre o username do URL
    var existsUserNameURL;
    //variável que recebe a query da base de dados sobre o email
    var existsEmail;
    //variável que recebe a query da base de dados sobre o username
    var existsUserName;

    //***Validação do Email***/

    // //verificar se o campo email está vazio e se é realmente um email
    // req.checkBody('email', 'Email is required or is not valid').notEmpty().isEmail();

    // //***Validação do Username***/
    // req.checkBody('username', 'Username is required').notEmpty();

    //***Validação do Nome***/
    //req.checkBody('nome', 'Nome is required').notEmpty();

    //***Validação da passord***/
    //req.checkBody('hashPassword', 'Password is required').notEmpty();

    //verificar erros de validação
    var errors = req.validationErrors();
    //se existir erros de validação
    if (errors) {
        serverResponse = { status: "Erros na validação", response: errors }
        return res.send(serverResponse)
    }

    //verificar se o email inserido existe na base de dados
    await usersService.getUserByEmail(req.body.email).then(user => existsEmail = user).catch(err => console.log(err));

    //verificar se o username inserido existe na base de dados
    await usersService.getUser(req.body.username).then(user => existsUserName = user).catch(err => console.log(err));

    //verificar se o username inserido existe na base de dados
    await usersService.getUser(req.params.username).then(user => existsUserNameURL = user).catch(err => console.log(err));
    //token
    var token = req.headers['x-access-token'];
    //se o token não existir
    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    //se existir
    try {
        //verificar
        jwt.verify(token, 'secret');
        //verificar se o username do URL não existe
        if (existsUserNameURL === null) {
            serverResponse = { status: "Not Updated | Username no URL é inválido ou não existe", response: userUpdate }
        }
        else {
            //verificar se email e username já estão na base de dados
            if (existsEmail == null && existsUserName == null) {
                //update à base de dados
                await usersService.editUser(updateUser, userName).then(user => userUpdate = user).catch(err => console.log(err));
                if (userUpdate != 0) {
                    await usersService.getUser(username).then(user => userAlterado = user).catch(err => console.log(err));
                    serverResponse = { status: "Updated", response: userAlterado }
                }
            }
            else {
                serverResponse = { status: "Not Updated | Username ou email já existem" }
            }
        }
        return res.send(serverResponse);
    } catch (err) {
        serverResponse = { status: "Nao está autenticado | token expirou", response: {} }
        return res.send(serverResponse);
    }
}

//eliminar utilizador
exports.deleteUser = async (req, res) => {
    let serverResponse = { status: "Not Deleted | Utilizador não está na base de dados", response: {} }
    var userDelete;
    //username inserido no URL
    const userName = req.params.username;
    //token
    var token = req.headers['x-access-token'];
    //se o token não existir
    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    //se existir
    try {
        //validar
        jwt.verify(token, 'secret');
        //apagar utilizador
        await usersService.deleteUser(userName).then(user => userDelete = user).catch(err => console.log(err));
        if (userDelete != 0) {
            serverResponse = { status: "Deleted", response: userDelete }
        }
        return res.send(serverResponse);
    } catch (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
}

exports.login = async (req, res) => {
    let serverResponse = { status: "Não Autenticado", response: {}, token: {} }
    var existsUserName;
    var username = req.body.username;
    let code = 200;
    //verficar se existe algum utilizador na base de dados com o  username inserido
    await usersService.getUser(username).then(user => existsUserName = user).catch(err => console.log(err));
    //se não existir esse utilizador ou a password estiver errada
    if (existsUserName == null || !bcrypt.compareSync(req.body.hashPassword, existsUserName.hashPassword)) {
        serverResponse.status = "Username ou password errados";

    }
    //se existir o utilizador e a password bater certo
    else {
        // create a token
        var token = jwt.sign({
            userID: existsUserName.userID, username: existsUserName.username,
            nome: existsUserName.nome, isAdmin: existsUserName.isAdmin
        }, 'secret', {
                expiresIn: 2000 // expires in 10 minutos ***PARA TESTES****

            });
        serverResponse.status = "Autenticado";
        serverResponse.response = existsUserName;
        serverResponse.token = token;
    }
    //resposta do servidor
    res
        .json(serverResponse);
}