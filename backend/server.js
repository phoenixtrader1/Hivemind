const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Database connected successfully');
    release();
  }
});

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      message: 'HiveMind API is running',
      timestamp: new Date().toISOString(),
      database: 'connected',
      db_time: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Initialize database tables
app.post('/api/init-db', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        agent_id TEXT UNIQUE NOT NULL,
        name TEXT DEFAULT 'My AI Agent',
        performance_score INTEGER DEFAULT 0,
        total_trades INTEGER DEFAULT 0,
        winning_trades INTEGER DEFAULT 0,
        total_pnl DECIMAL(18, 8) DEFAULT 0,
        staked_amount DECIMAL(18, 8) DEFAULT 0,
        rewards_earned DECIMAL(18, 8) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS trades (
        id SERIAL PRIMARY KEY,
        agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,
        token_in TEXT NOT NULL,
        token_out TEXT NOT NULL,
        amount_in DECIMAL(18, 8) NOT NULL,
        amount_out DECIMAL(18, 8) NOT NULL,
        profit_loss DECIMAL(18, 8),
        success BOOLEAN,
        strategy_hash TEXT,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS collective_knowledge (
        id SERIAL PRIMARY KEY,
        strategy_hash TEXT UNIQUE NOT NULL,
        success_rate DECIMAL(5, 4),
        usage_count INTEGER DEFAULT 0,
        average_profit DECIMAL(18, 8),
        last_used TIMESTAMP DEFAULT NOW()
      )
    `);

    res.json({ 
      success: true, 
      message: 'Database initialized successfully',
      tables: ['users', 'agents', 'trades', 'collective_knowledge']
    });
  } catch (error) {
    console.error('Database init error:', error);
    res.status(500).json({ 
      error: 'Failed to initialize database',
      details: error.message
    });
  }
});

// Get or create user
async function getOrCreateUser(wallet) {
  let result = await pool.query(
    'SELECT * FROM users WHERE wallet_address = $1',
    [wallet]
  );

  if (result.rows.length === 0) {
    result = await pool.query(
      'INSERT INTO users (wallet_address) VALUES ($1) RETURNING *',
      [wallet]
    );
  }

  return result.rows[0];
}

// Get agent by wallet
app.get('/api/agent/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    const user = await getOrCreateUser(wallet);

    const agentResult = await pool.query(
      'SELECT * FROM agents WHERE user_id = $1',
      [user.id]
    );

    if (agentResult.rows.length === 0) {
      return res.json({
        wallet: wallet,
        agent_exists: false,
        message: 'No agent found. Create one first.'
      });
    }

    const agent = agentResult.rows[0];

    const tradesResult = await pool.query(
      `SELECT * FROM trades 
       WHERE agent_id = $1 
       ORDER BY executed_at DESC 
       LIMIT 10`,
      [agent.id]
    );

    const statsResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT a.id) as total_agents,
        COUNT(t.id) as total_trades,
        COALESCE(AVG(CASE WHEN t.success THEN 1.0 ELSE 0.0 END), 0) as avg_win_rate
      FROM agents a
      LEFT JOIN trades t ON a.id = t.agent_id
    `);

    const winRate = agent.total_trades > 0 
      ? agent.winning_trades / agent.total_trades 
      : 0;

    res.json({
      wallet: wallet,
      agent_id: agent.agent_id,
      name: agent.name,
      performance_score: parseInt(agent.performance_score),
      total_trades: parseInt(agent.total_trades),
      winning_trades: parseInt(agent.winning_trades),
      win_rate: parseFloat(winRate.toFixed(4)),
      total_pnl: parseFloat(agent.total_pnl),
      staked_amount: parseFloat(agent.staked_amount),
      rewards_earned: parseFloat(agent.rewards_earned),
      recent_trades: tradesResult.rows.map(t => ({
        id: t.id,
        timestamp: t.executed_at,
        token_in: t.token_in,
        token_out: t.token_out,
        amount_in: parseFloat(t.amount_in),
        amount_out: parseFloat(t.amount_out),
        pnl: parseFloat(t.profit_loss),
        success: t.success
      })),
      network_stats: {
        total_agents: parseInt(statsResult.rows[0].total_agents || 0),
        total_trades: parseInt(statsResult.rows[0].total_trades || 0),
        avg_performance: parseFloat((statsResult.rows[0].avg_win_rate * 100).toFixed(2))
      }
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ 
      error: 'Failed to fetch agent data',
      details: error.message
    });
  }
});

