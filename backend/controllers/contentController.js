import asyncHandler from "express-async-handler";
import Content from "../models/contentModels.js";
import ContentLike from "../models/contentLikeModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// 🟢 Create new content (Admin only)
export const createContent = asyncHandler(async (req, res) => {
  const {
    title,
    words,
    ref,
    category,
    keywords,
    for: forArray,
    emotion,
  } = req.body;

  const content = new Content({
    title,
    words,
    ref,
    category,
    keywords,
    emotion,
    for: forArray,
    update: new Date(),
  });

  const createdContent = await content.save();
  res.status(201).json(createdContent);
});

// 🟢 Get all contents (with filtering & pagination)


// export const getContents = asyncHandler(async (req, res) => {
//   let token = req.cookies.jwt;
//   req.user = null;

//   // Soft authentication
//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.userId).select("-password");
//     } catch (err) {
//       req.user = null;
//     }
//   }

//   const pageSize = Number(req.query.limit) || 10;
//   const page = Number(req.query.page) || 1;

//   let filter = {};

//   let usePersonalFeed = false;

//   // ⭐ Build dynamic filter (only if user exists and has values)
//   if (req.user) {
//     const orConditions = [];

//     if (req.user.forPeople?.length > 0) {
//       orConditions.push({ for: { $in: req.user.forPeople } });
//     }

//     if (req.user.interests?.length > 0) {
//       orConditions.push({ interestTags: { $in: req.user.interests } });
//     }

//     if (req.user.profession) {
//       orConditions.push({ professionTags: req.user.profession });
//     }
//     console.log("OR Conditions for filter:", orConditions);
//     // Only enable personalized feed if conditions exist
//     if (orConditions.length > 0) {
//       filter = { $or: orConditions };
//       usePersonalFeed = true;
//     }
//   }

//   let contents;
//   let count;

//   if (usePersonalFeed) {
//     // Personalized feed
//     console.log("Serving personalized content feed");
//     count = await Content.countDocuments(filter);

//     contents = await Content.find(filter)
//       .sort({ createdAt: -1 })
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);
//   } else {
//     // Fallback → Random feed
//     count = await Content.countDocuments({});
//     console.log("No personalized feed - serving random content");

//     contents = await Content.aggregate([{ $sample: { size: pageSize } }]);
//   }

//   res.json({
//     contents,
//     page,
//     pages: Math.ceil(count / pageSize),
//     total: count,
//     personalized: usePersonalFeed,
//   });
// });
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
  let usePersonalFeed = false;

  // Build dynamic filter for personalized feed
  if (req.user) {
    const orConditions = [];

    if (req.user.forPeople?.length > 0) {
      orConditions.push({ for: { $in: req.user.forPeople } });
    }

    if (req.user.interests?.length > 0) {
      orConditions.push({ interestTags: { $in: req.user.interests } });
    }

    if (req.user.profession) {
      orConditions.push({ professionTags: req.user.profession });
    }

    if (orConditions.length > 0) {
      filter = { $or: orConditions };
      usePersonalFeed = true;
    }
  }

  // Aggregation pipeline to count likes and sort
  const pipeline = [
    { $match: filter },

    // Join ContentLike collection
    {
      $lookup: {
        from: "contentlikes", // ⚠ collection name in MongoDB
        localField: "_id",
        foreignField: "contentId",
        as: "likes",
      },
    },

    // Count likes
    {
      $addFields: {
        likesCount: { $size: "$likes" },
      },
    },

    // Sort by highest likes first, then latest content
    {
      $sort: {
        likesCount: -1,
        createdAt: -1,
      },
    },

    // Pagination
    { $skip: pageSize * (page - 1) },
    { $limit: pageSize },

    // Remove likes array from result
    {
      $project: {
        likes: 0,
      },
    },
  ];

  const contents = await Content.aggregate(pipeline);

  const count = usePersonalFeed
    ? await Content.countDocuments(filter)
    : await Content.countDocuments({});

  res.json({
    contents,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
    personalized: usePersonalFeed,
  });
});


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

// Fetch by Emotion
export const getContentsByEmotion = asyncHandler(async (req, res) => {
  const { emotion } = req.params;
  console.log("Fetching contents with emotion:", emotion);
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  // Matches any document whose emotion array contains the given emotion
  const filter = { emotion };

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





// // // Search contents with optional filters

export const searchContents = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const pageSize = Number(limit);
    const skip = pageSize * (page - 1);

    let filter = {};
    let sort = { createdAt: -1 };

    if (q) {
      const cleanQuery = q.replace(/[^\w\s]/gi, " ").trim();

      filter = {
        $or: [
          { title: { $regex: cleanQuery, $options: "i" } },
          { words: { $regex: cleanQuery, $options: "i" } },
          { category: { $regex: cleanQuery, $options: "i" } },
          { emotion: { $regex: cleanQuery, $options: "i" } },
          { for: { $in: cleanQuery.split(" ") } },
          { keywords: { $in: cleanQuery.split(" ") } },
        ],
      };
    }

    const count = await Content.countDocuments(filter);

    const contents = await Content.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    res.json({
      contents,
      page: Number(page),
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ message: "Search failed" });
  }
};


// // Suggestions 

export const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) return res.json([]);

    const results = await Content.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } },
            { emotion: { $regex: q, $options: "i" } },
            { for: { $elemMatch: { $regex: q, $options: "i" } } },
            { keywords: { $elemMatch: { $regex: q, $options: "i" } } },
          ],
        },
      },
      {
        $project: {
          title: 1,
          category: 1,
          emotion: 1,
          for: 1,
          keywords: 1,
        },
      },
      { $limit: 8 },
    ]);

    // Flatten suggestions: include type for frontend
    const suggestions = [];
    results.forEach((r) => {
      if (r.title?.toLowerCase().includes(q.toLowerCase()))
        suggestions.push({ type: "Title", value: r.title });
      if (r.category?.toLowerCase().includes(q.toLowerCase()))
        suggestions.push({ type: "Category", value: r.category });
      if (r.emotion?.some((e) => e.toLowerCase().includes(q.toLowerCase())))
        suggestions.push({
          type: "Emotion",
          value: r.emotion.find((e) =>
            e.toLowerCase().includes(q.toLowerCase())
          ),
        });
      if (r.for?.some((f) => f.toLowerCase().includes(q.toLowerCase())))
        suggestions.push({
          type: "Audience",
          value: r.for.find((f) =>
            f.toLowerCase().includes(q.toLowerCase())
          ),
        });
      if (r.keywords?.some((k) => k.toLowerCase().includes(q.toLowerCase())))
        suggestions.push({
          type: "Keyword",
          value: r.keywords.find((k) =>
            k.toLowerCase().includes(q.toLowerCase())
          ),
        });
    });

    // Remove duplicates
    const unique = Array.from(
      new Map(suggestions.map((s) => [s.type + s.value, s])).values()
    );

    res.json(unique);
  } catch (error) {
    console.error("🔥 SUGGEST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



