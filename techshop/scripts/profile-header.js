// profile-header.js - обновление шапки на странице профиля
function updateHeader() {
    const userData = localStorage.getItem('techshop_current_user');
    const userNameSpan = document.getElementById('userNameShort');
    const headerAvatar = document.getElementById('headerAvatar');

    if (userData) {
        const user = JSON.parse(userData);
        if (userNameSpan) {
            userNameSpan.textContent = user.name || user.email.split('@')[0];
        }
        const savedAvatar = localStorage.getItem(`user_avatar_${user.id}`);
        if (savedAvatar && headerAvatar) {
            headerAvatar.src = savedAvatar;
        }
    } else if (userNameSpan) {
        userNameSpan.textContent = 'Войти';
        if (headerAvatar) {
            headerAvatar.src = '../image/avatars/avatar1.jpg';
        }
    }
}

// Запускаем при загрузке
updateHeader();

// Слушаем изменения в localStorage (если пользователь вошёл/вышел в другой вкладке)
window.addEventListener('storage', function(e) {
    if (e.key === 'techshop_current_user' || (e.key && e.key.startsWith('user_avatar_'))) {
        updateHeader();
    }
});