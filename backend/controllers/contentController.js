import asyncHandler from "express-async-handler";
import Content from "../models/contentModels.js";
import ContentLike from "../models/contentLikeModel.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';

// 🟢 Create new content (Admin only)
export const createContent = asyncHandler(async (req, res) => {
  const { title, words, ref, category, keywords, for: forArray } = req.body;

  const content = new Content({
    title,
    words,
    ref,
    category,
    keywords,
    for: forArray,
    update: new Date(),
  });

  const createdContent = await content.save();
  res.status(201).json(createdContent);
});

// 🟢 Get all contents (with filtering & pagination)
export const getContents = asyncHandler(async (req, res) => {
  let token = req.cookies.jwt;
  req.user = null;

  // Soft authentication
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
    } catch (err) {
      req.user = null;
    }
  }

  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  let filter = {};

  // ✅ PERSONALIZED FEED for logged-in user
  if (req.user) {
    filter = {
      $or: [
        { for: { $in: req.user.forPeople } },
        { interestTags: { $in: req.user.interests } },
        { professionTags: req.user.profession },
      ],
    };
  }

  const count = await Content.countDocuments(filter);

  let contents;

  if (req.user) {
    contents = await Content.find(filter)
      .sort({ createdAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
  } else {
    contents = await Content.aggregate([{ $sample: { size: pageSize } }]);
  }

  res.json({
    contents,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// 🟢 Get content by ID
// export const getContentById = asyncHandler(async (req, res) => {
//   const content = await Content.findById(req.params.id);

//   if (content) {
//     res.json(content);
//   } else {
//     res.status(404);
//     throw new Error("Content not found");
//   }
// });

// 🟢 Update content (Admin only)
export const updateContent = asyncHandler(async (req, res) => {
  const content = await Content.findById(req.params.id);

  if (content) {
    content.title = req.body.title || content.title;
    content.words = req.body.words || content.words;
    content.ref = req.body.ref || content.ref;
    content.category = req.body.category || content.category;
    content.keywords = req.body.keywords || content.keywords;
    content.for = req.body.for || content.for;
    content.update = new Date();

    const updated = await content.save();
    console.log(req.body);
    console.log(updated);
    res.json(updated);
  } else {
    res.status(404);
    throw new Error("Content not found");
  }
});

// 🟢 Delete content (Admin only)
export const deleteContent = asyncHandler(async (req, res) => {
  const content = await Content.findById(req.params.id);

  if (content) {
    await content.deleteOne();
    res.json({ message: "Content removed" });
  } else {
    res.status(404);
    throw new Error("Content not found");
  }
});

// 🟢 Get content by
export const getContentById = asyncHandler(async (req, res) => {
  const content = await Content.findById(req.params.id);

  if (!content) {
    res.status(404);
    throw new Error("Content not found");
  }

  res.json(content);
});

// Fetch by “for” Audience
export const getContentsByFor = asyncHandler(async (req, res) => {
  const { forValue } = req.params;

  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const filter = { for: forValue }; // matches any content with this audience tag

  const count = await Content.countDocuments(filter);

  const contents = await Content.find(filter)
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({
    contents,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// Fetch by Category
export const getContentsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const filter = { category };

  const count = await Content.countDocuments(filter);

  const contents = await Content.find(filter)
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({
    contents,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

//  Get Likes Count for a Content
export const getLikesCount = asyncHandler(async (req, res) => {
  const { contentId } = req.params;
  let userId = null;
  if (req.cookies.jwt) {
    try {
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (e) {
      userId = null;
    }
  }
  const count = await ContentLike.countDocuments({ contentId });
  const userLiked = userId
    ? await ContentLike.exists({ contentId, userId })
    : false;

  res.json({
    contentId,
    likes: count,
    userLiked: !!userLiked,
    userId: userId,
  });
});

// Like and unLike content (Admin only)
export const toggleLike = async (req, res) => {
  const { contentId } = req.body;
  const userId = req.user._id;

  const existing = await ContentLike.findOne({ contentId, userId });
  if (existing) {
    await existing.deleteOne();
    return res.json({ message: "Unliked successfully" });
  }

  const newLike = await ContentLike.create({ contentId, userId });
  res.status(201).json(newLike);
};
