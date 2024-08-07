const express = require('express');
const router = express.Router();
const wofDataController = require('../controller/wofDataController');

router.get('/wofdata', wofDataController.getAllWofDatas);
router.post('/wofdata', wofDataController.createWofData);
router.put('/wofdata/:id', wofDataController.updateWofData);
router.delete('/wofdata/:id', wofDataController.deleteWofData);

module.exports = router;
