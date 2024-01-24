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

app.use(express.json());
const corsOptions = {
  origin: '*', // Укажите ваш фронтенд-домен
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// app.use('/uploads', express.static('uploads'));

// load file
// app.post('/upload', upload.single('image'), (req, res) => {
//   res.json({ url: `/uploads/${req.file.originalname}` });
// });

// commit

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

// get all Messages
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
