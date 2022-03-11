module.exports = ( login, knex, jwt ) => {

    // Here are login into the app.
    login.post ( "/", (req, res) => {

        if ( req.body.Email === undefined || req.body.Password === undefined ) {
            res.send ( "Please enter your full details" )
        }else {
            knex.from ( "Users" ).select ().where (req.body)
            .then (( data ) => {
                let user_id = data[0].Id;
                var token = jwt.sign ({user_id}, "vishal", { expiresIn : "24h"});
                res.cookie("Token",token);
                res.send ({
                    "idOfUser": user_id,
                    "Email" : data[0].Email,
                    "Password" : data[0].Password
                });

            }).catch (( err ) => {
                res.send ( "Check your email and password...." );
                console.log ( err );
            });
        };
    });
}