import axios from 'axios';

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for caching
client.interceptors.request.use(config => {
  if (config.method === 'get') {
    const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_TTL) {
      return Promise.reject({
        __CACHE__: true,
        data: cachedResponse.data
      });
    }
  }
  return config;
});

// Add response interceptor for caching
client.interceptors.response.use(
  response => {
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  error => {
    if (error.__CACHE__) {
      return Promise.resolve({ data: error.data });
    }
    return Promise.reject(error);
  }
);

// Batch requests
const batchRequests = new Map();
const BATCH_DELAY = 50; // ms

const batchRequest = (key, request) => {
  if (!batchRequests.has(key)) {
    batchRequests.set(key, []);
    setTimeout(() => {
      const requests = batchRequests.get(key);
      batchRequests.delete(key);
      Promise.all(requests.map(r => r()));
    }, BATCH_DELAY);
  }
  return new Promise((resolve, reject) => {
    batchRequests.get(key).push(() => request().then(resolve).catch(reject));
  });
};

export { client, batchRequest }; 