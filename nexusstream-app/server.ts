import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import { Client as PGClient } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    name: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'nexus-stream-ultra-secret';
const DB_PATH = path.join(process.cwd(), process.env.NEXUS_DB_PATH || 'nexusstream.db');

const usePostgres = !!process.env.PGHOST || !!process.env.PG_CONNECTION;

let sqliteDb: Database.Database | null = null;
let pgClient: PGClient | null = null;

async function ensurePostgres(): Promise<void> {
  if (!pgClient) {
    pgClient = new PGClient({
      connectionString: process.env.PG_CONNECTION || undefined,
      host: process.env.PGHOST || undefined,
      port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
      user: process.env.PGUSER || undefined,
      password: process.env.PGPASSWORD || undefined,
      database: process.env.PGDATABASE || undefined,
    });
    await pgClient.connect();
  }
}

async function migratePostgres(): Promise<void> {
  if (!pgClient) return;
  await pgClient.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT,
      description TEXT,
      price NUMERIC,
      category TEXT,
      stock INTEGER,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      total_price NUMERIC,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      price NUMERIC
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      level TEXT,
      message TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS idempotency_keys (
      key TEXT PRIMARY KEY,
      order_id INTEGER
    );
  `);
}

function initSqlite(): void {
  sqliteDb = new Database(DB_PATH);
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      price REAL,
      category TEXT,
      stock INTEGER,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total_price REAL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      price REAL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level TEXT,
      message TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS idempotency_keys (
      key TEXT PRIMARY KEY,
      order_id INTEGER
    );
  `);

  const productCount = sqliteDb.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (productCount && productCount.count === 0) {
    const products = [
      ['Quantum Blade X1', 'High-performance developer laptop with 64GB RAM.', 2499.99, 'Hardware', 50, 'https://images.unsplash.com/photo-1517336712462-83975851d87d?auto=format&fit=crop&q=80&w=800'],
      ['Nexus Stream Pods', 'Noise-canceling earbuds for deep focus sessions.', 199.99, 'Hardware', 100, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
      ['Full-Stack Mastery', 'Comprehensive course on Next.js, Express, and SQL.', 49.99, 'Digital', 1000, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'],
      ['AI Agent Architect', 'Learn to build and deploy RAG agents.', 89.99, 'Digital', 1000, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800']
    ];
    const insertProduct = sqliteDb.prepare("INSERT INTO products (name, description, price, category, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)");
    const insertMany = sqliteDb.transaction((items: any[]) => {
      for (const item of items) insertProduct.run(item);
    });
    insertMany(products);
  }
}

async function startServer(): Promise<void> {
  const app = express();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  app.use(express.json());
  app.use(cookieParser());

  if (usePostgres) {
    await ensurePostgres();
    await migratePostgres();
  } else {
    initSqlite();
  }

  const log = async (level: string, message: string): Promise<void> => {
    console.log(`[${level}] ${message}`);
    try {
      if (usePostgres && pgClient) {
        await pgClient.query("INSERT INTO audit_logs (level, message) VALUES ($1, $2)", [level, message]);
      } else if (sqliteDb) {
        sqliteDb.prepare("INSERT INTO audit_logs (level, message) VALUES (?, ?)").run(level, message);
      }
    } catch (e) {
      console.error('Log write failed', e);
    }
  };

  const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const token = req.cookies.nexus_session || bearerToken;

    if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ success: false, error: 'Forbidden' });
      req.user = user;
      next();
    });
  };

  const testMode = process.env.TEST_MODE === '1' || process.env.NODE_ENV === 'test';
  if (testMode) {
    app.post('/api/test/seed', async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const products = body.products || null;

    const defaultProducts = [
      ['Quantum Blade X1', 'High-performance developer laptop with 64GB RAM.', 2499.99, 'Hardware', 50, 'https://images.unsplash.com/photo-1517336712462-83975851d87d?auto=format&fit=crop&q=80&w=800'],
      ['Nexus Stream Pods', 'Noise-canceling earbuds for deep focus sessions.', 199.99, 'Hardware', 100, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
      ['Full-Stack Mastery', 'Comprehensive course on Next.js, Express, and SQL.', 49.99, 'Digital', 1000, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'],
      ['AI Agent Architect', 'Learn to build and deploy RAG agents.', 89.99, 'Digital', 1000, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800']
    ];

    if (usePostgres && pgClient) {
      if (products && Array.isArray(products)) {
        for (const p of products) {
          await pgClient.query(
            'INSERT INTO products (name, description, price, category, stock, image_url) VALUES ($1,$2,$3,$4,$5,$6)',
            [p.name, p.description || '', p.price || 0, p.category || 'Digital', p.stock || 0, p.image_url || '']
          );
        }
      } else {
        const count = await pgClient.query('SELECT COUNT(*) as count FROM products');
        if (Number(count.rows[0].count) === 0) {
          for (const item of defaultProducts) {
            await pgClient.query(
              'INSERT INTO products (name, description, price, category, stock, image_url) VALUES ($1,$2,$3,$4,$5,$6)',
              item
            );
          }
        }
      }
    } else if (sqliteDb) {
      if (products && Array.isArray(products)) {
        const insert = sqliteDb.prepare("INSERT INTO products (name, description, price, category, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)");
        const tx = sqliteDb.transaction((items: any[]) => {
          for (const p of items) insert.run(p.name, p.description || '', p.price || 0, p.category || 'Digital', p.stock || 0, p.image_url || '');
        });
        tx(products);
      } else {
        const c = sqliteDb.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
        if (c.count === 0) {
          const insertProduct = sqliteDb.prepare("INSERT INTO products (name, description, price, category, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)");
          const insertMany = sqliteDb.transaction((items: any[]) => {
            for (const item of items) insertProduct.run(item);
          });
          insertMany(defaultProducts);
        }
      }
    }
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

    app.post('/api/test/teardown', async (req: Request, res: Response) => {
      try {
        if (usePostgres && pgClient) {
          await pgClient.query(`
            TRUNCATE order_items, orders, products, users, audit_logs, idempotency_keys RESTART IDENTITY CASCADE
          `);
        } else if (sqliteDb) {
          sqliteDb.exec(`
            DELETE FROM order_items;
            DELETE FROM orders;
            DELETE FROM products;
            DELETE FROM users;
            DELETE FROM audit_logs;
            DELETE FROM idempotency_keys;
            DELETE FROM sqlite_sequence WHERE name IN ('order_items', 'orders', 'products', 'users', 'audit_logs');
          `);
        }
        res.json({ success: true });
      } catch (e: any) {
        res.status(500).json({ success: false, error: e.message });
      }
    });
  }

  app.post('/api/mock/payment', (req: Request, res: Response) => {
    const { result } = req.body || {};
    if (result === 'timeout') {
      setTimeout(() => res.status(504).json({ success: false, error: 'Payment timeout' }), 15000);
      return;
    }
    if (result === 'fail') return res.status(402).json({ success: false, error: 'Payment failed' });
    return res.json({ success: true, transaction_id: `tx_${Date.now()}` });
  });

  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ success: true, status: "operational", timestamp: new Date().toISOString() });
  });

  app.post('/api/auth/register', async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) return res.status(400).json({ success: false, error: 'Invalid email format' });
    if (!password || password.length < 6) return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
    if (!name) return res.status(400).json({ success: false, error: 'Name is required' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      if (usePostgres && pgClient) {
        await pgClient.query('INSERT INTO users (email, password, name) VALUES ($1, $2, $3)', [email, hashedPassword, name]);
      } else if (sqliteDb) {
        sqliteDb.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)").run(email, hashedPassword, name);
      }
      await log('INFO', `User registered: ${email}`);
      res.json({ success: true, message: 'User created' });
    } catch (err: any) {
      await log('ERROR', `Registration failed for ${email}: ${err.message}`);
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      let user: any = null;
      if (usePostgres && pgClient) {
        const r = await pgClient.query('SELECT * FROM users WHERE email = $1', [email]);
        user = r.rows[0];
      } else if (sqliteDb) {
        user = sqliteDb.prepare("SELECT * FROM users WHERE email = ?").get(email);
      }

      if (!user || !bcrypt.compareSync(password, user.password)) {
        await log('WARNING', `Failed login attempt for ${email}`);
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
      res.cookie('nexus_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      await log('INFO', `User logged in: ${email}`);
      res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err: any) {
      await log('ERROR', `Login error for ${email}: ${err.message}`);
      res.status(500).json({ success: false, error: 'Internal error' });
    }
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    res.clearCookie('nexus_session');
    res.json({ success: true });
  });

  app.get('/api/products', async (req: Request, res: Response) => {
    const { category } = req.query;
    try {
      if (usePostgres && pgClient) {
        if (category) {
          const r = await pgClient.query('SELECT * FROM products WHERE category = $1', [category]);
          res.json({ data: r.rows });
        } else {
          const r = await pgClient.query('SELECT * FROM products');
          res.json({ data: r.rows });
        }
      } else if (sqliteDb) {
        let rows;
        if (category) rows = sqliteDb.prepare("SELECT * FROM products WHERE category = ?").all(category);
        else rows = sqliteDb.prepare("SELECT * FROM products").all();
        res.json({ data: rows });
      } else {
        res.json({ data: [] });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/products', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { name, description, price, category, stock, image_url } = req.body;
    if (typeof price !== 'number' || price < 0) return res.status(400).json({ success: false, error: 'Invalid price' });
    if (!name || !category) return res.status(400).json({ success: false, error: 'Missing fields' });

    try {
      if (usePostgres && pgClient) {
        const r = await pgClient.query(
          'INSERT INTO products (name, description, price, category, stock, image_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
          [name, description || '', price, category, stock || 0, image_url || '']
        );
        res.json({ success: true, id: r.rows[0].id });
      } else if (sqliteDb) {
        const result = sqliteDb.prepare("INSERT INTO products (name, description, price, category, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)").run(
          name, description || '', price, category, stock || 0, image_url || ''
        );
        res.json({ success: true, id: result.lastInsertRowid });
      } else {
        res.status(500).json({ success: false, error: 'DB not available' });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/orders', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { items, totalPrice } = req.body;
    const computedTotal = (items && Array.isArray(items)) ? items.reduce((acc: number, it: any) => {
      const price = typeof it.price === 'number' ? it.price : Number(it.price || 0);
      const qty = typeof it.quantity === 'number' ? it.quantity : Number(it.quantity || 1);
      return acc + price * qty;
    }, 0) : 0;
    const total = typeof totalPrice === 'number' ? totalPrice : computedTotal;
    const userId = req.user?.id;
    const idempotencyKey = (req.headers['idempotency-key'] as string) || null;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid order items' });
    }

    try {
      if (idempotencyKey) {
        if (usePostgres && pgClient) {
          const r = await pgClient.query('SELECT order_id FROM idempotency_keys WHERE key = $1', [idempotencyKey]);
          if (r.rowCount && r.rowCount > 0) return res.json({ success: true, orderId: r.rows[0].order_id });
        } else if (sqliteDb) {
          const found = sqliteDb.prepare('SELECT order_id FROM idempotency_keys WHERE key = ?').get(idempotencyKey) as { order_id: number } | undefined;
          if (found) return res.json({ success: true, orderId: found.order_id });
        }
      }

      for (const item of items) {
        if (usePostgres && pgClient) {
          const r = await pgClient.query('SELECT stock FROM products WHERE id = $1', [item.id]);
          const stock = r.rowCount ? Number(r.rows[0].stock) : null;
          if (stock === null || stock < item.quantity) return res.status(409).json({ success: false, error: 'Insufficient stock' });
        } else if (sqliteDb) {
          const row = sqliteDb.prepare('SELECT stock FROM products WHERE id = ?').get(item.id) as { stock: number } | undefined;
          const stock = row ? row.stock : null;
          if (stock === null || stock < item.quantity) return res.status(409).json({ success: false, error: 'Insufficient stock' });
        }
      }

      if (usePostgres && pgClient) {
        await pgClient.query('BEGIN');
        try {
          const r = await pgClient.query('INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id', [userId, total]);
          const orderId = r.rows[0].id;
          for (const item of items) {
            await pgClient.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)', [orderId, item.id, item.quantity, item.price]);
            await pgClient.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.id]);
          }
          if (idempotencyKey) await pgClient.query('INSERT INTO idempotency_keys (key, order_id) VALUES ($1, $2)', [idempotencyKey, orderId]);
          await pgClient.query('COMMIT');
          await log('INFO', `Order #${orderId} created by user ${userId}`);
          return res.json({ success: true, orderId });
        } catch (e) {
          await pgClient.query('ROLLBACK');
          throw e;
        }
      } else if (sqliteDb) {
        const executeOrder = sqliteDb.transaction(() => {
          const orderResult = sqliteDb!.prepare("INSERT INTO orders (user_id, total_price) VALUES (?, ?)").run(userId, total);
          const orderId = orderResult.lastInsertRowid;
          const insertItem = sqliteDb!.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
          const updateStock = sqliteDb!.prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
          for (const item of items) {
            insertItem.run(orderId, item.id, item.quantity, item.price);
            updateStock.run(item.quantity, item.id);
          }
          if (idempotencyKey) sqliteDb!.prepare('INSERT INTO idempotency_keys (key, order_id) VALUES (?, ?)').run(idempotencyKey, orderId);
          return orderId;
        });
        const orderId = executeOrder();
        await log('INFO', `Order #${orderId} created by user ${userId}`);
        return res.json({ success: true, orderId });
      }

      res.status(500).json({ success: false, error: 'DB not available' });
    } catch (err: any) {
      await log('ERROR', `Order creation failed for user ${userId}: ${err.message}`);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/admin/logs', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (usePostgres && pgClient) {
        const r = await pgClient.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
        res.json({ success: true, data: r.rows });
      } else if (sqliteDb) {
        const rows = sqliteDb.prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100").all();
        res.json({ success: true, data: rows });
      } else {
        res.json({ success: true, data: [] });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/policy', (req: Request, res: Response) => {
    const policy = `Refund Policy: Digital products non-refundable once accessed. Hardware has a 30-day return window.`;
    res.json({ success: true, policy });
  });

  app.get('/api/user', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    res.json({
      success: true,
      user: {
        id: req.user?.id,
        email: req.user?.email,
        name: req.user?.name,
        role: req.user?.role,
      }
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    log('SYSTEM', 'Server started.');
  });
}

startServer();