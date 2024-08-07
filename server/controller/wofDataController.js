const WofData = require('../models/wofDataModel');

exports.getAllWofDatas = async (req, res) => {
    try {
      const wofDatas = await WofData.find();
      res.json(wofDatas);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.createWofData = async (req, res) => {
    const wofData = new WofData({
      name: req.body.name,
      title: req.body.title,
      story: req.body.story,
      type: req.body.type,
      range: req.body.range,
      movementSpeed: req.body.movementSpeed,
      Enchantment: req.body.Enchantment
    });
  
    try {
      const newWofData = await wofData.save();
      res.status(201).json(newWofData);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.updateWofData = async (req, res) => {
    try {
      const updatedWofData = await WofData.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedWofData);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.deleteWofData = async (req, res) => {
    try {
      await WofData.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  