const asyncHandler = require("express-async-handler");
const axios = require("axios");

// @desc    Generate a JSON ruleset from natural language
// @route   POST /api/ai/text-to-rules
// @access  Private
const generateRules = asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        res.status(400);
        throw new Error("Prompt is required.");
    }

    try {
        // --- This is the key change ---
        // Make a call to your Python AI microservice running on port 8000
        const pythonServiceUrl = "http://localhost:8000/generate-rules";
        const response = await axios.post(pythonServiceUrl, { text: prompt });

        // The Python service should return a valid JSON ruleset.
        const aiOutput = response.data;

        // Verify the response from the AI
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