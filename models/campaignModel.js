const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a campaign name"],
    },
    audience: {
        // This object will hold the segmentation rules
        rules: {
            type: [
                {
                    field: { type: String, required: true },
                    operator: { type: String, required: true },
                    value: { type: mongoose.Schema.Types.Mixed, required: true },
                },
            ],
            required: [true, "Audience rules are required"],
        },
        combinator: {
            type: String,
            enum: ["$and", "$or"],
            default: "$and",
        },
    },
    messageTemplate: {
        type: String,
        required: [true, "Please add a message template for the campaign"],
    },
    audienceSize: {
        type: Number,
        default: 0,
    },
    deliveryStats: {
        sent: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
    },
    status: {
        type: String,
        enum: ["Draft", "Running", "Completed"],
        default: "Draft",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Campaign", campaignSchema);