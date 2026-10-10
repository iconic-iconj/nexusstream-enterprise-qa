import http from 'k6/http';
import { check, sleep, group } from 'k6';

// 1. Optimized Load Scenarios & Strict Quality Gates
export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp-up
    { duration: '1m', target: 25 },  // Steady-state stress load
    { duration: '30s', target: 0 },   // Ramp-down cool-down
  ],
  thresholds: {
    // Quality Gates: Fail CI/CD pipelines if performance drops
    'http_req_duration{name:get-products}': ['p(95)<500'], 
    'http_req_failed{name:get-products}': ['rate<0.05'],    
  },
};

// 2. Global Execution Environment Configurations
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const REQUEST_PARAMS = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  tags: { name: 'get-products' }, // Isolates metrics on Grafana/k6 dashboards
};

// 3. Simulated Virtual User Lifecycle Execution
export default function () {
  group('Storefront Product Catalog API', function () {
    const res = http.get(`${BASE_URL}/api/products`, REQUEST_PARAMS);

    // Strict validation assertions
    const pass = check(res, {
      'status is 200': (r) => r.status === 200,
      'response time under 500ms': (r) => r.timings.duration < 500,
    });

    // Dynamic pacing: Adjust sleep based on whether the endpoint is struggling
    if (!pass) {
      sleep(2); // Ease up on the server if responses fail or lag
    } else {
      sleep(1); // Standard pacing threshold
    }
  });
}
