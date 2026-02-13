const API_BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const auth = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),
};

export const products = {
  list: (params) => {
    const q = new URLSearchParams(params).toString();
    return request(`/products${q ? `?${q}` : ""}`);
  },
  get: (id) => request(`/products/${id}`),
  create: (body) => request("/products", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id) => request(`/products/${id}`, { method: "DELETE" }),
};

export const booking = {
  estimate: (body) => request("/booking/estimate", { method: "POST", body: JSON.stringify(body) }),
  create: (body) => request("/booking", { method: "POST", body: JSON.stringify(body) }),
  my: () => request("/booking/my"),
  adminList: (params) => {
    const q = new URLSearchParams(params).toString();
    return request(`/booking/admin${q ? `?${q}` : ""}`);
  },
  adminGet: (id) => request(`/booking/admin/${id}`),
  adminUpdate: (id, body) => request(`/booking/admin/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
};

export const orders = {
  create: (body) => request("/orders", { method: "POST", body: JSON.stringify(body) }),
  my: () => request("/orders/my"),
  adminList: () => request("/orders/admin"),
};

export const upload = {
  image: (image) => request("/upload/image", { method: "POST", body: JSON.stringify({ image }) }),
  video: (video) => request("/upload/video", { method: "POST", body: JSON.stringify({ video }) }),
};

export const admin = {
  overview: () => request("/admin/overview"),
};
