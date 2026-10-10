import http from 'k6/http';
import { check, sleep, group } from 'k6';


export const options = {
  stages: [
    { duration: '30s', target: 10 }, 
    { duration: '1m', target: 25 },  
    { duration: '30s', target: 0 },],
  thresholds: {
    'http_req_duration{name:get-products}': ['p(95)<500'], 
    'http_req_failed{name:get-products}': ['rate<0.05'],  },};


const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const REQUEST_PARAMS = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',},
  tags: { name: 'get-products' },};


export default function () {group('Storefront Product Catalog API', function () {
    const res = http.get(`${BASE_URL}/api/products`, REQUEST_PARAMS);
    const pass = check(res, {
      'status is 200': (r) => r.status === 200,
      'response time under 500ms': (r) => r.timings.duration < 500,
    });
    if (!pass) {
      sleep(2); 
    } else {
      sleep(1); 
    }
  });
}
