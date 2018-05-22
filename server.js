// импорт модуля http и объекта app, сгенерированного с помощью Express
const http = require('http');
const app = require('./app');

// создание сервера
const server = http.createServer(app);

// определение порта, на котором будет работать API 
const PORT = process.env.PORT || 3000;
server.listen(PORT);

