const mysql = require("mysql");
require('dotenv').config({ path: `${__dirname}/.env` })

// Mysql Connection
var con = mysql.createConnection({
    host: process.env.HOST_NAME,
    user: process.env.USER_NAME,
    password: process.env.USER_PASSWORD
})

con.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("database connected....")
    }
})

// Knex connection
const knex = require ( "knex" ) ({
    client : "mysql" , 
    connection : {
        host : process.env.HOST_NAME,
        user : process.env.USER_NAME,
        password : process.env.USER_PASSWORD,
        database : process.env.DATABASE_NAME
    }
});


// Knex Schema for Create Table
knex.schema.hasTable ( "Users" ).then( exists => {
    if ( !exists ) {
        knex.schema.createTable ( "Users" , ( table ) => {
            table.increments ( "Id" ).primary(),
            table.string ( "Email" ).unique().notNullable(),
            table.string ( "Password" ).notNullable(),
            table.string ( "Name" ),
            table.string ( "Role" ),
            table.string ( "Access" )
        }).then (( data ) => {
            console.log ( "Table created" );
            console.log ( data );
        }).catch (( err ) => {
            console.log ( err );
        });
    }else {
        console.log ( "Table already created" );
    };
});

knex.schema.hasTable ( "Resources" ).then ( exists => {
    if ( !exists ) {
        knex.schema.createTable ( "Resources" , ( table ) => {
            table.increments ( "Id").primary (),
            table.string ( "Name" ),
            table.string ( "Type" )
        }).then (( data ) => {
                console.log ( data )
                console.log ( "Table created" );
        }).catch (( err ) => {
            console.log ( err );
        });
    }else {
        console.log ( "Table already created" );
    };
});

module.exports = knex;