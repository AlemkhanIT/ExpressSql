import express from "express";
import * as Posts from "../service/Posts.js"


const router = express.Router();

router.get('/', async function (req, res)  {
    let posts = await Posts.findAllPosts();
    if (!req.cookies.postRatings) {
        res.cookie('postRatings', [], {maxAge: 1000 * 3600 * 24 * 365, httpOnly: true, sameSite: "strict"});
    }
    res.render('forum.twig', {
        posts: posts,
        user:req.session.user
    });
});

router.get('/create', async function (req, res)  {
    if(user.admin){
        res.render('create-post.twig', {
            user:req.session.user
        });
    }
    else{
        req.flash('error','You are not admin');
        res.redirect('/');
    }
});

router.get("/post/:id", async function (req,res){
    let post = await Posts.findPost(req.params.id);
    let comments = await Posts.findAllComments(req.params.id);
    let regions = await Posts.findRegions();
    if(post.length === 0){
        await req.flash('error', 'Neexistuje.');
        res.redirect('/');
    }
    else if(post){
        res.render('post.twig',{
            post: post[0],
            comments: comments,
            user:req.session.user,
            regions: regions
        });
    }
});



export {router as PostContoller}