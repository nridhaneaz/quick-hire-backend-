import mongoose from 'mongoose';
import dns from 'dns';
import logger from './src/core/config/logger.js'; 
import { app } from './src/app.js'; 
import { mongoURI, port } from './src/core/config/config.js';

async function resolveSrvAndConnect(uri) {
  try {
    if (!uri) {
      throw new Error('MONGO_URI is not set');
    }

    // If URI is not SRV, attempt normal connect
    if (!uri.startsWith('mongodb+srv://')) {
      await mongoose.connect(uri);
      logger.info('MongoDB connected (non-SRV)');
      app.listen(port, () => {
        logger.info(`Server running on port ${port}`);
      });
      return;
    }

    // For SRV URIs, try resolving SRV records first (helps provide a clearer error and allow fallback DNS)
    const rest = uri.replace('mongodb+srv://', '');
    const hostWithRest = rest.includes('@') ? rest.split('@').pop() : rest;
    const host = hostWithRest.split('/')[0];
    const srvName = `_mongodb._tcp.${host}`;

    // Try system DNS
    try {
      const records = await dns.promises.resolveSrv(srvName);
      logger.info('SRV records resolved (system DNS)', { srvName, records });
      await mongoose.connect(uri);
      logger.info('MongoDB connected (SRV)');
      app.listen(port, () => {
        logger.info(`Server running on port ${port}`);
      });
      return;
    } catch (sysDnsErr) {
      logger.error('SRV resolution failed (system DNS):', sysDnsErr && sysDnsErr.code ? sysDnsErr.code : sysDnsErr.message || sysDnsErr);
    }

    // Fallback: try public DNS servers (Google + Cloudflare)
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
      const records = await dns.promises.resolveSrv(srvName);
      logger.info('SRV records resolved (fallback DNS)', { srvName, records });
      await mongoose.connect(uri);
      logger.info('MongoDB connected (SRV via fallback DNS)');
      app.listen(port, () => {
        logger.info(`Server running on port ${port}`);
      });
      return;
    } catch (fallbackErr) {
      logger.error('SRV resolution failed with fallback DNS:', fallbackErr && fallbackErr.code ? fallbackErr.code : fallbackErr.message || fallbackErr);
      logger.error('Unable to resolve SRV records for your Atlas host. Suggestions:');
      logger.error('- Ensure your system/network allows SRV DNS lookups (no restrictive firewall/VPN).');
      logger.error('- Try changing your system DNS to 8.8.8.8 or 1.1.1.1 and restart the app.');
      logger.error('- In the Atlas UI use "Connect > Drivers > Standard Connection String" and put the non-SRV URI into your .env as MONGO_URI.');
      process.exit(1);
    }
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

resolveSrvAndConnect(mongoURI);

