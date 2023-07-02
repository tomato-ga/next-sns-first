const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Prisma } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isAuthenticated = require('../middlewares/isAuthenticated');
require('dotenv').config();

// 投稿用API
router.post('/post', isAuthenticated, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: '投稿内容はないよ' });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorID: req.userId,
      },
      include: {
        author: true,
      },
    });
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
});

// 最新取得用API

router.get('/get_latest_post', async (req, res) => {
  try {
    const latestPosts = await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
      },
    });
    return res.json(latestPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
});

module.exports = router;
