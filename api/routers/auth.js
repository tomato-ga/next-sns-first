const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Prisma } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 新規ユーザー登録API
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // パスワードを暗号化 ハッシュ化
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return res.json({ user });
});

// ユーザーログイン

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res
      .status(401)
      .json({ error: 'メールかパスワードが間違っています' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'パスワードが間違っているぞ' });
  }

  //   ログインできるならJWTを発行する
  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: '1d', //期限は1日
  });
  return res.json({ token });
});

module.exports = router;
