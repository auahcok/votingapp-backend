import '../src/main';
import fs from 'fs';

const tmpDir = '/tmp/hardhat';
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}
