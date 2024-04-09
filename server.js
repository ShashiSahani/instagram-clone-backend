// const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");
// const cors = require("cors");
// const app = express();
// const fs = require("fs");
// const { type } = require("os");
// const WebSocket=require('ws');
// const { error } = require("console");

// const wss=new WebSocket.Server({port:8080})



// wss.on('connection', (ws) => {
//   console.log('Client connected');
  
//   // Handle WebSocket messages here
//   ws.on('message', (message) => {
//     console.log('Received message:', message);
//     // Broadcast the message to all clients
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   });

//   // Close WebSocket connection
//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });

// // Log WebSocket server start
// console.log('WebSocket server started');


// app.use(express.urlencoded({extended:true}))
// const formParser = multer();
// // MongoDB Atlas connection URI
// const mongoURI =
//   "mongodb+srv://shashisahani496:123456789ok@cluster0.lhlqwh4.mongodb.net/commentsDB";

// app.use(cors());
// // Create MongoDB Atlas connection
// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// //Image Storage Engine
// const storage = multer.diskStorage({
//   destination: "./upload/images",
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// const upload = multer({
//   storage: storage,
// });

// app.use("/images", express.static("upload/images"));

// // Create Schema to upload Post
// const Post = mongoose.model("Post", {
//   image: {
//     type: String,
//     required: true,
//   },
//   Date: {
//     type: Date,
//     default: Date.now,
//   },
//   likes: {
//     type: Number,
//     default: 0,
//   },
//   comments: [
//     {
//       text: {
//         type: String,
//         required: true,
//       },
//       createdAt: {
//         type: Date,
//         default: Date.now,
//       }
//     }
//   ],
//   description: {
//     type: String,
//     require: true,
//   },
// });

// app.post("/posts", upload.single("image"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }
//   const {description}=req.body;
//   const imageUrl = `http://localhost:${process.env.PORT || 5000}/images/${
//     req.file.filename
//   }`;
//   try {
//     const newPost = new Post({ image: imageUrl,description:description });
//     await newPost.save();
//     console.log("Save!");
//     res.json({ success: true, image: imageUrl ,description:description});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// //fetch all the image with strose in data base

// app.get("/posts", async (req, res) => {
//   try {
//     const posts = await Post.find({});
//     if (!posts || posts.length === 0) {
//       return res.status(404).json({ error: "no post found" });
//     }
//     //log the fetch data

//     console.log("Fetch data ", posts);
//     res.status(200).json(posts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// //handle delete request
// app.delete("/posts/:id", async (req, res) => {
//   const postId = req.params.id;

//   try {
//     console.log(postId, "postId");
//     const deletedPost = await Post.findByIdAndDelete(postId);
//     if (!deletedPost) {
//       return res.status(404).json({ error: "Post not found" });
//     }
//     const imageUrlParts = deletedPost.image.split("/");
//     const imageName = imageUrlParts[imageUrlParts.length - 1];
//     const imagePath = path.join(__dirname, "upload", "images", imageName);
//     fs.unlinkSync(imagePath);
//     res.json({ success: true, message: "Post deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// //hadle put requte to update the exiting data

// // app.put('/posts/:id', async (req, res) => {
// //   const postId = req.params.id;
// //   let likes = req.query.likes; // Get likes from URL parameter

// //   console.log("Received likes:", likes); // Log the received likes
// //   try {
// //     const existingPost = await Post.findById(postId);
// //     if (!existingPost) {
// //       return res.status(404).json({ error: "Post not found" });
// //     }

// //     // Parse likes as a number
// //     likes = parseInt(likes); // Convert likes to a number

// //     console.log("Parsed likes:", likes); // Log the parsed likes

// //     // Check if parsing was successful
// //     if (isNaN(likes)) {
// //       return res.status(400).json({ error: "Likes must be a valid number" });
// //     }

// //     // Assign the parsed likes to existingPost.likes
// //     existingPost.likes = likes;

// //     // Save the updated post
// //     await existingPost.save();

// //     res.json({ success: true, message: "Post like updated successfully" });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // });

// app.put('/posts/:id', async (req, res) => {
//   const postId = req.params.id;
//   let { likes, comment } = req.query; // Get likes and comment from URL parameters

//   console.log("Received likes:", likes); // Log the received likes
//   console.log("Received comment:", comment); // Log the received comment
//   try {
//     const existingPost = await Post.findById(postId);
//     if (!existingPost) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     // Parse likes as a number
//     likes = parseInt(likes); // Convert likes to a number

//     console.log("Parsed likes:", likes); // Log the parsed likes

//     // Check if parsing was successful
//     if (isNaN(likes)) {
//       return res.status(400).json({ error: "Likes must be a valid number" });
//     }

//     // Assign the parsed likes to existingPost.likes
//     existingPost.likes = likes;

//     // Check if comment is provided
//     if (comment &&comment.trim()!=="") {
//       // Add the comment to the post
//       existingPost.comments.push({ text: comment });
//     }

//     // Save the updated post
//     await existingPost.save();

//     res.json({ success: true, message: "Post like and comment updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });



// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Internal Server Error" });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error } = require("console");

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Atlas connection URI
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://shashisahani496:123456789ok@cluster0.lhlqwh4.mongodb.net/commentsDB";

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connected successfully');
});
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/images", express.static("upload/images"));

// Create Schema to upload Post
const PostSchema = new mongoose.Schema({
  image: { type: String, required: true },
  date: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  comments: [{ text: { type: String }, createdAt: { type: Date, default: Date.now } }],
  description: { type: String }
});
const Post = mongoose.model("Post", PostSchema);
// POST route to upload a new post with image, likes, description, and comment
app.post("/posts", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { description, likes, comment } = req.body;

    // Ensure the text field for comment is provided
    if (!comment || comment.trim() === "") {
      // return res.status(400).json({ error: "Comment is required" });
    }

    const imageUrl = `http://localhost:${PORT}/images/${req.file.filename}`;

    const newPost = new Post({ 
      image: imageUrl, 
      description, 
      likes, 
      comments: [{ text: comment }] // ensure the text field is provided
    });
    await newPost.save();

    console.log("Post saved successfully");
    res.json({ success: true, image: imageUrl, description, likes, comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/posts/:postId/comments", async (req, res) => {
  const { text } = req.body;
  const postId = req.params.postId;

  try {
    // Find the post by its ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Append the new comment to the comments array
    post.comments.push({ text }); // Ensure the text field is provided
    await post.save();

    res.json({ success: true, message: "Comment added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put('/posts/:postId/likes',async(req,res)=>{
  const postId=req.params.postId;
  if(!postId){
    return res.status(400).json({error:"Post Id is missing!"})
  }
  try {
    const post =await Post.findByIdAndUpdate(postId,{$inc:{likes:1}},{new:true});
    if(!post){
      return res.status(404).json({error:"POST not found"})
    }
    res.json({success:true,message:"Like updated successfully",likes:post.likes})
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})
app.get("/posts/:postId/comments", async (req, res) => {
  const postId = req.params.postId;

  try {
    // Find the post by its ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Extract comments from the post
    const comments = post.comments;

    res.json({ success: true, comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Route to handle delete requests to delete a post by id


app.delete('/posts/:postId',async(req,res)=>{
  const postId=req.params.postId;
  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    
    console.error(error);
    res.status(500).json({error:"Internal Server Error"})
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
