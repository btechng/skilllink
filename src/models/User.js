import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  review: String
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['client', 'freelancer', 'admin'], default: 'client' },

  phone: String,
  country: String,
  city: String,
  profileImage: String,

  // Freelancer-specific
  title: String,
  bio: String,
  skills: [{ type: String }],
  experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'expert'], default: 'beginner' },
  hourlyRate: { type: Number, default: 0 },
  portfolioLinks: [{ type: String }],
  languages: [{ type: String }],

  // Client-specific
  companyName: String,
  companyWebsite: String,
  industry: String,
  teamSize: String,

  walletBalance: { type: Number, default: 0 },
  ratings: [RatingSchema]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
