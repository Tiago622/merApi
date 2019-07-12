const fetch = require('node-fetch');

test('Erros na introdução do username ou da password', async () => {
  /*const loginData = {
    username: "admin",
    hashPassword: "admin1"
  };
  var status;

  await fetch('http://localhost:8000/auth/login', {
    method: 'post',
    body: JSON.stringify(loginData),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(json => status = json.status);
  expect(status).toBe("Username ou password errados")*/
});

test('Login a um utilizador que exista', async () => {
  /*const loginData = {
    username: "admin",
    hashPassword: "admin"
  };
  var status;

  await fetch('http://localhost:8000/auth/login', {
    method: 'post',
    body: JSON.stringify(loginData),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(json => status = json.status);
  expect(status).toBe("Autenticado")*/
});