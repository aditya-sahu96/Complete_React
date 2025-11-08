// ================================================================
// AXIOS — Complete Guide (Beginner → Professional, industry-grade)
// Format: code + detailed inline comments explaining every concept.
// ================================================================

/*
INSTALLATION
------------
npm install axios
or
yarn add axios
*/

// -----------------------------------------------
// 0) WHAT IS AXIOS? (simple words)
// -----------------------------------------------
// Axios is a promise-based HTTP client for browser and Node.js.
// It wraps lower-level networking APIs (fetch/xhr in browsers, http in Node),
// and provides conveniences: automatic JSON parsing, request/response interceptors,
// timeouts, cancellation, file uploads, and an easy API for making requests.

// Axios returns Promises and integrates smoothly with async/await.

// -----------------------------------------------
// 1) BASIC USAGE: GET / POST with async/await
// -----------------------------------------------

import axios from "axios";

async function basicExamples() {
  try {
    // GET request
    const res = await axios.get("/api/posts"); // returns an AxiosResponse object
    // data is in res.data
    console.log("Posts:", res.data);

    // POST request with body
    const createRes = await axios.post("/api/posts", { title: "Hello", body: "World" });
    console.log("Created:", createRes.data);

    // Query params using params option
    const search = await axios.get("/api/search", { params: { q: "axios", page: 2 } });
    console.log("Search results:", search.data);
  } catch (err) {
    // Error handling (covered later in detail)
    console.error("Request failed:", err);
  }
}

// Equivalent with Promise chaining:
axios.get("/api/posts")
  .then(res => console.log(res.data))
  .catch(err => console.error(err));

// -----------------------------------------------
// 2) AXIOS RESPONSE SHAPE
// -----------------------------------------------
// AxiosResponse: { data, status, statusText, headers, config, request }
// You usually care about response.data (server payload).

// -----------------------------------------------
// 3) CREATING AN AXIOS INSTANCE (recommended)
// -----------------------------------------------
// Use axios.create() to make an instance with shared defaults (baseURL, headers, timeout).
// This avoids repeating baseURL and options everywhere.

const api = axios.create({
  baseURL: "https://api.example.com/v1",
  timeout: 10000, // 10s
  headers: {
    "Content-Type": "application/json",
  },
});

// Use the instance exactly like axios:
async function instanceExample() {
  const { data } = await api.get("/users/me");
  return data;
}

// PRO TIP:
// Keep one instance per API (or per domain), so you can attach interceptors and config centrally.

// -----------------------------------------------
// 4) REQUEST CONFIGURATION OPTIONS (important ones)
// -----------------------------------------------
/*
axios({ method, url, data, params, headers, timeout, responseType, withCredentials, auth, transformRequest, transformResponse, onUploadProgress, onDownloadProgress })
*/
await api.get("/endpoint", {
  params: { page: 1, q: "react" },     // query string params
  headers: { "X-Custom": "value" },     // request-specific headers
  timeout: 5000,                        // override instance timeout
  responseType: "json",                 // 'arraybuffer', 'blob' (browser), 'stream' (node)
  withCredentials: true,                // include cookies in cross-site requests
});

// -----------------------------------------------
// 5) INTERCEPTORS — request & response pipeline
// -----------------------------------------------
// Interceptors let you run code before a request is sent or before a response is handled.
// Common uses: attach auth token, refresh token logic, logging, global error handling.

const requestInterceptorId = api.interceptors.request.use(
  (config) => {
    // mutate/augment config before request is sent
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    // attach a timestamp for logging/debugging
    config.headers["X-Request-Started-At"] = Date.now();
    return config;
  },
  (error) => {
    // handle request setup error
    return Promise.reject(error);
  }
);

const responseInterceptorId = api.interceptors.response.use(
  (response) => {
    // run for 2xx responses (success)
    // you can transform response here
    return response;
  },
  (error) => {
    // handle non-2xx responses or network errors
    // central error logging, toast notifications, etc.
    // NOTE: error.response may be undefined for network errors/timeouts
    return Promise.reject(error);
  }
);

// You can eject interceptors if needed (cleanup)
api.interceptors.request.eject(requestInterceptorId);
api.interceptors.response.eject(responseInterceptorId);

// IMPORTANT: Interceptor order matters: request interceptors run in order added;
// response interceptors run in reverse order.

// -----------------------------------------------
// 6) ERROR HANDLING — axios errors explained
// -----------------------------------------------
// Axios errors have a specific shape. Distinguish network vs server errors.

