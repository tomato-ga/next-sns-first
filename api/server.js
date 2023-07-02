require('dotenv').config();
const authRoute = require('./routers/auth');
const postsRoute = require('./routers/posts');
const usersRoute = require('./routers/users');

const express = require('express');
const app = express();
const PORT = 5010;

const cors = require('cors');

// expressでJSON使う
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/posts', postsRoute);
app.use('/api/users', usersRoute);

app.listen(PORT, () => console.log(`server running ${PORT}`));
