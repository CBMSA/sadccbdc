// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const oracledb = require('oracledb');
const Web3 = require('web3');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Web3 (Ethereum Public)
const web3 = new Web3("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");

// Oracle DB Setup
oracledb.initOracleClient({ libDir: process.env.ORACLE_LIB_PATH });
async function getDBConnection() {
  return await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionString: process.env.DB_CONNECT_STRING,
  });
}

// Root
app.get('/', (req, res) => {
  res.send('SADC CBDC Public Backend is live.');
});

// 1. Public FAQs
app.get('/api/faqs', async (req, res) => {
  try {
    const conn = await getDBConnection();
    const result = await conn.execute(`SELECT question, answer FROM cbdc_faqs`);
    res.json(result.rows.map(([q, a]) => ({ q, a })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Wallet Registration
app.post('/api/register-wallet', async (req, res) => {
  const { idNumber, phone, walletAddress } = req.body;
  try {
    const conn = await getDBConnection();
    await conn.execute(
      `INSERT INTO cbdc_wallets (id_number, phone, wallet_address) VALUES (:id, :phone, :wallet)`,
      [idNumber, phone, walletAddress],
      { autoCommit: true }
    );
    res.json({ status: 'Wallet registered successfully', walletAddress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Wallet Balance Check
app.get('/api/wallet-balance', async (req, res) => {
  const { walletAddress } = req.query;
  try {
    const balance = await web3.eth.getBalance(walletAddress);
    res.json({ balance: web3.utils.fromWei(balance, 'ether') });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Help / Contact Form
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log(`[HELP] ${name} | ${email} | ${message}`);
  res.json({ status: 'Message received. Our team will contact you shortly.' });
});

// Start Server
app.listen(port, () => {
  console.log(`CBDC Backend running at http://localhost:${port}`);
});