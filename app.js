// YOUR WHATSAPP NUMBER (India: 91 + number, no +). Set to your number:
const WHATSAPP_NUMBER = '919866406807';

const HOME_FOODS = [
  { id: 'rice', name: 'Sona Masoori Rice', pricePerKg: 320, desc: 'Aromatic everyday rice', image: 'images/rice.jpg' },
  { id: 'mixveg', name: 'Mixed Veg (home)', pricePerKg: 350, desc: 'Seasonal vegetables, home-style', image: 'images/mixveg.jpg' }
  ,{ id: 'sakinalu', name: 'Sakinalu', pricePerKg: 300, desc: 'Crispy sesame rice snack, traditional', image: 'images/sakinalu.jpg' }
  ,{ id: 'madugulu', name: 'Madugulu', pricePerKg: 300, desc: 'Steamed rice dumplings, soft and fluffy', image: 'images/madugulu.jpg' }
  ,{ id: 'laddus', name: 'Laddus', pricePerKg: 400, desc: 'Sweet gram flour laddus, handmade', image: 'images/laddus.jpg' }
];

const PICKLES = [
  { id: 'mango', name: 'Mango Pickle (veg)', price: 150, kind: 'veg', image: 'images/mango.jpg' },
  { id: 'lime', name: 'Lime Pickle (veg)', price: 120, kind: 'veg', image: 'images/lime.jpg' },
  { id: 'chicken', name: 'Chicken Pickle (non-veg)', price: 220, kind: 'non-veg', image: 'images/chicken.jpeg' }
];

let cart = [];

function $(sel){ return document.querySelector(sel); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

function createProductCard(item, type) {
  const wrapper = document.createElement('div');
  wrapper.className = 'card mb-2 shadow-sm';
  const body = document.createElement('div');
  body.className = 'card-body d-flex align-items-center justify-content-between';

  const left = document.createElement('div');
  left.className = 'd-flex align-items-center';
  const img = document.createElement('img');
  img.className = 'me-3 product-img';
  img.src = item.image || 'https://via.placeholder.com/160x100?text=Image';
  img.alt = item.name;
  const _fallbackSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#495057" font-size="14">Image</text></svg>';
  img.onerror = () => {
    try {
      // If the file was requested as .jpg, try the same name with .svg next
      if (img.src && img.src.match(/\.jpg(\?|$)/i)) {
        img.src = img.src.replace(/\.jpg(\?|$)/i, '.svg$1');
        return;
      }
    } catch (e) {}
    img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(_fallbackSVG);
    img.onerror = null;
  };
  const info = document.createElement('div');
  info.innerHTML = `<h6 class="mb-1">${item.name}</h6><div class="text-muted small">${item.desc || (item.kind || '')}</div>`;
  left.appendChild(img);
  left.appendChild(info);

  const right = document.createElement('div');
  const priceText = type === 'home' ? `₹${item.pricePerKg}/kg` : `₹${item.price} / jar`;
  right.innerHTML = `<div class="price mb-2">${priceText}</div>`;
  const controls = document.createElement('div');
  controls.className = 'd-flex align-items-center';
  const qty = document.createElement('input');
  qty.type = 'number';
  qty.min = 1;
  qty.value = 1;
  qty.className = 'form-control form-control-sm me-2 qty-input';
  const btn = document.createElement('button');
  btn.className = 'btn btn-danger btn-sm';
  btn.textContent = 'Add';
  btn.onclick = () => {
    const q = type === 'home' ? parseFloat(qty.value || 1) : parseInt(qty.value || 1);
    addToCart({ ...item }, type, q);
  };
  controls.appendChild(qty);
  controls.appendChild(btn);
  right.appendChild(controls);

  body.appendChild(left);
  body.appendChild(right);
  wrapper.appendChild(body);
  return wrapper;
}

function renderCatalog() {
  const hList = $('#homeFoodsList');
  hList.innerHTML = '';
  HOME_FOODS.forEach(i => hList.appendChild(createProductCard(i, 'home')));
  const pList = $('#picklesList');
  pList.innerHTML = '';
  PICKLES.forEach(i => pList.appendChild(createProductCard(i, 'pickle')));
}

function addToCart(item, type, qty) {
  if (type === 'home' && qty < 1) qty = 1;
  cart.push({
    id: item.id,
    name: item.name,
    type,
    qty,
    unit: type === 'home' ? 'kg' : 'jar',
    unitPrice: type === 'home' ? item.pricePerKg : item.price
  });
  renderCart();
}

function renderCart() {
  const area = $('#cartArea');
  if (cart.length === 0) {
    area.textContent = 'Cart is empty';
    $('#cartTotal').textContent = '₹0';
    $('#cartCount').textContent = '0';
    $('#sendWhatsApp').disabled = true;
    return;
  }
  area.innerHTML = '';
  let total = 0;
  cart.forEach((c, idx) => {
    const row = document.createElement('div');
    row.className = 'd-flex justify-content-between align-items-center mb-2';
    row.innerHTML = `<div><small class="text-muted">${c.unit.toUpperCase()}</small><div>${c.name} — ${c.qty} ${c.unit}</div></div>`;
    const right = document.createElement('div');
    right.innerHTML = `₹${(c.qty * c.unitPrice).toFixed(0)} <button class="btn btn-link btn-sm text-danger">Remove</button>`;
    right.querySelector('button').onclick = () => {
      cart.splice(idx, 1);
      renderCart();
    };
    row.appendChild(right);
    area.appendChild(row);
    total += c.qty * c.unitPrice;
  });
  $('#cartTotal').textContent = `₹${total.toFixed(0)}`;
  $('#cartCount').textContent = String(cart.length);
  $('#sendWhatsApp').disabled = false;
}

function buildOrderPayload(form) {
  const data = {
    customer: {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      payment: form.payment.value
    },
    items: cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, unit: i.unit, unitPrice: i.unitPrice, lineTotal: i.qty * i.unitPrice })),
    total: cart.reduce((s,i)=>s + i.qty * i.unitPrice, 0),
    createdAt: new Date().toISOString()
  };
  return data;
}

