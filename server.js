const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors=require('cors')
const app = express();
const fs = require('fs');

// MongoDB Atlas connection URI
const mongoURI = 'mongodb+srv://shashisahani496:123456789ok@cluster0.lhlqwh4.mongodb.net/commentsDB';

app.use(cors());
// Create MongoDB Atlas connection
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Image Storage Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
});

app.use("/images", express.static("upload/images"));

// Create Schema to upload Post
const Post = mongoose.model("Post", {
  image: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    default: Date.now,
  }
});

app.post("/posts", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `http://localhost:${process.env.PORT || 5000}/images/${req.file.filename}`;
  try {
    const newPost = new Post({ image: imageUrl });
    await newPost.save();
    console.log("Save!");
    res.json({ success: true, image: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//fetch all the image with strose in data base

app.get('/posts',async(req,res)=>{
  try {
    const posts=await Post.find({});
    if(!posts || posts.length===0){
      return res.status(404).json({error:"no post found"})
    }
    //log the fetch data

    console.log("Fetch data ",posts);
    res.status(200).json(posts)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

app.delete('/posts/:id',async(req,res)=>{
  const postId=req.params.id;

  try {
console.log(postId,"postid")
    const deletedPost=await Post.findByIdAndDelete(postId)
    if(!deletedPost){
      return res.status(404).json({error:"Post not found"})
    }
    const imageUrlParts=deletedPost.image.split('/');
    const imageName=imageUrlParts[imageUrlParts.length-1];
    const imagePath=path.json(__dirname,'upload','images',imageName);
    fs.unlinkSync(imagePath); 
    res.join({success:true,message:"Post deleted successfully"})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
