// cart.js - работа с корзиной
class Cart {
    constructor() {
        this.items = [];
        this.loadCart();
        this.initAddToCartButtons();
    }

    getUserId() {
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

    loadCart() {
        const key = `cart_${this.getUserId()}`;
        const saved = localStorage.getItem(key);
        this.items = saved ? JSON.parse(saved) : [];
        this.updateCounter();
        return this.items;
    }

    saveCart() {
        const key = `cart_${this.getUserId()}`;
        localStorage.setItem(key, JSON.stringify(this.items));
        this.updateCounter();
    }

    addItem(id, name, price, image = '') {
        const existing = this.items.find(item => item.id == id);

        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({
                id: id,
                name: name,
                price: parseFloat(price),
                image: image,
                quantity: 1
            });
        }

        this.saveCart();
        this.showNotification(`✓ ${name} добавлен в корзину`);
        return true;
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id != id);
        this.saveCart();
    }

    updateQuantity(id, quantity) {
        const item = this.items.find(item => item.id == id);
        if (item) {
            quantity = parseInt(quantity);
            if (quantity <= 0) {
                this.removeItem(id);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    getItems() {
        return this.items;
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getTotalCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
    }

    updateCounter() {
        const totalCount = this.getTotalCount();
        document.querySelectorAll('.cart-counter, #cart-count').forEach(el => {
            if (el) el.textContent = totalCount;
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            z-index: 9999;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    initAddToCartButtons() {
        const buttons = document.querySelectorAll('.add-to-cart');
        const self = this;

        buttons.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', function(e) {
                e.preventDefault();

                const product = this.closest('.product') || this.closest('.product-card');
                if (!product) {
                    console.error('Не найден родительский элемент');
                    return;
                }

                let id = product.dataset.productId;
                if (!id) {
                    id = 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
                    product.dataset.productId = id;
                }

                const titleEl = product.querySelector('h3');
                const name = titleEl ? titleEl.innerText : 'Товар';

                const priceEl = product.querySelector('.price');
                let price = 0;
                if (priceEl) {
                    const priceText = priceEl.innerText;
                    const priceMatch = priceText.match(/(\d[\d\s]*)/);
                    if (priceMatch) {
                        price = parseFloat(priceMatch[0].replace(/\s/g, ''));
                    }
                }

                const imgEl = product.querySelector('img');
                const image = imgEl ? imgEl.src : '';

                self.addItem(id, name, price, image);
            });
        });
    }

    // Оформление заказа с бонусами (для использования из админ-панели)
    checkoutWithBonus() {
        const items = this.getItems();
        if (items.length === 0) {
            alert('Корзина пуста');
            return false;
        }

        const total = this.getTotal();
        const maxBonusUse = Math.floor(total * 0.3);
        let bonusToUse = 0;

        const userData = localStorage.getItem('techshop_current_user');
        let currentUser = userData ? JSON.parse(userData) : null;

        if (!currentUser) {
            if (confirm('Для оформления заказа нужно войти. Перейти на страницу входа?')) {
                window.location.href = 'login.html';
            }
            return false;
        }

        // Предлагаем использовать бонусы
        if (currentUser.bonus && currentUser.bonus > 0) {
            const userBonus = currentUser.bonus || 0;
            bonusToUse = Math.min(userBonus, maxBonusUse);
            if (bonusToUse > 0) {
                const useBonus = confirm(`У вас есть ${userBonus} бонусов. Можно использовать до ${maxBonusUse} ₽. Использовать бонусы?`);
                if (useBonus) {
                    currentUser.bonus -= bonusToUse;
                    localStorage.setItem('techshop_current_user', JSON.stringify(currentUser));

                    let users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
                    const userIndex = users.findIndex(u => u.id === currentUser.id);
                    if (userIndex !== -1) {
                        users[userIndex].bonus = currentUser.bonus;
                        localStorage.setItem('techshop_users', JSON.stringify(users));
                    }

                    alert(`Списано ${bonusToUse} бонусов. Сумма к оплате: ${(total - bonusToUse).toLocaleString()} ₽`);
                }
            }
        }

        const bonusEarned = Math.floor(total * 0.05);

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

        const orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`) || '[]');
        orders.unshift(orderData);
        localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(orders));

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

        this.clearCart();
        alert(`✅ Заказ оформлен! Спасибо за покупку!\n\n🎁 Начислено бонусов: ${bonusEarned} ₽`);
        window.location.href = 'profile.html';
        return true;
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; visibility: hidden; }
    }
`;
document.head.appendChild(style);

const cart = new Cart();

document.addEventListener('DOMContentLoaded', () => {
    cart.initAddToCartButtons();
    window.addEventListener('storage', (e) => {
        if (e.key === 'techshop_current_user') {
            cart.loadCart();
            cart.initAddToCartButtons();
        }
    });
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Cart };
}