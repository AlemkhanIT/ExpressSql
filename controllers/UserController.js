import express from "express";
import {authenticate, authorize, setUserPassword} from "../service/Security.js";

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

router.get("/logout", function (req, res) {
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

export {router as UserController}