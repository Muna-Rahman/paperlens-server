import { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    emailVerified: { type: Boolean, default: false }, // Required by Better Auth core
    image: { type: String, default: '' },
  },
  { 
    timestamps: true,
    collection: 'user' // Forces Mongoose to read from singular 'user' table instead of 'users'
  }
);

export const User = models.User || model('User', userSchema);
export default User;