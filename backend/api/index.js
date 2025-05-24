require('dotenv').config();

const express = require('express');
const app = express();
const { sql } = require('@vercel/postgres');

const bodyParser = require('body-parser');
const path = require('path');

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.status(200).json({"message": "OK"});
});

app.listen(3000, () => console.log('Server ready on port 3000.'));

module.exports = app;
