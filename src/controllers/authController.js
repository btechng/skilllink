import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req, res) {
  try {
    const {
      name, email, password, role,
      phone, country, city, profileImage,
      title, bio, skills, experienceLevel, hourlyRate, portfolioLinks, languages,
      companyName, companyWebsite, industry, teamSize
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hashed, role: role || 'client',
      phone, country, city, profileImage,
      title, bio,
      skills: Array.isArray(skills) ? skills : (skills ? [skills] : []),
      experienceLevel, hourlyRate,
      portfolioLinks: Array.isArray(portfolioLinks) ? portfolioLinks : (portfolioLinks ? [portfolioLinks] : []),
      languages: Array.isArray(languages) ? languages : (languages ? [languages] : []),
      companyName, companyWebsite, industry, teamSize
    });

    const token = signToken(user);
    const safeUser = await User.findById(user._id).select('-password');
    res.status(201).json({ token, user: safeUser });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    const safeUser = await User.findById(user._id).select('-password');
    res.json({ token, user: safeUser });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function me(req, res) {
  const u = await User.findById(req.user._id).select('-password');
  res.json(u);
}

export async function updateProfile(req, res) {
  try {
    const updates = { ...req.body };
    delete updates.password;
    const u = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(u);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}
