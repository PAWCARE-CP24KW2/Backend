const postModel = require('../models/postModel');
const multer = require("multer");
const minioClient = require("../config/minioClient");
const upload = multer({ storage: multer.memoryStorage() });

// posts
exports.createPost = async (req, res) => {
    const { userId } = req.user;
    const { post_title = null, post_content = null } = req.body;
    const file = req.file;

    try {
        let postPhotoPath = null;

        if (file) {
            const bucketName = "postphotos";
            const objectName = `${Date.now()}-${file.originalname}`;

            const bucketExists = await minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                await minioClient.makeBucket(bucketName, "us-east-1");
            }

            await minioClient.putObject(bucketName, objectName, file.buffer, file.size, {
                "Content-Type": file.mimetype,
                "Content-Disposition": "inline",
            });

            postPhotoPath = `http://cp24kw2.sit.kmutt.ac.th:9001/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${objectName}&version_id=null`;
        }

        const postData = {
            post_title,
            post_content,
            post_photo_path: postPhotoPath,
            user_id: userId,
        };

        const newPost = await postModel.create(postData);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.upload = upload.single('post_photo');

exports.getPost = async (req, res) => {
    try {
        const posts = await postModel.getAllposts();
        const postsWithDetails = await Promise.all(posts.map(async (post) => {
            const likeCount = await postModel.countAllLike(post.post_id);
            const commentCount = await postModel.countAllComments(post.post_id);
            return {
                ...post,
                likes: likeCount[0]['count(*)'],
                comments: commentCount[0]['count(*)']
            };
        }));
        res.json(postsWithDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPostByIdCon = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await postModel.getPostByIdModel(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const likeCount = await postModel.countAllLike(post.post_id);
        const commentCount = await postModel.countAllComments(post.post_id);

        const postWithDetails = {
            ...post,
            likes: likeCount[0]['count(*)'],
            comments: commentCount[0]['count(*)']
        };

        res.status(200).json(postWithDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePostCon = async (req, res) => {
    const { postId } = req.params;
    const { post_title, post_content } = req.body;
    const file = req.file;
    const { userId } = req.user;

    try {
        const post = await postModel.getPostByIdModel(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.user_id !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this post' });
        }

        let postPhotoPath = post.post_photo_path;

        if (file) {
            const bucketName = "postphotos";
            const objectName = `${Date.now()}-${file.originalname}`;

            const bucketExists = await minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                await minioClient.makeBucket(bucketName, "us-east-1");
            }

            await minioClient.putObject(bucketName, objectName, file.buffer, file.size, {
                "Content-Type": file.mimetype,
                "Content-Disposition": "inline",
            });

            postPhotoPath = `http://cp24kw2.sit.kmutt.ac.th:9001/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${objectName}&version_id=null`;
        }

        const postData = {
            post_title: post_title || post.post_title,
            post_content: post_content || post.post_content,
            post_photo_path: postPhotoPath,
        };

        const updatedPost = await postModel.updatePostModel(postId, postData);
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePostCon = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;

    try {
        const post = await postModel.getPostByIdModel(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.user_id !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this post' });
        }

        if (post.post_photo_path) {
            const url = new URL(post.post_photo_path);
            const objectName = url.searchParams.get('prefix');
            const bucketName = url.pathname.split('/')[4];

            await minioClient.removeObject(bucketName, objectName);
        }

        await postModel.deletePostModel(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// likes
exports.pushLike = async (req, res) => {
    const { userId } = req.user;
    const { postId } = req.params;

    try {
        const likeData = {
            user_id: userId,
            post_id: postId
        };

        const newLike = await postModel.createLike(likeData);
        res.status(201).json(newLike);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.unLike = async (req, res) => {
    const { userId } = req.user;
    const { postId } = req.params;

    try {
        await postModel.deleteLike(userId, postId);
        res.status(200).json({ message: 'Like deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// comments
exports.createCommentCon = async (req, res) => {
    const { userId } = req.user;
    const { postId } = req.params;
    const { comment_content } = req.body;

    try {
        const commentData = {
            commend_content: comment_content,
            post_id: postId,
            user_id: userId
        };

        const newComment = await postModel.createCommentModel(commentData);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCommentCon = async (req, res) => {
    const { commentId } = req.params;
    const { comment_content } = req.body;
    const { userId } = req.user;

    try {
        const comment = await postModel.getCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.user_id !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this comment' });
        }

        const commentData = {
            commend_content: comment_content
        };

        const updatedComment = await postModel.updateCommentModel(commentId, commentData);
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCommentCon = async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.user;

    try {
        const comment = await postModel.getCommentById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.user_id !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this comment' });
        }

        await postModel.deleteCommentModel(commentId);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCommentsByPostIdCon = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await postModel.getCommentsByPostId(postId);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};