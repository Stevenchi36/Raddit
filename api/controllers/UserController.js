/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	showUsers : function(req, res){
        User.find({}).exec(function(err, users){
            if(err){
                res.send(500, {error: 'Database Error'});
            }
            res.view('showUsers', {users:users});
        });
    },

    addUser : function(){
        res.view('addUser.ejs');
    },

    //Register User
    registerUser: function(req,res){
        var username = req.body.username;
        var pw = req.body.password;
        // bcrypt
        var bcrypt = require('bcrypt');
        const saltRounds = 10;
        // Encrypt Password
        bcrypt.genSalt(saltRounds, function(err, salt){
            bcrypt.hash(pw, salt, function(err, hash){
                // Put user info into database
                console.log(hash);
                if(res){
                    User.create({username:username, password:hash}).exec(function(err){
                        if(err){
                            res.send(500, 'Database Error');
                        }
                        res.redirect('showUsers');
                    });
                }
            });
        });
    },

    login : function(req, res){
        res.view('login');
    },

    // Login and create session variable
    loginUser: function(req, res){
        // Grab user and pass
        var username = req.body.username;
        var pw = req.body.password;
        // bcrypt compare
        var bcrypt = require('bcrypt');
        User.findOne({username:username}).exec(function(err, resUser){
            // console.log(resUser);
            if(err){
                res.redirect(login);
            }
            else{
                bcrypt.compare(pw, resUser.password, function(err, resComp){
                    // If passwords match, set session to username
                    if(resComp){
                        req.session.ID = resUser.id;
                        req.session.userName = resUser.username;
                        console.log(resUser.id);
                        res.redirect('/');
                    }
                    else{
                        console.log("Password mismatch");
                    }
                });
            }
        });
    },
    // Logout and destroy session
    logout: function(req, res){
        req.session.destroy(function(err){
            setTimeout(function(){
                res.redirect('login');
            }, 1000);
        });
    },
    // Search for user and display their tweets
    userSearch: function(req, res){
        var username = req.params.username;
        console.log(username);
        User.findOne({username:username}).populate('tweets', {
            limit: 20,
            sort: 'createdAt DESC'
        }).exec(function(err, userTweets){
            if(err){
                res.send(500, {error: 'Database Error'});
            }
            console.log(userTweets);
            res.view('user', {tweets:userTweets, username:username});
        });
    }
};