try {
  await api.get("/whatever");
} catch (err) {
  if (axios.isAxiosError(err)) {
    // Axios error type
    if (err.response) {
      // Server responded with non 2xx status
      console.error("Server Error:", err.response.status, err.response.data);
    } else if (err.request) {
      // No response received (network error)
      console.error("No response - network error:", err.request);
    } else {
      // Error creating request
      console.error("Request setup error:", err.message);
    }
    // You can also access config: err.config
  } else {
    // Not Axios error, some other error happened
    console.error("Unknown error", err);
  }
}

// PRO TIP:
// Use centralized error handling in response interceptor and rethrow or provide normalized error object.

// -----------------------------------------------
// 7) CANCELLATION (AbortController) — cancel inflight requests
// -----------------------------------------------
// Modern axios supports AbortController (preferred), or CancelToken (deprecated).

const controller = new AbortController();

api.get("/long-running", { signal: controller.signal })
  .then(res => console.log("done"))
  .catch(err => {
    if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
      console.log("Request canceled");
    } else {
      console.error(err);
    }
  });

// Cancel from elsewhere:
controller.abort(); // triggers cancellation

// In React: create controller inside effect and abort in cleanup:
import { useEffect } from "react";
function useData(id) {
  useEffect(() => {
    const ctrl = new AbortController();
    api.get(`/items/${id}`, { signal: ctrl.signal })
      .then((res) => {
        // handle success (e.g., set state with res.data)
        // console.log(res.data);
      })
      .catch((err) => {
        // handle error / cancellation
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") {
          // request was cancelled
        } else {
          console.error(err);
        }
      });
    return () => ctrl.abort();
  }, [id]);
}

// -----------------------------------------------
// 8) TIMEOUTS & RETRIES
// -----------------------------------------------
// Timeout at config level rejects requests if no response in time:
api.get("/slow", { timeout: 3000 }).catch(err => console.log(err.code)); // 'ECONNABORTED' typical

// Retry logic isn't built-in. Implement with interceptor or use axios-retry library.
// Below: simple exponential backoff retry interceptor:

function attachRetryInterceptor(instance, options = {}) {
  const { retries = 3, retryDelay = (retryCount) => 1000 * Math.pow(2, retryCount) } = options;

  instance.interceptors.response.use(null, async (error) => {
    const config = error.config;
    if (!config || !config.retry) {
      // allow enabling per-request via config.retry = true
    }
    config.__retryCount = config.__retryCount || 0;

    if (config.__retryCount >= retries) return Promise.reject(error);

    // optionally check error.response.status to only retry on specific codes (e.g., 502, 503)
    config.__retryCount += 1;
    const delay = retryDelay(config.__retryCount);
    await new Promise((res) => setTimeout(res, delay));
    return instance(config); // retry request
  });
}

// Use:
// attachRetryInterceptor(api, { retries: 3 });

// PRO TIP: Use robust libraries (axios-retry) for production-grade retry logic.
// Always be careful with retries on non-idempotent methods (POST) — prefer server-side idempotency keys.

// -----------------------------------------------
// 9) CONCURRENT REQUESTS — axios.all / Promise.all
// -----------------------------------------------
// For multiple independent requests, use Promise.all. Axios provides axios.all / spread helper (older).

// modern approach (Promise.all)
const [usersRes, postsRes] = await Promise.all([api.get("/users"), api.get("/posts")]);
console.log(usersRes.data, postsRes.data);

// axios.spread (not necessary anymore):
import { all, spread } from "axios";
axios.all([api.get("/a"), api.get("/b")]).then(axios.spread((a, b) => console.log(a.data, b.data)));

// -----------------------------------------------
// 10) UPLOADING FILES (multipart/form-data)
// -----------------------------------------------
// For file uploads use FormData. In browser, axios auto-sets Content-Type with boundary for FormData.

async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  form.append("title", "My file");

  const res = await api.post("/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      // progressEvent.loaded, progressEvent.total
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`Upload progress: ${percent}%`);
    },
  });

  return res.data;
}

// For Node.js form-data usage, use form-data package and set headers appropriately.

// -----------------------------------------------
// 11) DOWNLOADING FILES (arraybuffer / blob)
// -----------------------------------------------

async function downloadFile() {
  const res = await api.get("/export/pdf", { responseType: "blob" }); // or 'arraybuffer'
  const url = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = "report.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// -----------------------------------------------
// 12) PROGRESS & UPLOAD/DOWNLOAD HOOKS
// -----------------------------------------------
/*
Use onUploadProgress and onDownloadProgress (browser only).
They receive progressEvent with loaded and total bytes.
*/

// -----------------------------------------------
// 13) TRANSFORM REQUEST & RESPONSE (pre/post processing)
// -----------------------------------------------
// transformRequest and transformResponse allow you to change payload before sending/after receiving.

const instanceWithTransforms = axios.create({
  baseURL: "/api",
  transformRequest: [
    (data, headers) => {
      // e.g., convert body to snake_case, attach meta
      if (data && headers["Content-Type"] === "application/json") {
        return JSON.stringify({ ...data, sentAt: Date.now() });
      }
      return data;
    },
    ...(axios.defaults.transformRequest || []),
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse || []),
    (data) => {
      // e.g., normalize keys
      try {
        const parsed = JSON.parse(data);
        return parsed;
      } catch {
        return data;
      }
    },
  ],
});

