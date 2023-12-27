import * as Db from './DB.js';
import sha256 from 'crypto-js/sha256.js';
import hex from 'crypto-js/enc-hex.js';


function authorize() {
    return (req, res, next) => {
        const user = req.session.user;
        if (user) {
            if (user.admin) {
                next();
            } else {
                req.flash('error', `Pre prístup je vyžadovaná rola Admin!`);
                res.redirect('/');
            }
        } else {
            req.flash('error', 'Prístup len pre prihlásených používateľov!');
            res.redirect('/');
        }
    }
}


function hashPassword(password) {
    // pripojit pred heslo retazec SALT, vypocitat hash algoritmom sha256 a skonvertovat ho na hex retazec.
    return sha256(process.env.PWD_SALT + password).toString(hex);
}


async function setUserPassword(username, password) {
    await Db.query('UPDATE users SET password = :pwd WHERE login = :username', {
        pwd: hashPassword(password),
        username: username
    });
}


async function authenticate(username, password) {
    let dbUsers = await Db.query('SELECT * FROM users WHERE login = :user', {
        user: username
    });

    if (dbUsers.length ===0) {
        console.log(`Pouzivatel ${dbUser.username} sa nenasiel.`);
        return null;
    }

    let dbUser = dbUsers.pop();

    if (dbUser.password !== hashPassword(password)) {
        console.log(dbUser.password ,hashPassword(password) );
        return null;
    }

    return dbUser;
}

export {authorize, authenticate, hashPassword, setUserPassword};