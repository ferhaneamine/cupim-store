const API = 'http://localhost:5000/api';

/* ── Auth ── */
const Auth = {
  getToken: () => localStorage.getItem('cupim_token'),
  getUser:  () => JSON.parse(localStorage.getItem('cupim_user') || 'null'),
  isAdmin:  () => Auth.getUser()?.role === 'admin',
  isLoggedIn: () => !!Auth.getToken(),
  save: (data) => {
    localStorage.setItem('cupim_token', data.token);
    localStorage.setItem('cupim_user', JSON.stringify({ id: data.id, name: data.name, email: data.email, role: data.role }));
  },
  clear: () => {
    localStorage.removeItem('cupim_token');
    localStorage.removeItem('cupim_user');
  }
};

/* ── API Request ── */
async function request(method, path, body = null, auth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${Auth.getToken()}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

/* ── Cart ── */
const Cart = {
  get: () => JSON.parse(localStorage.getItem('cupim_cart') || '[]'),
  save: (items) => {
    localStorage.setItem('cupim_cart', JSON.stringify(items));
    Cart.updateBadge();
  },
  add: (product, size, qty = 1) => {
    const items = Cart.get();
    const key = `${product.id}-${size}`;
    const existing = items.find(i => i.key === key);
    if (existing) {
      existing.quantity += qty;
    } else {
      items.push({ key, product, size, quantity: qty });
    }
    Cart.save(items);
    showToast(`${product.title} ajouté au panier`);
  },
  remove: (key) => {
    Cart.save(Cart.get().filter(i => i.key !== key));
  },
  updateQty: (key, qty) => {
    const items = Cart.get();
    const item = items.find(i => i.key === key);
    if (item) item.quantity = qty;
    Cart.save(items);
  },
  total: () => Cart.get().reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  count: () => Cart.get().reduce((sum, i) => sum + i.quantity, 0),
  clear: () => { localStorage.removeItem('cupim_cart'); Cart.updateBadge(); },
  updateBadge: () => {
    const el = document.getElementById('cart-count');
    if (el) {
      const n = Cart.count();
      el.textContent = n;
      el.style.display = n > 0 ? 'flex' : 'none';
    }
  }
};

/* ── Toast ── */
function showToast(msg, duration = 3000) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── Nav init ── */
function initNav() {
  Cart.updateBadge();

  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(l => {
    if (l.getAttribute('href') === page) l.classList.add('active');
  });
}

/* ── Currency ── */
function formatPrice(n) {
  return Number(n).toLocaleString('fr-DZ') + ' DA';
}

/* ── Placeholder product image ── */
function productPlaceholder() {
  return `<div class="product-card-placeholder"><i class="ti ti-diamond" aria-hidden="true"></i></div>`;
}

document.addEventListener('DOMContentLoaded', initNav);
