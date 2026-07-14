import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  paperId: mongoose.Types.ObjectId;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    paperId: {
      type: Schema.Types.ObjectId,
      ref: 'Paper',
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    // Denormalized at write-time from the authenticated session so the
    // review list can render without an extra User lookup per review.
    userName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Speeds up the common query: all reviews for a paper, newest first.
ReviewSchema.index({ paperId: 1, createdAt: -1 });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);