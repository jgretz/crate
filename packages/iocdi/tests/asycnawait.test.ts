import {describe, it, expect, beforeAll, afterAll} from 'bun:test';
import http from 'node:http';
import {
  setDependency,
  resolveDependency,
  clearContainer,
  setDefaultContainer,
  clearOverrideContainer,
  getDefaultContainerId,
} from '../src/index';

async function pow(n: number, power: number, container: string): Promise<number> {
  setDependency('n', n, container);
  setDependency('result', n, container);

  for (let i = 1; i < power; i++) {
    const result = await next();
    setDependency('result', result, container);
  }

  return resolveDependency<number>('result') || 0;
}

async function next(): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // we can default to 0 because that will cause the test to fail if the dependency is not set
      const n = resolveDependency<number>('n') || 0;
      const result = resolveDependency<number>('result') || 0;

      resolve(result * n);
    }, 100);
  });
}

function createServer() {
  return http.createServer(async (req, res) => {
    if (!req.url) {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('Bad Request: URL is missing\n');
      return;
    }

    if (req.method !== 'GET') {
      res.writeHead(405, {'Content-Type': 'text/plain'});
      res.end('Method Not Allowed: Only GET requests are supported\n');
      return;
    }

    const query = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const rawPower = query.get('power');
    if (!rawPower) {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('Bad Request: Missing "power" query parameter\n');
      return;
    }

    const rawNumber = query.get('number');
    if (!rawNumber) {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('Bad Request: Missing "number" query parameter\n');
      return;
    }

    const power = parseInt(rawPower, 10);
    const number = parseInt(rawNumber, 10);
    const containerId = crypto.randomUUID();

    setDefaultContainer(containerId);
    const result = await pow(number, power, containerId);

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(`${result}`);
  });
}

async function fetchPowerOfNumber(number: number, power: number): Promise<number> {
  const response = await fetch(`http://localhost:8080?number=${number}&power=${power}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.text();
  return parseInt(result, 10);
}

describe('iocdi - Async Await Test', function () {
  let server: http.Server;

  // setup and teardown
  beforeAll(function () {
    clearContainer('default');
    clearOverrideContainer();

    server = createServer();
    server.listen(8080);
  });

  afterAll(function () {
    server.close();
  });

  it('server should return the requested power of the supplied number', async function () {
    const number = 4;
    const power = 20;
    const result = await fetchPowerOfNumber(number, power);

    expect(result).toBe(Math.pow(number, power));
  });

  it('server should handle multiple simultaneous requests', async function () {
    const pairs: [number, number][] = [
      [2, 10],
      [3, 5],
      [5, 10],
      [7, 12],
      [22, 6],
      [5, 6],
      [4, 20],
      [2, 20],
    ];
    const promises = pairs.map(([n, power]) => fetchPowerOfNumber(n, power));

    const results = await Promise.all(promises);
    const expectedResults = pairs.map(([n, power]) => Math.pow(n, power));

    expect(results).toEqual(expectedResults);
  });
});
