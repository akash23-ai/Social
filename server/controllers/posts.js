import Post from "../models/Post.js"
import User from "../models/User.js"


/* CREATE */

export const createPost = async (req, res) => {
    try {
        const {userId, description, picturePath} = req.body
        const user = await User.findById(userId)
        const newPost = new Post(
            {
                userId,
                firstName: user.firstName,
                lastName: user.lastName,
                location: user.location,
                description: description,
                picturePath: picturePath,
                userPicturePath: user.picturePath,
                likes: {},
                comments: []

            }
        )
// save to mongoDb
        await newPost.save();
// it will return all post along with new Post

// This is a Bug also
        const post = await Post.find()

        res.status(201).json(post)

    } catch (error) {
        res.status(409).json({ErrorMessage:error.message})
    }
}


/* READ */

export const getFeedPosts = async (req,res) => {
    try {

        // finds every Post
       const post = await Post.find();
       res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ErrorMessage: error.message})
    }
}


export const getUserPosts = async (req, res) => {
    try {
        const {userId} = req.params
        console.log(userId)
        const post = await Post.find({userId})

        

        console.log(post)

        res.status(200).json(post)

    } catch (error) {
        res.status(404).json({ErrorMessage: error.message})
    }
}

/* UPDATE */

export const likePost = async (req, res) => {
    try {
       const { id } = req.params;
       const { userId } = req.body;
       const post = await Post.findById(id);
       const isLiked = post.likes.get(userId)

       if(isLiked) {
        post.likes.delete(userId)
       } else {
        post.likes.set(userId, true);
       }

       // provided by mongoose
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {
                likes: post.likes
            },
            {new : true}
        )



        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({ErrorMessage: error.message})
    }
}