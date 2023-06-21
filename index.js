const http = require('http'); 
const express = require('express'); 
const app = express(); 
const server = http.createServer(app); 

require("dotenv-safe").config(); //biblioteca para carregar as variáveis de ambiente
const jwt = require('jsonwebtoken');
 
const bodyParser = require('body-parser'); //biblioteca para converter o body da requisição em vários formatos
app.use(bodyParser.json());
 
app.get('/', (req, res, next) => {
    res.json({message: "Tudo ok por aqui!"});
})
 
app.get('/rota_privada', verifyJWT, (req, res, next) => {
  res.status(200).json({ message: 'Você está na rota privada!' });
});

app.get('/clientes', verifyJWT, (req, res, next) => { 
    console.log(req.userId + ' autenticado');
    res.json([{id:1,nome:'Michelle Hanne'}]);
})


//authentication
app.post('/login', (req, res, next) => {
    //esse teste abaixo deve ser feito no seu banco de dados
    if(req.body.user === 'arquiteturaWeb' && req.body.password === '123'){
      //auth ok
      const id = 1; //esse id viria do banco de dados
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300 // expires in 5min
      });
      return res.json({ auth: true, token: token });
    }
    
    res.status(500).json({message: 'Login inválido!'});
})

app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
})
 

function verifyJWT(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

      req.userId = decoded.id;
      next();
    });
}


server.listen(3000);
console.log("Servidor escutando na porta 3000...")