// -----------------------------------------------
// 14) AUTHENTICATION PATTERNS (JWT, refresh token)
// -----------------------------------------------
// Two common approaches:
// - Store tokens in localStorage (simple but vulnerable to XSS).
// - Store tokens in httpOnly cookies (safer for XSS but vulnerable to CSRF unless properly handled).
// Below: attaching access token in header + refresh flow example (robust pattern).

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// Response interceptor for refreshing token
api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Another refresh ongoing — queue request until refresh completes
        return new Promise((resolve) =>
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          })
        );
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        // call refresh endpoint (should be idempotent and secure)
        const refreshToken = localStorage.getItem("refreshToken");
        const tokenRes = await axios.post("/auth/refresh", { refreshToken }); // use base axios or separate instance
        const newToken = tokenRes.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        onRefreshed(newToken);
        return api(originalRequest);
      } catch (refreshErr) {
        // refresh failed -> logout user or redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // option: window.location = '/login'
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// PRO TIPS:
// - Keep refresh token endpoint protected & limited in use.
// - Consider storing refresh token in httpOnly cookie; then refresh calls are cookie-based (more secure).
// - Always avoid infinite refresh loops (detect via _retry flag).

// -----------------------------------------------
// 15) WITH CREDENTIALS & COOKIES (cross-site)
// -----------------------------------------------
// If server uses cookies for auth, set withCredentials: true and configure server CORS to allow credentials.

api.get("/private", { withCredentials: true });

// Server must set Access-Control-Allow-Credentials: true and proper origin.

// -----------------------------------------------
// 16) REQUEST/RESPONSE TIME FORMAT & DATES
// -----------------------------------------------
// If your API returns ISO strings, you might deserialize dates to Date objects in transformResponse.

// -----------------------------------------------
// 17) ADAPTERS (Node vs Browser customization)
// -----------------------------------------------
// Axios uses adapters to perform requests. You can provide a custom adapter for testing or special transports.
// Rarely needed; useful in SSR or special networking layers.

// -----------------------------------------------
// 18) TYPING AXIOS WITH TYPESCRIPT (short guide)
// -----------------------------------------------
// Axios ships with types. Example:

/*
import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface User {
  id: number;
  name: string;
}

const api: AxiosInstance = axios.create({ baseURL: '/api' });

async function getUser(id: number): Promise<User> {
  const res: AxiosResponse<User> = await api.get(`/users/${id}`);
  return res.data;
}
*/

// PRO TIP: create typed API client layer that returns DTOs (data transfer objects) — keeps components decoupled.

// -----------------------------------------------
// 19) TESTING & MOCKING AXIOS
// -----------------------------------------------
// Unit test patterns:
// - Mock axios module using jest.mock('axios') and set axios.get.mockResolvedValue({ data: ... })
// - For integration tests, use MSW (Mock Service Worker) to intercept network calls and respond with test data.

// Example Jest mock:
/*
jest.mock('axios');
import axios from 'axios';
axios.get.mockResolvedValue({ data: { id:1, name:'Aditya' } });
*/
// Then call your function and assert behavior.

// Use axios-mock-adapter for testing axios-specific flows (interceptors etc.)

// -----------------------------------------------
// 20) SECURITY BEST PRACTICES
// -----------------------------------------------
// - Prefer httpOnly cookies for tokens when possible (reduces XSS risk).
// - Use CSRF protection for cookie-based auth.
//// - Validate inputs server-side and never trust client data.
// - Avoid sending sensitive data in query params (they appear in logs).
// - Use TLS (HTTPS) always.
// - Sanitize headers and avoid exposing internal secrets in client bundles.
// - Limit request size (both client and server).

// -----------------------------------------------
// 21) PERFORMANCE TIPS
// -----------------------------------------------
// - Reuse axios instances instead of creating new ones frequently.
// - Use conditional fetching and caching (React Query or custom caches).
// - Avoid unnecessary retrying and polling; use server push (SSE/WS) for real-time.
// - Debounce input-driven requests (search) and cancel previous requests.
// - Use compression (gzip/br) on server responses to save bandwidth.
// - Use streaming downloads (responseType: 'stream') in Node for large files.

// -----------------------------------------------
// 22) INTEGRATION PATTERNS
// -----------------------------------------------
// A) With React Query / TanStack Query:
// - Use axios as the fetcher inside useQuery/useMutation:
//    const fetcher = (key, id) => api.get(`/item/${id}`).then(r => r.data)
// - React Query handles cache and retries; axios handles network.

// B) With Redux / RTK:
// - Dispatch async thunks that call axios.
// - Or use RTK Query and have it use axios via fetchBaseQuery-like custom baseQuery (rare; RTK Query uses fetch by default).

// C) SSR (Next.js) considerations:
// - In Next.js getServerSideProps, you can call axios on server; be careful with baseURL and cookies.
// - Create separate axios instance for server (with server baseURL) and client.

// -----------------------------------------------
// 23) ADVANCED: RATE LIMITING & QUEUING
// -----------------------------------------------
// Client-side throttling: implement a request queue and delay when rate limit reached.
// Use libraries like p-queue or Bottleneck for sophisticated control.

// Example simple token-bucket limiter (conceptual) — prefer libraries for production.

// -----------------------------------------------
// 24) EXAMPLE: FULL-PRODUCTION AXIOS SETUP (pattern)
// -----------------------------------------------

/*
// file: src/lib/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // if using cookies
});

// Request interceptor: attach token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

// Response interceptor: global error handling & refresh token
let refreshing = false;
let queue = [];

apiClient.interceptors.response.use(
  res => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      if (refreshing) {
        // wait until refresh done
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return apiClient(original);
        });
      }
      original._retry = true;
      refreshing = true;
      try {
        const r = await axios.post('/auth/refresh', { refreshToken: localStorage.getItem('refreshToken') });
        const newToken = r.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        apiClient.defaults.headers.Authorization = `Bearer ${newToken}`;
        queue.forEach(q => q.resolve(newToken));
        queue = [];
        return apiClient(original);
      } catch (refreshErr) {
        queue.forEach(q => q.reject(refreshErr));
        queue = [];
        // logout: redirect to login
        return Promise.reject(refreshErr);
      } finally {
        refreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default apiClient;
*/

// Use this single client across the app for consistent behavior.

// -----------------------------------------------
// 25) COMMON MISTAKES TO AVOID
// -----------------------------------------------
// - Mutating config object in interceptors without returning it.
// - Forgetting to handle network errors (err.response may be undefined).
// - Infinite refresh loops (prevent via flag _retry).
// - Using localStorage for refresh token (security risk).
// - Recreating axios instance in many places (loses interceptors).
// - Not aborting inflight requests when components unmount (memory leaks).

// -----------------------------------------------
// 26) QUICK REFERENCE / CHEAT SHEET
// -----------------------------------------------
// axios.get(url, { params, headers })
// axios.post(url, data, { headers })
// axios.create({ baseURL, timeout, headers })
// instance.interceptors.request.use(fn, errFn)
// instance.interceptors.response.use(fn, errFn)
// use AbortController for cancellation
// responseType: 'json' | 'blob' | 'arraybuffer' | 'stream'
// onUploadProgress / onDownloadProgress (browser)
// withCredentials: true (cookies)
// transformRequest / transformResponse

// -----------------------------------------------
// 27) PRACTICAL EXAMPLES (short snippets)
// -----------------------------------------------

// Example: API wrapper that always returns data or throws normalized error
async function requestData(path, opts = {}) {
  try {
    const res = await api(path, opts);
    return res.data;
  } catch (error) {
    // normalize axios error into { message, status, details }
    if (axios.isAxiosError(error)) {
      const err = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      };
      throw err;
    }
    throw { message: "Unknown error", original: error };
  }
}

// Example: cancel previous search requests in input
let searchController;
async function search(query) {
  if (searchController) searchController.abort();
  searchController = new AbortController();
  try {
    const res = await api.get('/search', { params: { q: query }, signal: searchController.signal });
    return res.data;
  } catch (err) {
    if (err.code === 'ERR_CANCELED') return; // expected
    throw err;
  }
}

// -----------------------------------------------
// 28) WRAP-UP: when to use Axios
// -----------------------------------------------
// Use axios when you need:
// - Familiar, robust HTTP client with interceptors
// - Cancelation and upload progress in browsers
// - A simple way to manage auth header, refresh flows, and global config
// - Easy integration into existing codebases and Node environments

// If you want, next I can:
// - Generate a production-ready `apiClient.js` file (as shown) with comments.
// - Convert examples to TypeScript files with strong types and helper hooks (useApi/useAuth).
// - Create a runnable sample repo structure (Vite + React + Axios + React Query) with all configs and example pages.
// Tell me which follow-up you want and I’ll produce exact files in code format.
