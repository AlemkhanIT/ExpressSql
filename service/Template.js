import nunjucks from "nunjucks";
import path from 'node:path';
import dateFilter from 'nunjucks-date-filter';

function initNunjucksEnv(app) {

    let nunjucksEnv = nunjucks.configure('views', {
        express: app,
        watch: true,
        noCache: true,
        autoescape: true,
        globals: {},
    });



    nunjucksEnv.addFilter('date', dateFilter);

    // spristupnit niektore premenne z requestu vo view templates
    app.use(async function (req, res, next) {
        nunjucksEnv.addGlobal('user', req.session.user);
        nunjucksEnv.addGlobal('messages', await req.consumeFlash('success'));
        nunjucksEnv.addGlobal('errors', await req.consumeFlash('error'));
        next();
    });

    return nunjucksEnv;
}

export {initNunjucksEnv}