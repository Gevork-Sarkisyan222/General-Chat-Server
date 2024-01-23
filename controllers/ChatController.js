import Message from '../models/Message.js';

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('user').exec();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json('Не удалось получить все сообшения');
  }
};

export const createMessage = async (req, res) => {
  try {
    const message = new Message({
      message: req.body.message,
      image: req.body.image,
      user: req.userId,
    });

    const newMessage = await message.save();

    res.status(200).json(newMessage);
  } catch (err) {
    res.status(400).json('Не получилось отправить сообшение');
  }
};

export const updateMessage = async (req, res) => {
  const message = await Message.findById(req.params.id);

  try {
    if (req.userId === message.user._id.toString()) {
      const updatedMessage = await Message.findByIdAndUpdate(
        req.params.id,
        { message: req.body.message },
        { new: true },
      );

      if (!updatedMessage) {
        return res.status(404).json('Сообщение не найдено');
      }

      return res.status(200).json('Сообщение успешно обновлено !');
    } else {
      return res.status(400).json('Вы не можете обновить чужое сообшение');
    }
  } catch (err) {
    res.status(500).json('Не удалось обновить сообщение');
  }
};

export const deleteMessage = async (req, res) => {
  const message = await Message.findById(req.params.id);

  try {
    if (req.userId === message.user._id.toString()) {
      await Message.findByIdAndDelete(req.params.id);
    } else {
      res.status(403).json('Вы можете удалять только ваши сообшения');
    }

    res.status(200).json('Сообшение удалено успешно!!');
  } catch (err) {
    res.status(500).json('Не удалось удалить сообшение');
  }
};

export const clearChat = async (req, res) => {
  try {
    await Message.deleteMany();
    res.status(200).json('Чат успешно очишен!!');
  } catch (err) {
    res.status(500).json('Не удалось очистить чат');
  }
};
