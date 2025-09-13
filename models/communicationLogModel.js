const mongoose = require("mongoose");

const communicationLogSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        required: [true, "Communication log must be linked to a campaign"],
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: [true, "Communication log must be linked to a customer"],
    },
    message: {
        type: String,
        required: [true, "Message is required"],
    },
    status: {
        type: String,
        enum: ["Pending", "Sent", "Failed"],
        default: "Pending",
    },
    deliveredAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("CommunicationLog", communicationLogSchema);