/**
 * eBay Marketplace Account Deletion Webhook
 *
 * Required by eBay to enable Production API keys.
 * Handles:
 *   GET  — challenge verification (eBay confirms endpoint ownership)
 *   POST — account deletion notifications (log and acknowledge)
 *
 * Set EBAY_VERIFICATION_TOKEN in Vercel environment variables.
 * The token is any string you choose — must match what you enter in eBay portal.
 */

const crypto = require('crypto');

module.exports = async function handler(req, res) {
  // Allow eBay to reach this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');

  // --- GET: Challenge verification ---
  if (req.method === 'GET') {
    const challengeCode = req.query.challenge_code;

    if (!challengeCode) {
      return res.status(400).json({ error: 'Missing challenge_code' });
    }

    const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;
    if (!verificationToken) {
      console.error('[eBay Webhook] EBAY_VERIFICATION_TOKEN not set');
      return res.status(500).json({ error: 'Verification token not configured' });
    }

    // eBay requires: sha256(challengeCode + verificationToken + endpointUrl)
    const endpointUrl = `https://${req.headers.host}/api/ebay-notifications`;
    const hash = crypto
      .createHash('sha256')
      .update(challengeCode + verificationToken + endpointUrl)
      .digest('hex');

    console.log(`[eBay Webhook] Challenge verified for endpoint: ${endpointUrl}`);
    return res.status(200).json({ challengeResponse: hash });
  }

  // --- POST: Account deletion notification ---
  if (req.method === 'POST') {
    try {
      const notification = req.body;
      const topic = notification?.metadata?.topic || 'unknown';
      const userId = notification?.notification?.data?.userId || 'unknown';

      console.log(`[eBay Webhook] Received notification — topic: ${topic}, userId: ${userId}`);

      // Per eBay policy: acknowledge receipt immediately with 200.
      // For a personal reseller with no stored user data, no further action needed.
      return res.status(200).json({ received: true });
    } catch (err) {
      console.error('[eBay Webhook] Error processing notification:', err);
      return res.status(200).json({ received: true }); // Still acknowledge to prevent retries
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
};
