const uplandReplicated = require('../models');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');
const persistence = require('../services/persistence-service');

/**
 * Handles the transfer of Digital Real Estate.
 */
const buyProperty = async (req, res) => {
  try {
    const { propertyId, buyerAddress, signature } = req.body;

    // 1. Locate the Asset
    const property = uplandReplicated.properties.find(p => p.id === propertyId);
    if (!property) return sendError(res, 'Property not found in the Bihar Genesis Map', 404);

    // 2. Validate Ownership State
    if (!property.isForSale) return sendError(res, 'Property is already settled and not for sale', 400);

    // 3. Execute the Transfer
    // In a full build, we would verify the 'signature' here using the Logic from Task 1
    const oldOwner = property.owner;
    property.owner = buyerAddress;
    property.isForSale = false;

    // 4. Record to the Permanent Ledger (Task 2 Persistence)
    await persistence.save(uplandReplicated);
    
    logger.info(`🚨 DEED TRANSFER: ${propertyId} moved from ${oldOwner} to ${buyerAddress}`);

    sendSuccess(res, {
      message: 'Property Deed successfully transferred and persisted',
      property
    });
  } catch (err) {
    sendError(res, err.message);
  }
};

const getAllProperties = (req, res) => {
  sendSuccess(res, { properties: uplandReplicated.properties });
};

module.exports = { buyProperty, getAllProperties };
