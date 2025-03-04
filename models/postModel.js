const db = require('../db');

// posts
exports.create = async (postData) => {
    const [postId] = await db('post').insert(postData).returning('post_id');
    return db('post').where({ post_id: postId }).first();
};

exports.getAllposts = async () => {
    return db('post')
        .join('user', 'post.user_id', 'user.user_id')
        .select('post.*', 'user.user_firstname','user.user_lastname','user.photo_path');
};

exports.getPostById = async (postId) => {
    return db('post').where({ post_id: postId }).first();
};

exports.updatePostModel = async (postId, postData) => {
    await db('post').where({ post_id: postId }).update(postData);
    return db('post').where({ post_id: postId }).first();
};

exports.deletePostModel = async (postId) => {
    return db('post').where({ post_id: postId }).del();
};

// likes
exports.countAllLike = async (postId) => {
    return db('likes').count('*').where({ post_id: postId });
};

exports.createLike = async (likeData) => {
    const [likeId] = await db('likes').insert(likeData).returning('like_id');
    return db('likes').where({ like_id: likeId }).first();
};

exports.deleteLike = async (userId, postId) => {
    return db('likes').where({ user_id: userId, post_id: postId }).del();
};

// comments
exports.createCommentModel = async (commentData) => {
    const [commentId] = await db('comment').insert(commentData).returning('comment_id');
    return db('comment').where({ comment_id: commentId }).first();
};

exports.getCommentById = async (commentId) => {
    return db('comment').where({ comment_id: commentId }).first();
}

exports.updateCommentModel = async (commentId, commentData) => {
    await db('comment').where({ comment_id: commentId }).update(commentData);
    return db('comment').where({ comment_id: commentId }).first();
};

exports.deleteCommentModel = async (commentId) => {
    return db('comment').where({ comment_id: commentId }).del();
};

exports.getCommentsByPostId = async (postId) => {
    return db('comment').where({ post_id: postId }).select('*');
};