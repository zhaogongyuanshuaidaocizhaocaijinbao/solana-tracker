export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { address } = req.query;
    if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
    }

    const solscanApiKey = process.env.SOLSCAN_API_KEY;
    if (!solscanApiKey) {
        return res.status(500).json({ error: 'Solscan API key is not configured' });
    }

    const solscanUrl = `https://api.solscan.io/v2/account/transactions?address=${encodeURIComponent(address)}&limit=100`;

    fetch(solscanUrl, {
        headers: {
            'Authorization': `Bearer ${solscanApiKey}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Solscan API error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有来源（开发时可用，生产需限制）
        res.status(200).json(data);
    })
    .catch(error => {
        console.error('Fetch error:', error.message);
        res.status(500).json({ error: `Failed to fetch transactions: ${error.message}` });
    });
}
