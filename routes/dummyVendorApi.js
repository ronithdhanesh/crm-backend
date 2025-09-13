const express = require('express');
const router = express.Router();

// A dummy vendor API to simulate sending messages
router.post('/send', (req, res) => {
    const { logId, to, message } = req.body;
    
    // Simulate a 90% success rate
    const success = Math.random() < 0.9;
    const status = success ? 'SENT' : 'FAILED';
    
    console.log(`Dummy Vendor: Sending message to ${to}. Status: ${status}`);

    res.status(200).json({
        logId: logId,
        status: status,
    });
});

module.exports = router;