import chatModel from "../Model/chatModel.js";

export const createChat = async (req, res) => {
  console.log(req.body.id,req.body.userid)
  const exist = await chatModel.findOne({members:{$all:[req.body.userid,req.body.id]}})
  if(exist) return res.sendStatus(500)
  const newChat = new chatModel({
    members: [req.body.userid, req.body.id],
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  try {
    const chat = await chatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await chatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};
