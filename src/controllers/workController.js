import Work from '../models/Work.js';

export async function createWork(req, res) {
  try {
    const { title, description, mediaUrl, mediaType, tags, price } = req.body;
    if (!title || !mediaUrl) return res.status(400).json({ message: 'title and mediaUrl required' });
    const work = await Work.create({
      user: req.user._id,
      title,
      description,
      mediaUrl,
      mediaType: mediaType || 'image',
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
      price: price || 0
    });
    res.status(201).json(work);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function myWorks(req, res) {
  const works = await Work.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(works);
}

export async function allWorks(req, res) {
  const { userId } = req.query;
  const query = userId ? { user: userId } : {};
  const works = await Work.find(query).populate('user', 'name profileImage title').sort({ createdAt: -1 });
  res.json(works);
}
