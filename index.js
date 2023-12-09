import * as Posts from "./service/Posts.js"
import dotenv  from "dotenv";
import express from "express";
import {PostContoller} from "./controllers/PostController.js";
import {UserController} from "./controllers/UserController.js";
import sessions from "express-session";
import MemoryStore from "express-session/session/memory.js";
import cookieParser from 'cookie-parser';
import {flash} from 'express-flash-message';
import {initNunjucksEnv} from "./service/Template.js";


dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));


app.use(sessions({
    name: "moje.session.id",
    secret: "tajne-heslo",
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // platnost cookie 1 den
        httpOnly: true,
        SameSite: 'None',
    },
    resave: false,
    //store:  new (FileStore(sessions))({ // ukladanie session dat do suboru (nefunguje dobre vo Windows)
    //     path: 'sessions'
    //}),
    store: new MemoryStore({  // ukladanie session dat do pamate (nevhodne pre produkcnu prevadzku)
        checkPeriod: 3600000
    }),
}));
app.use(flash());
let nunjucksEnv = initNunjucksEnv(app);
app.use(cookieParser());
app.use("/", PostContoller);
app.use("/user", UserController);
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});