import express from "express";
import {authenticate, authorize, registration, setUserPassword,checkUser,authorizeUser} from "../service/Security.js";

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login.twig', {  });
});
router.post('/check', function (req,res){
    authenticate(req.body.username, req.body.password).then(async (user) => {
        console.log(user)
        if (user) {
            req.session.user = user;
            console.log('Login OK', user);
            await req.flash('success', 'Login OK');

            req.session.save(() => {
                res.redirect('/');
            });
        }else {
            console.log('Login failed');
            await req.flash('error', 'Chybné meno alebo heslo!');
            res.redirect('/user/login');
        }
    }).catch(()=>{
        req.flash('error','Nespravne heslo alebo login');
        res.redirect('/user/login')
    })
});

router.get("/logout", authorizeUser(), function (req, res) {
    let sessionName = req.session.name;
    req.session.destroy(async function(err) {
        if (err) {
            console.error(err);
        } else {
            res.clearCookie(sessionName);
            res.redirect('/');
        }
    });
});

router.get('/registration', (req, res) => {
    res.render('registration.twig', {  });
});
router.get('/changePass', authorizeUser(), (req, res) => {
    res.render('changePass.twig', {  });
});
router.post('/changePass',authorizeUser(),async (req,res)=>{
    if(req.body.pass1.length>3&&req.body.pass1 == req.body.pass2){
        await setUserPassword(req.session.user.id,req.body.pass1);
        await req.flash("success","Heslo bole zmenene");
        res.redirect('/user/changePass');
    }else{
        await req.flash('error',"Hesla musia byt' rovnake, heslo musi obsahovat' minimalne 4 znakov");
        res.redirect('/user/changePass');
    }
})
router.post('/registration', async function (req,res){
    if(req.body.username.length>3&&req.body.pass1.length>3&&req.body.pass1 == req.body.pass2){
        try {
            const username = await checkUser(req.body.username);
            if(username === 11){
                registration(req.body.username,req.body.pass1);
                res.redirect('/user/login');
            }
            else{
                req.flash("error","Meno zaneprazdnene");
                res.redirect("/user/registration");
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }else{
        req.flash('error',"Hesla musia byt' rovnake, meno a heslo musi obsahovat' minimalne 4 znakov");
        res.redirect('/user/registration');
    }
});

export {router as UserController}