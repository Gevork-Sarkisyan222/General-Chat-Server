import express from 'express';
import cors from 'cors';
import {
  signUp,
  signIn,
  findUser,
  getMe,
  getAllUsers,
  deleteUser,
  makeAdmin,
  removeAdmin,
} from './controllers/UserController.js';
import {
  createMessage,
  deleteMessage,
  getAllMessages,
  updateMessage,
  clearChat,
} from './controllers/ChatController.js';
import mongoose from 'mongoose';
import checkAuth from './utils/checkAuth.js';
import multer from 'multer';

const app = express();
const connect = () => {
  mongoose
    .connect(
      'mongodb+srv://newcor9:youtube-server-code@youtube-server.maijdmg.mongodb.net/Chat?retryWrites=true&w=majority',
    )
    .then(() => {
      console.log('Connected to DB');
    })
    .catch((err) => {
      throw err;
    });
};

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// load file
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ url: `/uploads/${req.file.originalname}` });
});

// sign up - регестрация
app.post('/signUp', signUp);

// sign in - авторизация
app.post('/signIn', signIn);

// find user
app.get('/user/find/:id', findUser);

// get me
app.get('/user/getMe', checkAuth, getMe);

// get all Users
app.get('/users', getAllUsers);

// delete all user
app.delete('/user/:id', deleteUser);

// make Admin
app.put('/user/role/admin/:id', makeAdmin);

// remove admin only can do it Super Admin
app.put('/user/role/admin/lower/:id', removeAdmin);

// get All Messages
app.get('/chat/message', getAllMessages);

// create Message
app.post('/chat/message', checkAuth, createMessage);

// // update Message
app.put('/chat/message/:id', checkAuth, updateMessage);

// // delete Message
app.delete('/chat/message/:id', checkAuth, deleteMessage);

// clear chat
app.delete('/chat/messages', checkAuth, clearChat);

app.listen(5555, () => {
  connect();
  console.log('Server ok');
});
