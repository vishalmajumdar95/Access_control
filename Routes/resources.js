module.exports = ( resources, knex, jwt ) => {

    resources.post ( "/newresource" , ( req, res ) => {
        let cookie = req.headers.cookie;
        if (cookie == undefined) {
            res.send ( "Please login fisrtly" );
        }else {
            let token = cookie.slice(6);
            let user_id = jwt.verify ( token , "vishal" ).user_id;
            console.log ( user_id )

            knex ( "Users" ).select ( "Role" ).where ( "Id", user_id )
            .then (( data ) => {
                if ( data[0].Role == "SuperAdmin" ) {
                    if ( req.body.Name == undefined || req.body.Type == undefined ) {
                        res.send ( "Please input valid data..." );
                    }else {
                        knex ( "Resources" ).insert (req.body)
                        .then (( data ) => {
                            res.send ( "You have successfully add this resource....");
                            console.log ( data );
                        }).catch (( err ) => {
                            res.send ( "There are some errors in the app..." );
                            console.log ( err );
                        });
                    };
                }else {
                    res.send ( "Only super admin can add resources.....");
                }
            }).catch (( err ) => {
                res.send ( "Hello" );
                console.log ( err );
            });
        };
        
    });  
    
    resources.put ( "/updateresource/:name" , ( req, res ) => {
        
        let cookie = req.headers.cookie;
        if (cookie == undefined) {
            res.send ( "Please login fisrtly" );
        }else {
            let token = cookie.slice(6);
            let user_id = jwt.verify ( token , "vishal" ).user_id;
            let resourceName = req.params.name;
            knex ( "Users" ).select ( "Access" ).where ( "Id", user_id )
            .then (( data ) => {
                if ( data[0].Access == "Yes" ) {
                    if ( req.body.Name == undefined || req.body.Type == undefined ) {
                        res.send ( "Please input valid data..." );
                    }else {
                        knex ( "Resources" ).update (req.body).where ( Name , re)
                        .then (( data ) => {
                            res.send ( "You have successfully add this resource....");
                            console.log ( data );
                        }).catch (( err ) => {
                            res.send ( "There are some errors in the app..." );
                            console.log ( err );
                        });
                    };
                }else {
                    res.send ( "Only who can update resources, who have access to update resources....." );
                }
            }).catch (( err ) => {
                res.send ( "There is some errors...." );
                console.log ( err );
            });
        };    
    });

    resources.get ( "/getresources/:name", ( req, res ) => {
        let cookie = req.headers.cookie;
        if (cookie == undefined) {
            res.send ( "Please login fisrtly" );
        }else {
            let token = cookie.slice(6);
            let user_id = jwt.verify ( token , "vishal" ).user_id;
            console.log (user_id);
            let resourceName = req.params.name;
            knex ( "Resources" ).select ().where ( "Name", resourceName)
            .then (( data ) => {
                res.send ( data );
            }).catch (( err ) => {
                res.send ( "There is no resource of this name");
            })
        };
    });

    resources.get ( "/getallresources" , (req, res) => {
        let cookie = req.headers.cookie;
        if (cookie == undefined) {
            res.send ( "Please login fisrtly" );
        }else {
            let token = cookie.slice(6);
            let user_id = jwt.verify ( token , "vishal" ).user_id;
            console.log ( user_id );
            knex.select().from ( "Resources" )
            .then (( data ) => {
                res.send ( data );
            }).catch (( err ) => {
                res.send ( "There is no resource.");
            })
        };    
    })
}
