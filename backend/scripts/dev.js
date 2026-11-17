const { spawn } = require('child_process');
const path = require('path');

const services = [
  ['gateway', 'gateway/src/server.js'],
  ['identity', 'services/identity-service/src/server.js'],
  ['festival', 'services/festival-service/src/server.js'],
  ['audit', 'services/audit-service/src/server.js']
];

const children = [];
let stopping = false;

const stopAll = (exitCode = 0) => {
  if (stopping) return;
  stopping = true;
  process.exitCode = exitCode;
  for (const child of children) {
    if (child.exitCode === null && !child.killed) child.kill();
  }
};

for (const [name, entry] of services) {
  const child = spawn(process.execPath, [path.resolve(__dirname, '..', entry)], {
    cwd: path.resolve(__dirname, '..'),
    env: process.env,
    stdio: 'inherit'
  });
  children.push(child);
  child.on('error', (err) => {
    console.error(`Could not start ${name} service`, err);
    stopAll(1);
  });
  child.on('exit', (code) => {
    if (!stopping) {
      console.error(`${name} service exited unexpectedly with code ${code}`);
      stopAll(code || 1);
    }
  });
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
