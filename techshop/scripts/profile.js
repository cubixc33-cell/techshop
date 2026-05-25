// profile.js - личный кабинет, избранное, заказы, бонусы, город, аватарки

let currentUser = null;
let selectedAvatar = null;

const AVATARS = [
    '../image/avatars/avatar1.jpg',
    '../image/avatars/avatar2.jpg',
    '../image/avatars/avatar3.jpg',
    '../image/avatars/avatar4.jpg',
    '../image/avatars/avatar5.jpg',
    '../image/avatars/avatar6.jpg',
    '../image/avatars/avatar7.jpg',
    '../image/avatars/avatar8.jpg'
];

document.addEventListener('DOMContentLoaded', function() {
    loadCurrentUser();
    initTabs();
    initCitySelector();
    initAvatar();
    initWishlistButtons();
    updateUI();

    if (currentUser) {
        renderWishlist();
        renderOrders();
        renderBonus();
    }
});

function loadCurrentUser() {
    const savedUser = localStorage.getItem('techshop_current_user');
    currentUser = savedUser ? JSON.parse(savedUser) : null;
}

function updateUI() {
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.textContent = currentUser ? (currentUser.name || currentUser.email.split('@')[0]) : 'Гость';
    }

    const bonusAmount = document.getElementById('bonusAmount');
    if (bonusAmount) {
        bonusAmount.textContent = currentUser ? (currentUser.bonus || 0) : 0;
    }

    const authMenuGuest = document.getElementById('authMenuGuest');
    const authMenuUser = document.getElementById('authMenuUser');
    if (authMenuGuest) authMenuGuest.style.display = currentUser ? 'none' : 'block';
    if (authMenuUser) authMenuUser.style.display = currentUser ? 'block' : 'none';

    updateAvatarDisplay();
}

// ========== АВАТАРКИ ==========
function updateAvatarDisplay() {
    const currentAvatarImg = document.getElementById('currentAvatar');
    if (!currentAvatarImg) return;
    const userId = currentUser?.id || 'guest';
    const savedAvatar = localStorage.getItem(`user_avatar_${userId}`);
    currentAvatarImg.src = savedAvatar || AVATARS[0];
}

function initAvatar() {
    const changeBtn = document.getElementById('changeAvatarBtn');
    const avatarModal = document.getElementById('avatarModal');
    const saveBtn = document.getElementById('saveAvatarBtn');
    const cancelBtn = document.getElementById('cancelAvatarBtn');

    if (!changeBtn) return;

    changeBtn.addEventListener('click', () => {
        renderAvatarGrid();
        avatarModal.classList.add('active');
    });

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            avatarModal.classList.remove('active');
            selectedAvatar = null;
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (selectedAvatar && currentUser) {
                document.getElementById('currentAvatar').src = selectedAvatar;
                localStorage.setItem(`user_avatar_${currentUser.id}`, selectedAvatar);
                avatarModal.classList.remove('active');
                showNotification('Аватар изменён!');
            } else if (!currentUser) {
                showNotification('Войдите в аккаунт, чтобы сменить аватар', 'error');
                avatarModal.classList.remove('active');
            }
        });
    }

    avatarModal.addEventListener('click', (e) => {
        if (e.target === avatarModal) avatarModal.classList.remove('active');
    });
}

function renderAvatarGrid() {
    const avatarGrid = document.getElementById('avatarGrid');
    if (!avatarGrid) return;
    const currentAvatar = document.getElementById('currentAvatar')?.src || AVATARS[0];

    avatarGrid.innerHTML = AVATARS.map((avatar, index) => `
        <div class="avatar-option ${currentAvatar.includes(avatar) ? 'selected' : ''}" data-avatar="${avatar}">
            <img src="${avatar}" alt="Аватар ${index + 1}" onerror="this.src='../image/avatars/avatar1.jpg'">
        </div>
    `).join('');

    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            const img = this.querySelector('img');
            if (img) selectedAvatar = img.src;
        });
    });
}

// ========== ВКЛАДКИ ==========
function initTabs() {
    const tabs = document.querySelectorAll('.profile-menu a');
    const tabContents = document.querySelectorAll('.profile-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            const activeContent = document.getElementById(tabId + 'Tab');
            if (activeContent) activeContent.classList.add('active');

            if (tabId === 'wishlist' && currentUser) renderWishlist();
            if (tabId === 'orders' && currentUser) renderOrders();
            if (tabId === 'bonus' && currentUser) renderBonus();
            if (tabId === 'city') loadSelectedCity();
        });
    });

    if (currentUser) {
        const wishlistTab = document.querySelector('.profile-menu a[data-tab="wishlist"]');
        if (wishlistTab) wishlistTab.click();
    } else {
        const loginTab = document.querySelector('.profile-menu a[data-tab="login"]');
        if (loginTab) loginTab.click();
    }
}

