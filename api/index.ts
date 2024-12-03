import '../src/main';
import * as path from 'path';
import * as fs from 'fs';

// Set environment variable for Hardhat global directory
const tmpPath = path.join('/tmp', 'hardhat_global_dir');

// Buat direktori jika belum ada
if (!fs.existsSync(tmpPath)) {
  fs.mkdirSync(tmpPath, { recursive: true });
}

process.env.HARDHAT_GLOBAL_DIR = tmpPath;
