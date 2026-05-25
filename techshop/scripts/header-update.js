// header-update.js - обновление шапки на всех страницах

function updateHeader() {
    const userData = localStorage.getItem('techshop_current_user');
    const userNameSpan = document.getElementById('userNameShort');
    const headerAvatar = document.getElementById('headerAvatar');
    const adminLinks = document.querySelectorAll('.admin-link');
    const cartCountSpan = document.getElementById('cart-count');

    // Обновляем имя пользователя и аватар
    if (userData) {
        const user = JSON.parse(userData);

        // Обновляем имя
        if (userNameSpan) {
            userNameSpan.textContent = user.name || user.email.split('@')[0];
        }

        // Обновляем аватар
        const savedAvatar = localStorage.getItem(`user_avatar_${user.id}`);
        if (savedAvatar && headerAvatar) {
            headerAvatar.src = savedAvatar;
        } else if (headerAvatar) {
            headerAvatar.src = './image/avatars/avatar1.jpg';
        }

        // Показываем ссылку на админку только для администратора
        if (user.role === 'admin') {
            adminLinks.forEach(link => {
                if (link) link.style.display = 'inline-block';
            });
        } else {
            adminLinks.forEach(link => {
                if (link) link.style.display = 'none';
            });
        }
    } else {
        // Пользователь не авторизован
        if (userNameSpan) {
            userNameSpan.textContent = 'Войти';
        }
        if (headerAvatar) {
            headerAvatar.src = './image/avatars/avatar1.jpg';
        }
        adminLinks.forEach(link => {
            if (link) link.style.display = 'none';
        });
    }

    // Обновляем счётчик корзины
    updateCartCounter();
}

function updateCartCounter() {
    const cartCountSpan = document.getElementById('cart-count');
    if (!cartCountSpan) return;

    const userId = getUserIdForCart();
    const key = `cart_${userId}`;
    const saved = localStorage.getItem(key);
    const items = saved ? JSON.parse(saved) : [];
    const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

    cartCountSpan.textContent = totalCount;
}

function getUserIdForCart() {
    const userData = localStorage.getItem('techshop_current_user');
    if (userData) {
        try {
            return JSON.parse(userData).id;
        } catch(e) {
            return 'guest';
        }
    }
    return 'guest';
}

// Функция для обновления только имени пользователя (без перезагрузки всей страницы)
function updateUserName() {
    const userData = localStorage.getItem('techshop_current_user');
    const userNameSpan = document.getElementById('userNameShort');

    if (userData && userNameSpan) {
        const user = JSON.parse(userData);
        userNameSpan.textContent = user.name || user.email.split('@')[0];
    } else if (userNameSpan) {
        userNameSpan.textContent = 'Войти';
    }
}

// Функция для обновления только аватара
function updateUserAvatar() {
    const userData = localStorage.getItem('techshop_current_user');
    const headerAvatar = document.getElementById('headerAvatar');

    if (userData && headerAvatar) {
        const user = JSON.parse(userData);
        const savedAvatar = localStorage.getItem(`user_avatar_${user.id}`);
        if (savedAvatar) {
            headerAvatar.src = savedAvatar;
        }
    } else if (headerAvatar) {
        headerAvatar.src = './image/avatars/avatar1.jpg';
    }
}

// Функция для выхода из аккаунта
function logout() {
    localStorage.removeItem('techshop_current_user');
    updateHeader();
    window.location.href = 'index.html';
}

// Обработчик для кнопки выхода (если есть на странице)
function initLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        // Удаляем старые обработчики, чтобы не было дублирования
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);

        newLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Запускаем при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        updateHeader();
        initLogoutButton();
    });
} else {
    updateHeader();
    initLogoutButton();
}

// Слушаем изменения в localStorage (если пользователь вошёл/вышел в другой вкладке)
window.addEventListener('storage', function(e) {
    if (e.key === 'techshop_current_user') {
        updateHeader();
        initLogoutButton();
    } else if (e.key && e.key.startsWith('user_avatar_')) {
        updateUserAvatar();
    } else if (e.key && e.key.startsWith('cart_')) {
        updateCartCounter();
    }
});

// Также обновляем счётчик корзины при загрузке страницы и при изменении корзины
document.addEventListener('DOMContentLoaded', function() {
    updateCartCounter();

    // Слушаем событие обновления корзины из cart.js
    if (typeof window.cartUpdateEvent !== 'undefined') {
        window.addEventListener('cartUpdated', updateCartCounter);
    }
});

// Экспортируем функции для использования в других скриптах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateHeader,
        updateCartCounter,
        updateUserName,
        updateUserAvatar,
        logout,
        initLogoutButton
    };
}