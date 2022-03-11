const express = require ( "express" );
const bodyParser = require ( "body-parser" );
const jwt = require ( "jsonwebtoken" );
const mysql = require ( "mysql" );
require ("dotenv").config();


const app = express();
app.use ( bodyParser.json() );

const knex = require ("./db/db")

var register = express.Router ();
app.use ( "/register" , register );
require ( "./Routes/register") ( register, knex, jwt );

var login = express.Router();
app.use ( "/login" , login );
require ( "./Routes/login" ) ( login, knex, jwt );

var resources = express.Router();
app.use ( "/resources" , resources );
require ( "./Routes/resources" ) ( resources, knex, jwt );

app.listen (6000, () => {
    console.log ( "Your app is running on port 6000");
});