// ========== ВХОД / РЕГИСТРАЦИЯ ==========
document.getElementById('profileLoginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('profileEmail').value;
    const password = document.getElementById('profilePassword').value;
    const users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('techshop_current_user', JSON.stringify(user));
        updateUI();
        showMessage('authMessage', '✅ Вход выполнен успешно!', 'success');
        setTimeout(() => location.reload(), 1000);
    } else {
        showMessage('authMessage', '❌ Неверный email или пароль', 'error');
    }
});

document.getElementById('profileRegisterForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirmPassword').value;

    if (password !== confirm) {
        showMessage('authMessage', '❌ Пароли не совпадают', 'error');
        return;
    }
    if (password.length < 6) {
        showMessage('authMessage', '❌ Пароль должен быть не менее 6 символов', 'error');
        return;
    }

    let users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
    if (users.find(u => u.email === email)) {
        showMessage('authMessage', '❌ Пользователь с таким email уже существует', 'error');
        return;
    }

    const newUser = {
        id: Date.now(), name, email, password, role: 'user', bonus: 500, createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('techshop_users', JSON.stringify(users));
    currentUser = newUser;
    localStorage.setItem('techshop_current_user', JSON.stringify(newUser));
    updateUI();
    showMessage('authMessage', '✅ Регистрация успешна! Вам начислено 500 бонусов!', 'success');
    setTimeout(() => location.reload(), 1000);
});

document.getElementById('logoutProfileBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('techshop_current_user');
    currentUser = null;
    updateUI();
    showMessage('authMessage', 'Вы вышли из аккаунта', 'success');
    setTimeout(() => location.reload(), 1000);
});

// ========== ИЗБРАННОЕ ==========
function renderWishlist() {
    const container = document.getElementById('wishlistContainer');
    if (!container || !currentUser) return;
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`) || '[]');

    if (wishlist.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px;"><span style="font-size:48px;">❤️</span><p style="margin-top:15px; color:#7f8c8d;">У вас пока нет избранных товаров.</p><a href="catalog.html" class="btn-primary" style="display:inline-block; margin-top:15px;">Перейти в каталог</a></div>';
        return;
    }

    container.innerHTML = wishlist.map(item => `
        <div class="wishlist-item" data-id="${item.id}">
            <button class="remove-wishlist" data-id="${item.id}">✕</button>
            <img src="${item.image || '../image/placeholder.jpg'}" alt="${escapeHtml(item.name)}">
            <h4>${escapeHtml(item.name)}</h4>
            <div class="price">${item.price.toLocaleString()} ₽</div>
            <button class="btn add-to-cart-wishlist" data-id="${item.id}" data-name="${escapeHtml(item.name)}" data-price="${item.price}" data-image="${item.image}">В корзину</button>
        </div>
    `).join('');

    document.querySelectorAll('.remove-wishlist').forEach(btn => {
        btn.addEventListener('click', () => removeFromWishlist(btn.dataset.id));
    });
    document.querySelectorAll('.add-to-cart-wishlist').forEach(btn => {
        btn.addEventListener('click', function() {
            if (typeof cart !== 'undefined') {
                cart.addItem(this.dataset.id, this.dataset.name, parseFloat(this.dataset.price), this.dataset.image);
                showNotification('✓ Товар добавлен в корзину');
            }
        });
    });
}

function removeFromWishlist(id) {
    if (!currentUser) return;
    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`) || '[]');
    wishlist = wishlist.filter(item => item.id != id);
    localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(wishlist));
    renderWishlist();
    showNotification('Товар удалён из избранного');
}

// Кнопки "В избранное" на страницах
function initWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('.btn-wishlist');
    wishlistButtons.forEach(btn => {
        btn.removeEventListener('click', handleWishlistClick);
        btn.addEventListener('click', handleWishlistClick);

        if (currentUser) {
            const wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`) || '[]');
            if (wishlist.find(item => item.id == btn.dataset.id)) {
                btn.classList.add('active');
                btn.innerHTML = '❤️ В избранном';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '🤍 В избранное';
            }
        }
    });
}

function handleWishlistClick(e) {
    const btn = e.currentTarget;
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const image = btn.dataset.image;

    if (!currentUser) {
        if (confirm('Для добавления в избранное нужно войти. Перейти на страницу входа?')) {
            window.location.href = 'login.html';
        }
        return;
    }

    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`) || '[]');
    const exists = wishlist.find(item => item.id == id);

    if (exists) {
        wishlist = wishlist.filter(item => item.id != id);
        localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(wishlist));
        btn.classList.remove('active');
        btn.innerHTML = '🤍 В избранное';
        showNotification('Товар удалён из избранного');
    } else {
        wishlist.push({ id, name, price, image });
        localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(wishlist));
        btn.classList.add('active');
        btn.innerHTML = '❤️ В избранном';
        showNotification('✓ Товар добавлен в избранное');
    }
}

