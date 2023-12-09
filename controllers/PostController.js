import express from "express";
import * as Posts from "../service/Posts.js"


const router = express.Router();

router.get('/', async function (req, res)  {
    let posts = await Posts.findAllPosts();
    if (!req.cookies.postRatings) {
        // vytvorim ho s prazdnym polom a nastavim jeho platnost na jeden rok
        res.cookie('postRatings', [], {maxAge: 1000 * 3600 * 24 * 365, httpOnly: true, sameSite: "strict"});
    }
    res.render('forum.twig', {
        posts: posts,
        user:req.session.user
    });
});

router.get("/post/:id", async function (req,res){
    let post = await Posts.findPost(req.params.id);
    let comments = await Posts.findAllComments(req.params.id);
    if(post.length === 0){
        await req.flash('error', 'Neexistuje.');
        res.redirect('/');
    }
    else if(post){
        res.render('post.twig',{
            post: post[0],
            comments: comments,
            user:req.session.user
        });
    }

});


export {router as PostContoller}