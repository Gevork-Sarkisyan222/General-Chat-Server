import mongoose from 'mongoose';
// m

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },
    role: {
      type: String,
      default: 'Участник', // Администратор
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', UserSchema);