// Create agent
app.post('/api/agent/create', async (req, res) => {
  try {
    const { wallet, name } = req.body;

    if (!wallet) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    const user = await getOrCreateUser(wallet);

    const existingAgent = await pool.query(
      'SELECT * FROM agents WHERE user_id = $1',
      [user.id]
    );

    if (existingAgent.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Agent already exists for this wallet',
        agent_id: existingAgent.rows[0].agent_id
      });
    }

    const agentId = `agent_${Date.now()}_${wallet.slice(0, 8)}`;
    
    const result = await pool.query(
      `INSERT INTO agents (user_id, agent_id, name) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [user.id, agentId, name || 'My AI Agent']
    );

    const agent = result.rows[0];

    res.json({
      success: true,
      agent_id: agent.agent_id,
      name: agent.name,
      wallet: wallet,
      created_at: agent.created_at
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ 
      error: 'Failed to create agent',
      details: error.message
    });
  }
});

// Record trade
app.post('/api/trade', async (req, res) => {
  try {
    const { 
      agent_id, 
      token_in, 
      token_out, 
      amount_in, 
      amount_out,
      strategy_hash 
    } = req.body;

    if (!agent_id || !token_in || !token_out || !amount_in || !amount_out) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const agentResult = await pool.query(
      'SELECT * FROM agents WHERE agent_id = $1',
      [agent_id]
    );

    if (agentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const agent = agentResult.rows[0];
    const profitLoss = parseFloat(amount_out) - parseFloat(amount_in);
    const success = profitLoss > 0;

    const tradeResult = await pool.query(
      `INSERT INTO trades 
       (agent_id, token_in, token_out, amount_in, amount_out, profit_loss, success, strategy_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [agent.id, token_in, token_out, amount_in, amount_out, profitLoss, success, strategy_hash]
    );

    const newTotalTrades = agent.total_trades + 1;
    const newWinningTrades = success ? agent.winning_trades + 1 : agent.winning_trades;
    const newTotalPnl = parseFloat(agent.total_pnl) + profitLoss;
    const newPerformanceScore = Math.round(
      (newWinningTrades / newTotalTrades) * 1000 + newTotalPnl
    );

    await pool.query(
      `UPDATE agents 
       SET total_trades = $1,
           winning_trades = $2,
           total_pnl = $3,
           performance_score = $4
       WHERE id = $5`,
      [newTotalTrades, newWinningTrades, newTotalPnl, newPerformanceScore, agent.id]
    );

    if (strategy_hash) {
      await pool.query(
        `INSERT INTO collective_knowledge (strategy_hash, success_rate, usage_count, average_profit)
         VALUES ($1, $2, 1, $3)
         ON CONFLICT (strategy_hash) 
         DO UPDATE SET 
           usage_count = collective_knowledge.usage_count + 1,
           success_rate = (
             (collective_knowledge.success_rate * collective_knowledge.usage_count + $2) / 
             (collective_knowledge.usage_count + 1)
           ),
           average_profit = (
             (collective_knowledge.average_profit * collective_knowledge.usage_count + $3) /
             (collective_knowledge.usage_count + 1)
           ),
           last_used = NOW()`,
        [strategy_hash, success ? 1.0 : 0.0, profitLoss]
      );
    }

    res.json({
      success: true,
      trade: {
        id: tradeResult.rows[0].id,
        agent_id: agent_id,
        profit_loss: profitLoss,
        success: success,
        executed_at: tradeResult.rows[0].executed_at
      },
      updated_stats: {
        total_trades: newTotalTrades,
        winning_trades: newWinningTrades,
        win_rate: (newWinningTrades / newTotalTrades).toFixed(4),
        total_pnl: newTotalPnl,
        performance_score: newPerformanceScore
      }
    });
  } catch (error) {
    console.error('Error recording trade:', error);
    res.status(500).json({ 
      error: 'Failed to record trade',
      details: error.message
    });
  }
});

// Get collective insights
app.get('/api/collective/insights', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await pool.query(
      `SELECT 
        strategy_hash,
        success_rate,
        usage_count,
        average_profit,
        last_used
      FROM collective_knowledge
      WHERE success_rate > 0.6
      ORDER BY success_rate DESC, average_profit DESC
      LIMIT $1`,
      [limit]
    );

    res.json({
      insights: result.rows.map(row => ({
        strategy_hash: row.strategy_hash,
        success_rate: parseFloat(row.success_rate),
        usage_count: parseInt(row.usage_count),
        average_profit: parseFloat(row.average_profit),
        last_used: row.last_used
      }))
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ 
      error: 'Failed to fetch insights',
      details: error.message
    });
  }
});

// Get network stats
app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT a.id) as total_agents,
        COUNT(t.id) as total_trades,
        COALESCE(SUM(ABS(t.amount_out)), 0) as total_volume,
        COALESCE(AVG(CASE WHEN t.success THEN 1.0 ELSE 0.0 END), 0) as avg_win_rate,
        COALESCE(SUM(t.profit_loss), 0) as total_profit
      FROM agents a
      LEFT JOIN trades t ON a.id = t.agent_id
    `);

    const topPerformers = await pool.query(`
      SELECT agent_id, name, performance_score
      FROM agents
      ORDER BY performance_score DESC
      LIMIT 10
    `);

    res.json({
      total_agents: parseInt(result.rows[0].total_agents || 0),
      total_trades: parseInt(result.rows[0].total_trades || 0),
      total_volume: parseFloat(result.rows[0].total_volume || 0),
      avg_win_rate: parseFloat((result.rows[0].avg_win_rate || 0).toFixed(4)),
      total_profit: parseFloat(result.rows[0].total_profit || 0),
      top_performers: topPerformers.rows.map(a => ({
        agent_id: a.agent_id,
        name: a.name,
        performance_score: parseInt(a.performance_score)
      }))
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      details: error.message
    });
  }
});

// Delete agent (for testing)
app.delete('/api/agent/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;

    const userResult = await pool.query(
      'SELECT * FROM users WHERE wallet_address = $1',
      [wallet]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    await pool.query(
      'DELETE FROM trades WHERE agent_id IN (SELECT id FROM agents WHERE user_id = $1)',
      [user.id]
    );

    await pool.query('DELETE FROM agents WHERE user_id = $1', [user.id]);
    await pool.query('DELETE FROM users WHERE id = $1', [user.id]);

    res.json({ 
      success: true, 
      message: 'Agent and all data deleted' 
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ 
      error: 'Failed to delete agent',
      details: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🧠 HiveMind API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
});
