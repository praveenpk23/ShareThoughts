import asyncHandler from "express-async-handler";
import Content from "../models/contentModels.js";
import ContentLike from "../models/contentLikeModel.js";

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
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  let filter = {};

  if (req.user?.UserId || req.user?._id) {
    // If authenticated: filter by "for" category from user
    if (req.user.for && req.user.for.length > 0) {
      filter = { for: { $in: req.user.for } };
    }
  }

  const count = await Content.countDocuments(filter);

  let query = Content.find(filter)
    .sort({ createdAt: -1 }) // latest first
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  // If unauthenticated, randomize order
  if (!req.user) {
    query = Content.aggregate([{ $sample: { size: pageSize } }]);
  }

  const contents = await query;

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
    console.log(req.body )
    console.log(updated )
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

  const count = await ContentLike.countDocuments({ contentId });

  res.json({
    contentId,
    likes: count,
  });
});