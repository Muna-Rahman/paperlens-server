import mongoose, { Schema, Document } from 'mongoose';

export interface IPaper extends Document {
  title: string;
  shortDescription: string;
  abstract: string;
  field: string;
  year: number;
  citationCount: number;
  keywords: string[];
  image?: string;
  addedBy?: string; // Links to the user who indexed it
  createdAt: Date;
  updatedAt: Date;
}

const PaperSchema: Schema = new Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    shortDescription: { 
      type: String, 
      required: true, 
      trim: true 
    },
    abstract: { 
      type: String, 
      required: true 
    },
    field: { 
  type: String, 
  required: true,
  trim: true
},
    year: { 
      type: Number, 
      required: true 
    },
    citationCount: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    keywords: { 
      type: [String], 
      required: true,
      default: []
    },
    image: { 
      type: String, 
      default: '' 
    },
    addedBy: { 
      type: String,
      default: null
    }
  },
  { 
    timestamps: true 
  }
);

// Add text indexes for optimal query lookups in our search engine controller
PaperSchema.index({ title: 'text', abstract: 'text', keywords: 'text' });

export default mongoose.models.Paper || mongoose.model<IPaper>('Paper', PaperSchema);