function buildWhatsAppText(payload) {
  const lines = [];
  lines.push(`New order from ${payload.customer.name || 'Customer'}`);
  if (payload.customer.phone) lines.push(`Phone: ${payload.customer.phone}`);
  if (payload.customer.address) lines.push(`Address: ${payload.customer.address}`);
  lines.push('');
  lines.push('Items:');
  payload.items.forEach(it => lines.push(`- ${it.name} — ${it.qty} ${it.unit} — ₹${it.lineTotal.toFixed(0)}`));
  lines.push('');
  lines.push(`Total: ₹${payload.total.toFixed(0)}`);
  lines.push(`Payment: ${payload.customer.payment || 'N/A'}`);
  return encodeURIComponent(lines.join('\n'));
}

function sendToWhatsApp(payload) {
  if (!WHATSAPP_NUMBER || WHATSAPP_NUMBER.length < 6) {
    alert('WhatsApp number not configured in app.js');
    return;
  }
  const text = buildWhatsAppText(payload);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  window.open(url, '_blank');
}

// `downloadJSON` removed — JSON download UI was removed.

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  renderCart();

  $('#sendWhatsApp').addEventListener('click', () => {
    const form = $('#orderForm');
    if (!form.name.value.trim() || !form.phone.value.trim() || !form.address.value.trim()) {
      alert('Please fill name, phone and address.');
      return;
    }
    if (cart.length === 0) { alert('Cart is empty'); return; }
    const payload = buildOrderPayload(form);
    sendToWhatsApp(payload);
  });

  // Download JSON button removed from UI.

  $('#openCartBtn').addEventListener('click', () => {
    window.scrollTo({ top: document.querySelector('main').offsetTop, behavior: 'smooth' });
  });

  $('#whatsappGuideBtn').addEventListener('click', () => {
    alert('WhatsApp will open in a new tab (WhatsApp Web) or the mobile app; you must press SEND to complete the message.');
  });
});