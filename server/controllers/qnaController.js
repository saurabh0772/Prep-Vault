const QnA = require('../models/QnA');

const getQnAs = async (req, res) => {
  try {
    const { topic, confidence } = req.query;
    let query = { userId: req.userId };

    if (topic && topic !== 'All') {
      query.topic = topic;
    }

    if (confidence && confidence !== 'All') {
      query.confidence = confidence;
    }

    const qnas = await QnA.find(query).sort({ createdAt: -1 }).lean();
    res.json(qnas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createQnA = async (req, res) => {
  try {
    const { question, answer, topic, confidence } = req.body;
    const qna = await QnA.create({
      userId: req.userId,
      question,
      answer,
      topic,
      confidence: confidence || 'needs-revision',
    });
    res.status(201).json(qna);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQnA = async (req, res) => {
  try {
    const qna = await QnA.findById(req.params.id);

    if (!qna) {
      return res.status(404).json({ message: 'QnA not found' });
    }

    if (qna.userId.toString() !== req.userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedQnA = await QnA.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedQnA);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQnA = async (req, res) => {
  try {
    const qna = await QnA.findById(req.params.id);

    if (!qna) {
      return res.status(404).json({ message: 'QnA not found' });
    }

    if (qna.userId.toString() !== req.userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await qna.deleteOne();

    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQnAs,
  createQnA,
  updateQnA,
  deleteQnA,
};
