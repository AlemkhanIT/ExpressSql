import express from "express";
import * as Posts from "../service/Posts.js"
import {authorize} from "../service/Security.js";
import {findPostOfComment} from "../service/Posts.js";


const router = express.Router();


router.get('/create', authorize(), async function (req, res)  {
        let regions = await Posts.findRegions();
        res.render('create-post.twig', {
            user:req.session.user,
            regions: regions
        });
});
router.post('/add',authorize(),async function (req,res){
    if(req.body.title==""||req.body.regionId==""||req.body.date_konania==""){
        req.flash("error","Musite zaplnit' Title,datum konania, region");
        res.redirect('/post/create');
    }else{
        await Posts.addPost(req.session.user.id, req.body.title,req.body.type,req.body.text,req.body.regionId,req.body.address,req.body.description,req.body.date_konania);
        await req.flash('success', 'Post was created.');
        res.redirect('/');
    }
})

router.get("/:id", async function (req,res){
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

router.get('/delete/:postId', authorize(), async function (req, res) {
    await Posts.deletePost(req.params.postId);
    await req.flash('success', 'Príspevok bol vymazaný.')

    res.redirect('/');
});

router.post('/comment/:postId', async function (req, res) {
    try {
        let userId = null; // Default to null

        if (req.session && req.session.user) {
            userId = req.session.user.id;
        }

        // Add the comment with the determined userId (can be null)
        await Posts.addComment(userId, req.params.postId, req.body.comment_text);
        res.redirect('/post/' + req.params.postId);
    } catch (error) {
        console.error(error);
        res.redirect('/post/' + req.params.postId);
    }
});

router.get('/:postId/deleteComment/:commentId', authorize(), async function (req, res) {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        await Posts.deleteComment(commentId);

        res.redirect('/post/' + postId);
    } catch (error) {
        console.error(error);
        res.redirect('/post/' + postId);
    }
});

router.post('/update/:postId', authorize(),async function (req, res) {
    try {
        if(req.body.title==""||req.body.regionId==""||req.body.date_konania==""){
            req.flash("error","Musite zaplnit' Title,datum konania, region");
            res.redirect('/post/'+req.params.postId);
        }
        else{
            await Posts.updatePost(req.params.postId, req.body.title, req.body.type,req.body.text,req.body.regionId,req.body.address,req.body.description,req.body.date_konania);
            res.redirect('/post/' + req.params.postId);
        }
    } catch (error) {
        console.error(error);
        res.redirect('/post/' + req.params.postId);
    }
});

export {router as PostContoller}