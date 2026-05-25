// cart-page.js - отображение корзины
document.addEventListener('DOMContentLoaded', function() {
    renderCart();

    window.addEventListener('storage', function(e) {
        if (e.key && e.key.includes('cart_')) {
            renderCart();
        }
    });
});

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const itemsCountSpan = document.getElementById('itemsCount');
    const subtotalSpan = document.getElementById('subtotal');
    const totalSpan = document.getElementById('totalAmount');

    if (!container) return;

    const userId = getUserId();
    const saved = localStorage.getItem(`cart_${userId}`);
    const items = saved ? JSON.parse(saved) : [];

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (itemsCountSpan) itemsCountSpan.textContent = totalCount;
    if (subtotalSpan) subtotalSpan.textContent = subtotal.toLocaleString() + ' ₽';
    if (totalSpan) totalSpan.textContent = subtotal.toLocaleString() + ' ₽';

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛍️</div>
                <h3>Корзина пуста</h3>
                <p>Добавьте товары из каталога, и они появятся здесь</p>
                <a href="catalog.html" class="btn-catalog">Перейти в каталог</a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="cart-header">
            <span>Фото</span><span>Название</span><span>Цена</span><span>Количество</span><span>Сумма</span><span></span>
        </div>
        ${items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img class="cart-item-img" src="${item.image || '../image/placeholder.jpg'}" alt="${escapeHtml(item.name)}" onerror="this.src='../image/placeholder.jpg'">
                <div class="cart-item-title">${escapeHtml(item.name)}</div>
                <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn minus" data-id="${item.id}">-</button>
                    <input type="number" class="qty-input" data-id="${item.id}" value="${item.quantity}" min="1">
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">${(item.price * item.quantity).toLocaleString()} ₽</div>
                <button class="cart-item-remove" data-id="${item.id}">✕</button>
            </div>
        `).join('')}
    `;

    document.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(btn.dataset.id, -1));
    });

    document.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(btn.dataset.id, 1));
    });

    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', () => {
            let val = parseInt(input.value);
            if (isNaN(val) || val < 1) val = 1;
            updateQuantity(input.dataset.id, 0, val);
        });
    });

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => removeItem(btn.dataset.id));
    });
}

function getUserId() {
    const user = localStorage.getItem('techshop_current_user');
    if (user) {
        try {
            return JSON.parse(user).id;
        } catch(e) {
            return 'guest';
        }
    }
    return 'guest';
}

function updateQuantity(id, delta, newValue = null) {
    const userId = getUserId();
    const saved = localStorage.getItem(`cart_${userId}`);
    let items = saved ? JSON.parse(saved) : [];

    const index = items.findIndex(i => i.id == id);
    if (index !== -1) {
        if (newValue !== null) {
            items[index].quantity = newValue;
        } else {
            items[index].quantity += delta;
        }

        if (items[index].quantity <= 0) {
            items.splice(index, 1);
        }

        localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
        renderCart();
        updateGlobalCounter(items);
    }
}

function removeItem(id) {
    const userId = getUserId();
    const saved = localStorage.getItem(`cart_${userId}`);
    let items = saved ? JSON.parse(saved) : [];
    items = items.filter(i => i.id != id);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
    renderCart();
    updateGlobalCounter(items);
}

function updateGlobalCounter(items) {
    const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
    document.querySelectorAll('.cart-counter, #cart-count').forEach(el => {
        if (el) el.textContent = totalCount;
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}