const Link = require('../models/Link');

const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ userId: req.userId }).lean();
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLink = async (req, res) => {
  try {
    const { label, url, icon } = req.body;
    const link = await Link.create({
      userId: req.userId,
      label,
      url,
      icon,
    });
    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (link.userId.toString() !== req.userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedLink = await Link.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedLink);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (link.userId.toString() !== req.userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await link.deleteOne();

    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
};
