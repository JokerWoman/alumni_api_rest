require('dotenv').config(); // read environment variables from .env file
const express = require('express');
const cors = require('cors'); // middleware to enable CORS (Cross-Origin Resource Sharing)
const app = express();
const port = process.env.PORT || 3000; // if not defined, use port 8080
const host = process.env.HOST || '127.0.0.1'; // if not defined, localhost
app.use(cors()); //enable ALL CORS requests (client requests from other domain)
app.use(express.json()); //enable parsing JSON body data

//routing middleware for resource
app.use('/auth', require('./routes/auth.routes.js'))
app.use('/alumni', require('./routes/alumni.routes.js'))
app.use('/testemunha', require('./routes/testemunha.routes.js'))
app.use('/professor', require('./routes/professor.routes.js'))
app.use('/', require('./routes/routes.js'))


// handle invalid routes
app.get('*', function(req, res) {
    res.status(404).json({ message: 'Route não definida' });
})

app.listen(port, host, () => console.log(`App listening at http://${host}:${port}/`));