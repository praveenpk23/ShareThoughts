import Content from "../models/contentModel.js";
import asyncHandler from "express-async-handler";
export const searchContents = asyncHandler(async (req, res) => {
  const {
    q,
    page = 1,
    limit = 10,
    category,
    emotion,
    for: forAudience,
  } = req.query;

  const pageSize = Number(limit);
  const skip = pageSize * (page - 1);

  let filter = {};

  // 🎯 TEXT SEARCH
  if (q) {
    filter.$text = { $search: q };
  }

  // 🎯 OPTIONAL FILTERS
  if (category) filter.category = category;
  if (emotion) filter.emotion = emotion;
  if (forAudience) filter.for = forAudience;

  const count = await Content.countDocuments(filter);

  const contents = await Content.find(filter, {
    score: { $meta: "textScore" },
  })
    .sort({
      score: { $meta: "textScore" },
      createdAt: -1,
    })
    .skip(skip)
    .limit(pageSize);

  res.json({
    contents,
    page: Number(page),
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});


