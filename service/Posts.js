import * as Db from "./DB.js";

async function findAllPosts() {
    return Db.query('SELECT p.*, u.login, t.name, DATE_FORMAT(p.created_at, \'%d-%b-%Y\') as formatted_date FROM posts p LEFT JOIN users u ON p.author_id = u.id LEFT JOIN type t ON p.type_id = t.id ORDER BY p.created_at DESC');
}
async function findPost(id) {
    return Db.query(
        'SELECT p.*, u.login, t.name, r.city,DATE_FORMAT(p.date_konania, \'%d-%b-%Y\') as formatted_date  FROM posts p LEFT JOIN users u ON p.author_id = u.id LEFT JOIN type t ON p.type_id = t.id LEFT JOIN regions r ON p.region_id = r.id WHERE p.id = ?',
        [id]);
}
async function findAllComments(id) {
    return Db.query('SELECT c.*, p.id FROM comments c LEFT JOIN posts p ON p.id = c.post_id WHERE p.id = ?',
        [id]);
}
export {findAllPosts, findPost,findAllComments}