// ========== ИСТОРИЯ ЗАКАЗОВ ==========
function renderOrders() {
    const container = document.getElementById('ordersContainer');
    if (!container || !currentUser) return;
    const orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`) || '[]');

    if (orders.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px;"><span style="font-size:48px;">📦</span><p style="margin-top:15px; color:#7f8c8d;">У вас пока нет заказов.</p><a href="catalog.html" class="btn-primary" style="display:inline-block; margin-top:15px;">Перейти в каталог</a></div>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-number">Заказ №${order.id}</span>
                <span class="order-date">${order.date}</span>
                <span class="order-status status-${order.status}">${order.status === 'new' ? '🆕 Новый' : order.status === 'processing' ? '⏳ В обработке' : '✅ Доставлен'}</span>
            </div>
            <div class="order-items">${order.items.map(item => `${escapeHtml(item.name)} × ${item.quantity} — ${(item.price * item.quantity).toLocaleString()} ₽`).join('<br>')}</div>
            <div class="order-total">Итого: ${order.total.toLocaleString()} ₽</div>
            ${order.bonusUsed ? `<div style="font-size:12px; color:#7f8c8d;">💎 Использовано бонусов: ${order.bonusUsed} ₽</div>` : ''}
            ${order.bonusEarned ? `<div style="font-size:12px; color:#27ae60;">✨ Начислено бонусов: ${order.bonusEarned} ₽</div>` : ''}
        </div>
    `).join('');
}

// ========== БОНУСЫ ==========
function renderBonus() {
    const bonusDisplay = document.getElementById('bonusDisplay');
    const bonusHistory = document.getElementById('bonusHistory');
    if (!currentUser) return;
    if (bonusDisplay) bonusDisplay.textContent = currentUser.bonus || 0;

    if (bonusHistory) {
        const history = JSON.parse(localStorage.getItem(`bonus_history_${currentUser.id}`) || '[]');
        bonusHistory.innerHTML = history.length === 0 ? '<div style="text-align:center; padding:20px; color:#7f8c8d;">Нет операций</div>' :
            history.map(item => `<div class="bonus-item"><span>${escapeHtml(item.description)}</span><span class="${item.amount > 0 ? 'plus' : 'minus'}">${item.amount > 0 ? '+' : ''}${item.amount} ₽</span><span style="font-size:12px; color:#7f8c8d;">${item.date}</span></div>`).join('');
    }
}

// ========== ВЫБОР ГОРОДА ==========
function initCitySelector() {
    const savedCity = localStorage.getItem('selectedCity') || 'Москва';
    document.querySelectorAll('.city-item').forEach(item => {
        if (item.dataset.city === savedCity) item.classList.add('active');
        item.addEventListener('click', function() {
            localStorage.setItem('selectedCity', this.dataset.city);
            document.querySelectorAll('.city-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            showNotification(`Город изменён на ${this.dataset.city}`);
        });
    });
}

function loadSelectedCity() {
    const savedCity = localStorage.getItem('selectedCity') || 'Москва';
    document.querySelectorAll('.city-item').forEach(item => {
        if (item.dataset.city === savedCity) item.classList.add('active');
        else item.classList.remove('active');
    });
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ==========
function showMessage(elementId, message, type) {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerHTML = `<div style="padding:12px; border-radius:10px; background:${type === 'success' ? '#d4edda' : '#fee'}; color:${type === 'success' ? '#155724' : '#c00'};">${message}</div>`;
        setTimeout(() => el.innerHTML = '', 3000);
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `position:fixed; bottom:20px; right:20px; background:${type === 'success' ? '#27ae60' : '#e74c3c'}; color:white; padding:12px 24px; border-radius:10px; z-index:1000; animation:slideInRight 0.3s ease;`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
}

window.addToWishlist = function(id, name, price, image) {
    if (!currentUser) {
        if (confirm('Для добавления в избранное нужно войти. Перейти на страницу входа?')) window.location.href = 'login.html';
        return;
    }
    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`) || '[]');
    if (!wishlist.find(item => item.id == id)) {
        wishlist.push({ id, name, price, image });
        localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(wishlist));
        showNotification('✓ Товар добавлен в избранное');
    }
};// Инициализация кнопок избранного после загрузки
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initWishlistButtons();
    }, 100);
});

// Также инициализируем после применения фильтров (для catalog.html)
if (typeof applyFilters === 'function') {
    const originalApplyFilters = applyFilters;
    window.applyFilters = function() {
        originalApplyFilters();
        setTimeout(() => initWishlistButtons(), 100);
    };
}