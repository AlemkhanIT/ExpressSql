import * as Db from "./DB.js";


async function addPost(authorId, title, type, text,regionId,address,description, date_konania) {
    await Db.query(
        'INSERT INTO posts (author_id, created_at, title, type, text, region_id, address, description, date_konania) VALUES (:authorId, now(), :title, :type,:text,:regionId,:address,:description,:date_konania)',
        {authorId: authorId, title: title, type: type, text: text,regionId:regionId,address:address,description:description,date_konania:date_konania}
    );
}
async function updatePost(postId, title, type, text,regionId,address,description, date_konania) {
    await Db.query(
        'UPDATE posts SET title=:title, type=:type, text=:text, region_id=:regionId, address=:address, description=:description, date_konania=:date_konania WHERE id=:postId',
        {postId: postId, title: title, type: type, text: text,regionId:regionId,address:address,description:description,date_konania:date_konania}
    );
}
async function addComment(userId, postId, commentText) {
    await Db.query('INSERT INTO comments (author_id, post_id, comment_text, created_at) VALUES (?, ?, ?,now())',
        [userId, postId, commentText]);
}
async function findAllPosts() {
    return Db.query('SELECT p.*, u.login, DATE_FORMAT(p.created_at, \'%d.%m.%Y\') as formatted_date, DATE_FORMAT(p.date_konania, \'%d.%m.%Y\') as formatted_konania, r.city FROM posts p LEFT JOIN users u ON p.author_id = u.id LEFT JOIN regions r ON p.region_id = r.id ORDER BY p.created_at DESC');
}
async function findUserPosts() {
    return Db.query('SELECT p.*, u.login, DATE_FORMAT(p.created_at, \'%d.%m.%Y\') as formatted_date, DATE_FORMAT(p.date_konania, \'%d.%m.%Y\') as formatted_konania,r.city FROM posts p LEFT JOIN users u ON p.author_id = u.id LEFT JOIN regions r ON p.region_id = r.id WHERE p.date_konania >= CURDATE()  ORDER BY p.created_at DESC ');
}
async function findPost(id) {
    return Db.query(
        'SELECT p.*, u.login, r.city,DATE_FORMAT(p.date_konania, \'%d.%m.%Y\') as formatted_date  FROM posts p LEFT JOIN users u ON p.author_id = u.id LEFT JOIN regions r ON p.region_id = r.id WHERE p.id = ?',
        [id]);
}
async function findAllComments(id) {
    return Db.query('SELECT c.*,c.id as cId, p.id, DATE_FORMAT(c.created_at, \'%d.%m.%Y\') as formatted_date, u.login as username FROM comments c LEFT JOIN posts p ON p.id = c.post_id LEFT JOIN users u ON c.author_id = u.id  WHERE p.id = ?',
        [id]);
}

async function findRegions(){
    return Db.query('SELECT * FROM regions;');
}
async function deletePost(postId) {
    try {
        await Db.query('DELETE FROM comments WHERE post_id = :postId', { postId: postId });
        await Db.query('DELETE FROM posts WHERE id = :postId', { postId: postId });
    } catch (error) {
        throw error;
    }
}
async function deleteComment(commentId) {
    await Db.query(
        'DELETE FROM comments WHERE id = :commentId',
        {commentId: commentId}
    );
}

export {findAllPosts, findPost,findAllComments, findRegions,deletePost,deleteComment,addPost,addComment,findUserPosts,updatePost}