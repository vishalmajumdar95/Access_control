module.exports = ( register, knex, jwt) => {
    register.post ("/" , ( req , res ) => {
        if ( req.body.Email === undefined || req.body.Password === undefined || req.body.Name === undefined ) {
            res.send ( "Please enter your full details" )
        }else {
            knex ("Users").select ().then (( data ) => {
                if (data.length == 0) {
                    knex ( "Users" ).insert ([{
                        "Email" : req.body.Email,
                        "Password" : req.body.Password,
                        "Name" : req.body.Name,
                        "Role" : "SuperAdmin",
                        "Access" : "Yes"
                    }]).then (( data ) => {
                        res.send ({
                            "userId" : data[0].Id,
                            "Email" : req.body.Email,
                            "Password" : req.body.Password,
                            "Name" : req.body.Name
                        });
                        console.log ( "Data inserted successfully... " );
                    }).catch (( err ) => {
                        console.log ( err );
                        res.send ( "This user is already created" )
                    });
                }else {
                    let cookie = req.headers.cookie;
                    if ( cookie == undefined ) {
                        res.send ( "Please login firstly" );
                    }else {
                        let token = cookie.slice(6);
                        let user_id = jwt.verify ( token , "vishal" ).user_id;
                        knex ( "Users" ).select ( "Role" ).where ( "Id", user_id )
                        .then (( data ) => {
                            if ( data[0].Role == "SuperAdmin") {
                                if (req.body.Role !== undefined) {
                                    knex ( "Users").insert([{
                                        "Email" : req.body.Email,
                                        "Password" : req.body.Password,
                                        "Name" : req.body.Name,
                                        "Role" : req.body.Role,
                                        "Access" : req.body.Access
                                    }]).then (( data ) => {
                                        console.log ( data )
                                        res.send ({
                                            "Email" : req.body.Email,
                                            "Password" : req.body.Password,

                                        });
                                    }).catch (( err ) => {
                                        res.send ( "This user is already created" );
                                    })
                                }else {
                                    res.send ( "Please enter role also....")
                                };    
                            }else {
                                res.send ( "Only super admin can create user" )
                            }
                        })
                    }
                    
                }
            });                
        };
        
    });

    register.put ( "/update/:id" , ( req, res ) => {

        let cookie = req.headers.cookie;
        if ( cookie == undefined ) {
            res.send ( "Please login firstly" );
        }else {
            let token = cookie.slice(6);
            let user_id = jwt.verify ( token , "vishal" ).user_id;
            let update_id = req.params.id;
            knex ( "Users" ).select ( "Role" ).where ( "Id", user_id )
            .then (( data ) => {
                if (data[0].Role == "SuperAdmin" ) {
                    if ( req.body == undefined ) {
                        console.log ( "Please enter something that you want to update....." );
                    }else {
                        knex ( "Users" ).where ( "Id" , update_id).update ( req.body )
                        .then (( data ) => {
                            res.send ( "Updated successfully....." );
                            console.log ( data );
                        }).catch (( err ) => {
                            res.send ( "There is no user with this id...")
                            console.log ( err );
                        })
                    }
                }else {
                    res.send ( "Only super admin can update this")
                }
                
            }).catch (( err ) => {
                res.send ( err )
            })
        }        
    })
}