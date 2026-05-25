// cart-bonus.js - бонусная система на странице корзины
let currentUserBonus = 0;
let currentSubtotal = 0;
let currentBonusToUse = 0;
let maxBonusPossible = 0;

function updateHeaderUser() {
    const userData = localStorage.getItem('techshop_current_user');
    const userNameSpan = document.getElementById('userNameShort');
    const headerAvatar = document.getElementById('headerAvatar');
    if (userData && userNameSpan) {
        const user = JSON.parse(userData);
        userNameSpan.textContent = user.name || user.email.split('@')[0];
        const savedAvatar = localStorage.getItem(`user_avatar_${user.id}`);
        if (savedAvatar && headerAvatar) headerAvatar.src = savedAvatar;
    } else if (userNameSpan) {
        userNameSpan.textContent = 'Войти';
        if (headerAvatar) {
            headerAvatar.src = '../image/avatars/avatar1.jpg';
        }
    }
}

function loadUserBonus() {
    const userData = localStorage.getItem('techshop_current_user');
    if (userData) {
        const user = JSON.parse(userData);
        currentUserBonus = user.bonus || 0;
        const userBonusSpan = document.getElementById('userBonusAmount');
        if (userBonusSpan) {
            userBonusSpan.innerHTML = currentUserBonus.toLocaleString() + ' ₽';
        }
        const bonusSection = document.getElementById('bonusSection');
        if (bonusSection) bonusSection.style.display = 'block';
        const bonusInput = document.getElementById('bonusToUse');
        if (bonusInput) bonusInput.max = maxBonusPossible;
    } else {
        const bonusSection = document.getElementById('bonusSection');
        if (bonusSection) bonusSection.style.display = 'none';
    }
}

function updateMaxBonus(subtotal) {
    currentSubtotal = subtotal;
    maxBonusPossible = Math.floor(subtotal * 0.3);
    const maxBonusDisplay = Math.min(maxBonusPossible, currentUserBonus);
    const bonusInput = document.getElementById('bonusToUse');
    if (bonusInput) {
        bonusInput.max = maxBonusDisplay;
        let currentVal = parseInt(bonusInput.value) || 0;
        if (currentVal > maxBonusDisplay) {
            bonusInput.value = maxBonusDisplay;
            currentBonusToUse = maxBonusDisplay;
        }
    }
    const hintSpan = document.querySelector('.bonus-hint span');
    if (hintSpan) {
        hintSpan.innerHTML = `💡 1 бонус = 1 ₽. Можно использовать до ${maxBonusDisplay} ₽ (30% от суммы)`;
    }
}

function initBonusListener() {
    const bonusInput = document.getElementById('bonusToUse');
    if (!bonusInput) return;

    bonusInput.addEventListener('input', function() {
        let value = parseInt(this.value) || 0;
        const maxVal = parseInt(this.max) || 0;
        if (value > maxVal) {
            value = maxVal;
            this.value = value;
        }
        if (value < 0) {
            value = 0;
            this.value = 0;
        }
        currentBonusToUse = value;
        updateTotalWithBonus();
    });
}

function updateTotalWithBonus() {
    const totalAmountSpan = document.getElementById('totalAmount');
    if (totalAmountSpan) {
        const finalTotal = currentSubtotal - currentBonusToUse;
        totalAmountSpan.textContent = finalTotal.toLocaleString() + ' ₽';
    }
}

function checkout() {
    if (typeof cart === 'undefined') {
        alert('Ошибка: корзина не загружена');
        return false;
    }

    const items = cart.getItems();
    if (items.length === 0) {
        alert('Корзина пуста');
        return false;
    }

    const userData = localStorage.getItem('techshop_current_user');
    let currentUser = userData ? JSON.parse(userData) : null;

    if (!currentUser) {
        if (confirm('Для оформления заказа нужно войти. Перейти на страницу входа?')) {
            window.location.href = 'login.html';
        }
        return false;
    }

    const total = cart.getTotal();
    const bonusToUse = currentBonusToUse;

    if (bonusToUse > currentUser.bonus) {
        alert('Недостаточно бонусов!');
        return false;
    }

    if (bonusToUse > total * 0.3) {
        alert(`Можно использовать не более ${Math.floor(total * 0.3)} бонусов!`);
        return false;
    }

    // Списываем бонусы
    if (bonusToUse > 0) {
        currentUser.bonus -= bonusToUse;
        localStorage.setItem('techshop_current_user', JSON.stringify(currentUser));

        let users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].bonus = currentUser.bonus;
            localStorage.setItem('techshop_users', JSON.stringify(users));
        }
    }

    // Начисляем бонусы (5% от суммы заказа)
    const bonusEarned = Math.floor(total * 0.05);

    // Создаём заказ
    const orderData = {
        items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: total - bonusToUse,
        bonusUsed: bonusToUse,
        bonusEarned: bonusEarned,
        status: 'new',
        date: new Date().toLocaleString(),
        id: Date.now()
    };

    // Сохраняем заказ
    const orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`) || '[]');
    orders.unshift(orderData);
    localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(orders));

    // Начисляем бонусы
    if (bonusEarned > 0) {
        currentUser.bonus = (currentUser.bonus || 0) + bonusEarned;
        localStorage.setItem('techshop_current_user', JSON.stringify(currentUser));

        let users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].bonus = currentUser.bonus;
            localStorage.setItem('techshop_users', JSON.stringify(users));
        }

        const history = JSON.parse(localStorage.getItem(`bonus_history_${currentUser.id}`) || '[]');
        history.unshift({
            amount: bonusEarned,
            description: `За заказ №${orderData.id}`,
            date: new Date().toLocaleString()
        });
        localStorage.setItem(`bonus_history_${currentUser.id}`, JSON.stringify(history));
    }

    cart.clearCart();
    alert(`✅ Заказ оформлен!\n\n💎 Списано бонусов: ${bonusToUse} ₽\n🎁 Начислено бонусов: ${bonusEarned} ₽`);
    window.location.href = 'profile.html';
    return true;
}

// Переопределяем renderCart для добавления бонусной логики
const originalRenderCart = window.renderCart;
if (typeof originalRenderCart === 'function') {
    window.renderCart = function() {
        originalRenderCart();
        setTimeout(() => {
            const subtotalSpan = document.getElementById('subtotal');
            if (subtotalSpan) {
                const subtotal = parseFloat(subtotalSpan.textContent.replace(/[^0-9]/g, '')) || 0;
                loadUserBonus();
                updateMaxBonus(subtotal);
                updateTotalWithBonus();
            }
        }, 50);
    };
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    updateHeaderUser();
    initBonusListener();

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    if (typeof renderCart === 'function') {
        renderCart();
    }
});

// Слушаем изменения в localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'techshop_current_user') {
        updateHeaderUser();
        loadUserBonus();
        const subtotalSpan = document.getElementById('subtotal');
        if (subtotalSpan) {
            const subtotal = parseFloat(subtotalSpan.textContent.replace(/[^0-9]/g, '')) || 0;
            updateMaxBonus(subtotal);
            updateTotalWithBonus();
        }
    }
});