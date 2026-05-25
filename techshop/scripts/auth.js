// auth.js - полностью рабочая версия с localStorage и ролью admin
class Auth {
    constructor() {
        this.currentUser = null;
        this.loadUser();
        this.updateUI();
        this.initLogoutButton();
        this.createAdminIfNotExists();
    }

    loadUser() {
        const saved = localStorage.getItem('techshop_current_user');
        this.currentUser = saved ? JSON.parse(saved) : null;
    }

    saveUser() {
        if (this.currentUser) {
            localStorage.setItem('techshop_current_user', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('techshop_current_user');
        }
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    getCurrentUser() {
        return this.currentUser;
    }

    createAdminIfNotExists() {
        let users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
        const adminExists = users.find(u => u.role === 'admin');

        if (!adminExists) {
            const adminUser = {
                id: 1,
                name: 'Администратор',
                email: 'admin@techshop.ru',
                password: 'admin123',
                role: 'admin',
                bonus: 0,
                createdAt: new Date().toISOString()
            };
            users.push(adminUser);
            localStorage.setItem('techshop_users', JSON.stringify(users));
            console.log('Администратор создан: admin@techshop.ru / admin123');
        }
    }

    register(userData) {
        let users = JSON.parse(localStorage.getItem('techshop_users') || '[]');

        if (users.find(u => u.email === userData.email)) {
            return { success: false, error: 'Пользователь с таким email уже существует' };
        }

        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: 'user',
            bonus: 500,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('techshop_users', JSON.stringify(users));

        this.currentUser = newUser;
        this.saveUser();
        this.updateUI();

        return { success: true, user: newUser };
    }

    login(credentials) {
        const users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);

        if (!user) {
            return { success: false, error: 'Неверный email или пароль' };
        }

        this.currentUser = user;
        this.saveUser();
        this.updateUI();

        return { success: true, user: user };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('techshop_current_user');
        this.updateUI();
        window.location.href = 'index.html';
    }

    updateUI() {
        document.querySelectorAll('.auth-user').forEach(el => {
            el.style.display = this.isAuthenticated() ? 'inline-block' : 'none';
        });

        document.querySelectorAll('.auth-guest').forEach(el => {
            el.style.display = this.isAuthenticated() ? 'none' : 'inline-block';
        });

        document.querySelectorAll('.user-name').forEach(el => {
            if (this.currentUser) {
                el.textContent = this.currentUser.name || this.currentUser.email.split('@')[0];
            }
        });

        document.querySelectorAll('.admin-link').forEach(el => {
            el.style.display = this.isAdmin() ? 'inline-block' : 'none';
        });
    }

    initLogoutButton() {
        const checkExist = setInterval(() => {
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                clearInterval(checkExist);
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        }, 100);
    }
}

const AuthUtils = {
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    validatePassword(password) {
        return password && password.length >= 6;
    },
    validateRegistrationForm(formData) {
        const errors = {};
        if (!formData.name || formData.name.trim().length < 2) {
            errors.name = 'Имя должно содержать минимум 2 символа';
        }
        if (!this.validateEmail(formData.email)) {
            errors.email = 'Введите корректный email';
        }
        if (!this.validatePassword(formData.password)) {
            errors.password = 'Пароль должен содержать минимум 6 символов';
        }
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Пароли не совпадают';
        }
        return { isValid: Object.keys(errors).length === 0, errors };
    },
    validateLoginForm(formData) {
        const errors = {};
        if (!this.validateEmail(formData.email)) {
            errors.email = 'Введите корректный email';
        }
        if (!formData.password) {
            errors.password = 'Введите пароль';
        }
        return { isValid: Object.keys(errors).length === 0, errors };
    },
    showError(element, message) {
        let errorDiv = element.parentElement.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = 'color: red; font-size: 12px; margin-top: 5px;';
            element.parentElement.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    },
    clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    }
};

const auth = new Auth();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Auth, AuthUtils };
}