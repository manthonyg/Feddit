const Post = require('../models/post');


exports.createPost = async (req, res, next) => {

  const url = req.protocol + '://' + req.get("host");

    const post = new Post({
      title: req.body.title,
      message: req.body.message,
      imagePath: url + '/images/' + req.file.filename,
      creator: req.userData.userId
  });
  try {
    const savedPost = await post.save()
    res
    .status(201)
    .json(savedPost)
  }
  catch(error) {
    res
    .status(404)
    .json({
      error: 'Could not create post'
    })
  }
};


exports.getPostCount = async (req, res, next) => {

  try {
    const postCount = await Post.count();
    res
    .status(200)
    .json(postCount)
  }
  catch(error) {
    res
    .status(404)
    .json({
      error: 'Could not get post count'
    })
  }
};


exports.getPosts = async (req, res, next) => {

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find().limit(5);

  if (pageSize && currentPage) {   
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(+pageSize);
  }

  try {
    const posts = await postQuery;

    res
    .status(200)
    .json(posts);
  }
  catch(error) {
    res
    .status(404)
    .json({
      error: 'Could not get posts'
    })
  }
};

exports.updatePost = async (req, res, next) => {
    
  const url = req.protocol + '://' + req.get("host");
  let imagePath = req.body.imagePath;

  if (req.file) {
    // multer found an image File
      imagePath = url + '/images/' + req.file.filename
  }

    updatedPost = {
      title: req.body.title,
      message: req.body.message,
      imagePath: imagePath
    }
    
    try {
      await Post.updateOne({_id: req.params.postId, creator: req.userData.userId}, updatedPost)
      res
      .status(200)
      .json(updatedPost)
    }
    catch(error) {
      res
      .status(404)
      .json({
        error: 'Could not update post'
      })
    }
};

exports.getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId
    const post = await Post.findById({_id: postId})
    res
    .status(200)
    .json(post);
  }
  catch(error) {
    res
    .status(404)
    .json({
      error: 'Could not get post'
    })
  }
}

exports.deletePost = async (req, res, next) => {
  const targetId = req.body._id

  try {
    await Post.deleteOne({_id: targetId, creator: req.userData.userId})
    res
    .status(200)
    .json({
      message: 'Successfully deleted'
    });
  }

  catch(error) {
    res
    .status(404)
    .json({
      error: 'Could not delete'
    })
    
  }
}