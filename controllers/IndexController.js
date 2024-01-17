import express from "express";
import * as Posts from "../service/Posts.js"


const router = express.Router();

router.get('/', async function (req, res)  {
    let posts;
    const user = req.session.user;
    if(user){
        if (user.admin){
            posts = await Posts.findAllPosts();
        }
        else{
            posts = await Posts.findUserPosts();
        }
    }else{
        posts = await Posts.findUserPosts();
    }
    if (!req.cookies.postRatings) {
        res.cookie('postRatings', [], {maxAge: 1000 * 3600 * 24 * 365, httpOnly: true, sameSite: "strict"});
    }
    res.render('forum.twig', {
        posts: posts,
        user:req.session.user
    });
});

export {router as IndexController}