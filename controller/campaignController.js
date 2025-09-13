const asyncHandler = require("express-async-handler");
const Customer = require("../models/customerModel");
const Campaign = require("../models/campaignModel");
const CommunicationLog = require("../models/communicationLogModel");
const axios = require('axios');

// Helper function to build a dynamic Mongoose query from a JSON ruleset
const buildDynamicQuery = (rules, combinator) => {
    if (!rules || rules.length === 0) {
        return {};
    }

    // Map operators from UI-friendly strings to MongoDB operators
    const operatorMap = {
        '>': '$gt',
        '<': '$lt',
        '>=': '$gte',
        '<=': '$lte',
        '==': '$eq',
        '!=': '$ne',
    };

    const conditions = rules.map(rule => {
        const mongoOperator = operatorMap[rule.operator];
        if (!mongoOperator) {
            throw new Error(`Invalid operator: ${rule.operator}`);
        }
        return { [rule.field]: { [mongoOperator]: rule.value } };
    });

    return { [combinator]: conditions };
};

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private
const getCampaigns = asyncHandler(async (req, res) => {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.status(200).json(campaigns);
});

// @desc    Preview audience size for a new campaign
// @route   POST /api/campaigns/preview
// @access  Private
const previewAudience = asyncHandler(async (req, res) => {
    const { rules, combinator } = req.body;
    
    // Build the dynamic query
    const query = buildDynamicQuery(rules, combinator);

    // Count the customers that match the query
    const audienceSize = await Customer.countDocuments(query);
    
    res.status(200).json({ audienceSize });
});

// @desc    Create a new campaign and trigger delivery
// @route   POST /api/campaigns
// @access  Private
const createCampaign = asyncHandler(async (req, res) => {
    const { name, audience, messageTemplate } = req.body;

    if (!name || !audience || !messageTemplate) {
        res.status(400);
        throw new Error("All campaign fields are mandatory.");
    }
    
    // Build the dynamic query from the audience rules
    const query = buildDynamicQuery(audience.rules, audience.combinator);

    // Find the customers that match the query
    const customers = await Customer.find(query);
    const audienceSize = customers.length;

    // Create the new campaign in the database
    const newCampaign = await Campaign.create({
        name,
        audience,
        messageTemplate,
        audienceSize,
        deliveryStats: { pending: audienceSize },
        status: "Running",
    });

    // Simulate sending messages and log the results
    const deliveryPromises = customers.map(async (customer) => {
        try {
            // Log the message as pending
            const logEntry = await CommunicationLog.create({
                campaignId: newCampaign._id,
                customerId: customer._id,
                message: messageTemplate.replace('{{name}}', customer.name),
                status: "Pending",
            });
            
            // Dummy API call to simulate message delivery
            const vendorResponse = await axios.post('http://localhost:5002/api/dummy-vendor/send', {
                logId: logEntry._id,
                to: customer.phone,
                message: logEntry.message,
            });

            if (vendorResponse.data.status === 'SENT') {
                newCampaign.deliveryStats.sent += 1;
                logEntry.status = 'Sent';
            } else {
                newCampaign.deliveryStats.failed += 1;
                logEntry.status = 'Failed';
            }
            logEntry.deliveredAt = new Date();
            await logEntry.save();
            
        } catch (error) {
            console.error('Error in campaign delivery for customer:', customer.id, error.message);
            // Handle delivery failure
            newCampaign.deliveryStats.failed += 1;
            const logEntry = await CommunicationLog.create({
                campaignId: newCampaign._id,
                customerId: customer._id,
                message: messageTemplate.replace('{{name}}', customer.name),
                status: 'Failed',
                deliveredAt: new Date(),
            });
        }
    });

    // Wait for all deliveries to be processed
    await Promise.all(deliveryPromises);
    newCampaign.status = 'Completed';
    await newCampaign.save();

    res.status(201).json(newCampaign);
});


module.exports = { getCampaigns, previewAudience, createCampaign };