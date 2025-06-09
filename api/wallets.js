export default async (req, res) => {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json'
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch wallets: ${response.status}`);
    }

    const data = await response.text();

    res.setHeader('Cache-Control', 's-maxage=86400'); // Cache for 1 day
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(data);
  } catch (error) {
    console.error('Wallet list fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch wallet list',
      message: error.message,
    });
  }
};
