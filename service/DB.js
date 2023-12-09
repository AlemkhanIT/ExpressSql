import mysql from 'mysql2';


let pool = null;


function getDbConnection() {
    if (pool === null) {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            namedPlaceholders: true
        });
    }
    return pool.promise();
}


async function query(sql, params) {
    let [rows, fields] = await getDbConnection().execute(sql, params);
    return rows;
}

export {query}