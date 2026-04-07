const crypto = require('crypto');
const { sendSuccess } = require('../utils/response');

/**
 * Task 1: Generates a new ECDSA key pair (secp256k1).
 * The Public Key will be the Wallet Address.
 */
const generateWallet = (req, res) => {
  // We use the Elliptic Curve 'secp256k1' - the same as Bitcoin/Ethereum
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp256k1',
    publicKeyEncoding: { 
      type: 'spki', 
      format: 'der' 
    },
    privateKeyEncoding: { 
      type: 'sec1', 
      format: 'der' 
    }
  });

  // Convert to hex strings for easy transmission and storage
  sendSuccess(res, {
    publicKey: publicKey.toString('hex'),
    privateKey: privateKey.toString('hex'),
  });
};

module.exports = { generateWallet };
