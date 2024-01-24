import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';

export const signUp = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: passwordHash,
      avatarUrl: req.body.avatarUrl,
    });

    const newUser = await user.save();

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { password, ...userData } = newUser._doc;

    res.status(200).json({ ...userData, token });
  } catch (err) {
    res.status(400).json('Не удалось создать пользователя');
  }
};

export const signIn = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json('Неверный логин или пароль');
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { password, ...userData } = user._doc;

    res.status(200).json({ ...userData, token });
  } catch (err) {
    res.status(400).json('Данные не верные');
  }
};

export const findUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json('Пользователь не найден');
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json('Пользователь не найден');
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    const sortedUsers = users.sort((a, b) => {
      if (a.role === 'Супер Админ' && b.role !== 'Супер Админ') {
        return -1;
      } else if (a.role !== 'Супер Админ' && b.role === 'Супер Админ') {
        return 1;
      }

      if (a.role === 'Администратор' && b.role !== 'Администратор') {
        return -1;
      } else if (a.role !== 'Администратор' && b.role === 'Администратор') {
        return 1;
      }

      return 0;
    });

    res.status(200).json(sortedUsers);
  } catch (err) {
    res.status(400).json('Не удалось найти пользователей');
  }
};

export const deleteUser = async (req, res) => {
  try {
    await Message.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('Пользователь был удален из чата');
  } catch (err) {
    res.status(400).json('Не удалсь удалить пользователья');
  }
};

export const makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = 'Администратор';
      await user.save();

      res.status(200).json('Роль пользователя успешно обновлён на Администратора');
    } else {
      res.status(404).json('Пользователь не найден');
    }
  } catch (err) {
    res.status(400).json('Не удалсь обновить роль пользователья');
  }
};

export const removeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = 'Участник';
      await user.save();

      res.status(200).json('Роль администратора понижен на пользователья');
    } else {
      res.status(404).json('Администратор не найден');
    }
  } catch (err) {
    res.status(400).json('Не удалсь снять с поста Администратора');
  }
};
