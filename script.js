// Basic cart handling with localStorage (monochrome UI)
const currency = (n) => '₩' + n.toLocaleString('ko-KR');

const els = {
  cartBtn: document.getElementById('cartBtn'),
  closeCart: document.getElementById('closeCart'),
  cartDrawer: document.getElementById('cartDrawer'),
  cartItems: document.getElementById('cartItems'),
  cartTotal: document.getElementById('cartTotal'),
  cartCount: document.getElementById('cartCount'),
  checkout: document.getElementById('checkout')
};

const loadCart = () => JSON.parse(localStorage.getItem('camp_cart') || '[]');
const saveCart = (data) => localStorage.setItem('camp_cart', JSON.stringify(data));

function renderCart() {
  const cart = loadCart();
  els.cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <h4>${item.name}</h4>
        <div class="meta">${currency(item.price)} × ${item.qty}</div>
        <div class="qty">
          <button aria-label="수량 감소" data-idx="${idx}" data-act="dec">－</button>
          <button aria-label="수량 증가" data-idx="${idx}" data-act="inc">＋</button>
          <button aria-label="삭제" data-idx="${idx}" data-act="del">삭제</button>
        </div>
      </div>
      <strong>${currency(item.price * item.qty)}</strong>
    `;
    els.cartItems.appendChild(row);
  });

  els.cartTotal.textContent = currency(total);
  els.cartCount.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function openCart(open = true) {
  els.cartDrawer.classList.toggle('open', open);
  els.cartDrawer.setAttribute('aria-hidden', (!open).toString());
  if (open) renderCart();
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.currentTarget.closest('.card');
    const name = card.dataset.name;
    const price = Number(card.dataset.price);
    const image = card.querySelector('img').getAttribute('src');
    const cart = loadCart();
    const at = cart.findIndex(x => x.name === name);
    if (at >= 0) cart[at].qty += 1;
    else cart.push({ name, price, image, qty: 1 });
    saveCart(cart);
    renderCart();
    openCart(true);
  });
});

els.cartItems.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const idx = Number(btn.dataset.idx);
  const act = btn.dataset.act;
  const cart = loadCart();
  if (act === 'inc') cart[idx].qty += 1;
  if (act === 'dec') cart[idx].qty = Math.max(1, cart[idx].qty - 1);
  if (act === 'del') cart.splice(idx, 1);
  saveCart(cart);
  renderCart();
});

els.cartBtn.addEventListener('click', () => openCart(true));
els.closeCart.addEventListener('click', () => openCart(false));
els.checkout.addEventListener('click', () => {
  alert('결제 데모: 실제 결제 연동 전입니다. 감사합니다!');
  saveCart([]);
  renderCart();
  openCart(false);
});

// Initialize
renderCart();