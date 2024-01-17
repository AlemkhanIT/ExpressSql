import nunjucks from "nunjucks";
import dateFilter from 'nunjucks-date-filter';
import moment from 'moment';

function initNunjucksEnv(app) {

    let nunjucksEnv = nunjucks.configure('views', {
        express: app,
        watch: true,
        noCache: true,
        autoescape: true,
        globals: {},
    });

    const customDateFilter = (date, format) => {
        if (moment(date, format, true).isValid()) {
            return dateFilter(date, format);
        } else {
            return '';
        }
    };

    nunjucksEnv.addFilter('date', customDateFilter);

    app.use(async function (req, res, next) {
        nunjucksEnv.addGlobal('user', req.session.user);
        nunjucksEnv.addGlobal('messages', await req.consumeFlash('success'));
        nunjucksEnv.addGlobal('errors', await req.consumeFlash('error'));
        next();
    });

    return nunjucksEnv;
}

export {initNunjucksEnv}