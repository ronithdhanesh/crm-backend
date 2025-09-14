const asyncHandler = require("express-async-handler");
const axios = require("axios");

// @desc    Generate a JSON ruleset from natural language
// @route   POST /api/ai/text-to-rules
// @access  Private
const generateRules = asyncHandler(async (req, res) => {
    const { text } = req.body;

    if (!text) {
        res.status(400);
        throw new Error("Prompt is required.");
    }

    try {
        const pythonServiceUrl = "http://localhost:8000/generate-rules";
        const response = await axios.post(pythonServiceUrl, { text: text });
        const aiOutput = response.data;

        if (!aiOutput || !aiOutput.rules || !aiOutput.combinator) {
            res.status(500);
            throw new Error("Invalid response format from AI service.");
        }

        res.status(200).json(aiOutput);

    } catch (error) {
        console.error("AI Service Error:", error.response?.data || error.message);
        res.status(500);
        throw new Error("Failed to generate rules from AI.");
    }
});

module.exports = { generateRules };