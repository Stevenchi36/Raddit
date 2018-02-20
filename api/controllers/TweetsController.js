/**
 * TweetsController
 *
 * @description :: Server-side logic for managing tweets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	createTweet: function(req, res){
        var content = req.body.tweetContent;
        var author = req.session.ID;
        Tweets.create({content:content, author:author}).exec(function(err){
            if(err){
                res.send(500, 'Database Error');
            }
            res.redirect('/');
        });
    },
    // List tweets of looged in user on homepage
    listTweets: function(req, res){
        var author = req.session.ID;
        if(author != undefined){
            Tweets.find({author:author}).exec(function(err, tweets){
                if(err){
                    res.send(500, {error: 'Database Error'});
                }
                User.findOne({id:author}).exec(function(err, user){
                    res.view('homepage', {tweets:tweets, user:user});
                });
            });
        }
        else{
            res.view('homepage');
        }
    },
    // Search for tweets
    search: function(req, res){
        // var searchString = req.body.searchString;
        var searchString = "#" + req.params.searchString;
        // Make query based on search
        Tweets.find({
            content : {
                'contains' : searchString
            },
            sort: 'createdAt DESC'
        }).populate('author').exec(function(err, searchResults){
            if(err){
                res.send(500, {error: 'Database Error'});
            }
            res.view('search', {tweets:searchResults});
        });
    }
};