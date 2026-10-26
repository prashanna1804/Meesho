const body = document.body;
const overlay = document.querySelector('.overlay');
const cartDrawer = document.querySelector('.cart-drawer');
const bagButton = document.querySelector('.bag-button');
const closeButton = document.querySelector('.close-button');
const addButtons = document.querySelectorAll('.add-button');
const hearts = document.querySelectorAll('.heart');
const searchInput = document.getElementById('searchInput');
const navLinks = document.querySelectorAll('.category-nav a, .filter-list a');
const productCards = document.querySelectorAll('.product-card');
const cartItemsContainer = document.querySelector('.cart-items');
const cartEmpty = document.querySelector('.cart-empty');
const cartFooter = document.querySelector('.cart-footer');
const cartCountLabel = document.querySelector('.cart-count');
const cartSubtotal = document.querySelector('.cart-subtotal');

const cart = [];

function formatCurrency(value) {
  return `₹${value}`;
}

function syncCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCountLabel.textContent = totalItems;
  cartSubtotal.textContent = formatCurrency(subtotal);
  document.querySelector('#cartCountLabel').innerHTML = `<span class="cart-count">${totalItems}</span> items`;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <div>♧</div>
        <h3>Your bag is empty</h3>
        <p>Add a few little joys to get started.</p>
      </div>
    `;
    cartFooter.style.display = 'none';
    return;
  }

  cartFooter.style.display = 'block';
  cartItemsContainer.innerHTML = cart.map((item) => `
    <div class="cart-item" data-name="${item.name}">
      <div class="cart-item-thumb" style="--shade: ${item.shade}; --accent: ${item.accent};"></div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="cart-item-meta">
          <span>${formatCurrency(item.price)}</span>
          <button class="remove-item" type="button" data-name="${item.name}">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', (event) => {
      const name = event.target.dataset.name;
      const index = cart.findIndex((item) => item.name === name);
      if (index !== -1) {
        cart.splice(index, 1);
        syncCartUI();
      }
    });
  });
}

function openCart() {
  cartDrawer.classList.add('open');
  overlay.classList.add('open');
  body.style.overflow = 'hidden';
}

function closeCart() {
  cartDrawer.classList.remove('open');
  overlay.classList.remove('open');
  body.style.overflow = '';
}

function getCardPalette(card) {
  const classes = [...card.querySelector('.product-image').classList];
  const paletteMap = {
    one: ['#f5c9b7', '#e88b9c'],
    two: ['#dbe6d5', '#d9b16a'],
    three: ['#c9d6d2', '#e5ad9f'],
    four: ['#f7e7b5', '#f0c95c'],
    five: ['#e5d6d2', '#91aab5'],
    six: ['#e6d2b4', '#cf8169'],
    seven: ['#e2e1d7', '#b9c0ad'],
    eight: ['#e8d3c6', '#d5a47f']
  };

  const match = classes.find((className) => paletteMap[className]);
  return paletteMap[match] || ['#f3efe9', '#f35d8e'];
}

bagButton.addEventListener('click', openCart);
closeButton.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

addButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const name = card.dataset.name;
    const price = Number(card.dataset.price);
    const [shade, accent] = getCardPalette(card);

    const existing = cart.find((item) => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1, shade, accent });
    }

    syncCartUI();
    openCart();

    button.textContent = 'Added';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = 'Add to bag';
      button.disabled = false;
    }, 800);
  });
});

hearts.forEach((heart) => {
  heart.addEventListener('click', () => {
    heart.classList.toggle('active');
    heart.textContent = heart.classList.contains('active') ? '♥' : '♡';
  });
});

searchInput.addEventListener('input', (event) => {
  const query = event.target.value.trim().toLowerCase();

  productCards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    const matches = !query || text.includes(query);
    card.classList.toggle('is-hidden', !matches);
  });
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const activeValue = link.textContent.trim();

    navLinks.forEach((item) => item.classList.toggle('active', item === link));

    if (activeValue === 'All') {
      productCards.forEach((card) => card.classList.remove('is-hidden'));
      return;
    }

    productCards.forEach((card) => {
      const matches = card.dataset.category === activeValue;
      card.classList.toggle('is-hidden', !matches);
    });
  });
});

syncCartUI();
