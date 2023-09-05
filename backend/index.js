const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb+srv://azizmahamat:mahamat@cluster0.xacymaf.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error Connecting to MongoDB", err);
  });

app.listen(port, () => {
  console.log("server is running on port 3000");
});
const User = require("./models/user");
const Post = require("./models/post");

//endpoint to register a user in the backend
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    //create a new user
    const newUser = new User({ name, email, password });

    //generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //save the  user to the database
    await newUser.save();

    //send the verification email to the user
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.log("error registering user", error);
    res.status(500).json({ message: "error registering user" });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  //create a nodemailer transporter

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "requisition.cnps@gmail.com",
      pass: "ujaflfpxuuzidbnl",
    },
  });

  //compose the email message
  const mailOptions = {
    from: "threads.com",
    to: email,
    subject: "Email Verification",
    text: `please click the following link to verify your email http://172.20.10.4:3000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error sending email", error);
  }
};

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("error getting token", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("body", req.body);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }
    console.log("user in db:", user);
    if (user.password !== password) {
      return res.status(404).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});
// endpoint to access all user except the logged in the user
app.get("/users/:userId", async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;
    User.find({ _id: { $ne: loggedInUserId } })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        console.log("Error: ", error);
        res.status(500).json(error);
      });
  } catch (error) {
    res.status(500).json({ message: "error getting the users" });
  }
});
//endpoint to follow a particular user
app.post("/follow", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;
  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: currentUserId },
    });
    res.status(200).json({
      message: `user with id ${currentUserId} follow id=${selectedUserId}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in following a user" });
  }
});
// endpoint to unfollow a user
app.post("/unfollow", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;
  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $pull: { followers: currentUserId },
    });
    res.status(200).json({
      message: `user with id=${currentUserId} unfollow id=${selectedUserId}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in unfollow a user" });
  }
});
//end point to create a new post in the backend
app.post("/create-post", async (req, res) => {
  try {
    const { content, userId } = req.body;
    const newPostData = {
      user: userId,
    };
    if (content) {
      newPostData.content = content;
    }
    const newPost = new Post(newPostData);
    await newPost.save();
    res.status(200).json({ message: "Post saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "post creation failed" });
  }
});
//enpoint point liking a particular post
app.put("/post-like/:postId/:userId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId).populate("user", "name");
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "post not found" });
    }
    updatedPost.user = post.user;
    await updatedPost.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error accured while liking" });
  }
});
//endpoint to unlikes a particular post
app.put("/post-unlike/:postId/:userId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;
    const post = await Post.findById(postId).populate("user", "name");
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "post not found" });
    }
    updatedPost.user = post.user;
    await updatedPost.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error accured while unliking" });
  }
});
//endpoint to get all post
app.get("/get-posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.log("error: ", error);
    res
      .status(500)
      .json({ message: "an error accured while getting all the posts" });
  }
});
//endpoint to fetch user profile
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    console.log("error in fetching user profile: ", error);
    res.status(500).json({ message: "error occured in fetching user profile" });
  }
});
