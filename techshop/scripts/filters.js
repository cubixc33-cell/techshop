// filters.js - обработчики фильтров
document.addEventListener('DOMContentLoaded', function() {
    console.log('filters.js загружен');

    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const sortSelect = document.getElementById('sortSelect');
    const resetFiltersBtn = document.getElementById('resetFilters');

    // Обновление отображения цены при движении ползунка
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            const val = parseInt(this.value);
            priceValue.textContent = val.toLocaleString() + ' ₽';
        });
    }

    // Кнопка применения фильтров
    if (applyFiltersBtn) {
        // Убираем старые обработчики
        const newApplyBtn = applyFiltersBtn.cloneNode(true);
        applyFiltersBtn.parentNode.replaceChild(newApplyBtn, applyFiltersBtn);

        newApplyBtn.addEventListener('click', function() {
            console.log('Кнопка "Применить фильтры" нажата');
            if (typeof window.applyFiltersAndRender === 'function') {
                window.applyFiltersAndRender();
            } else {
                console.error('applyFiltersAndRender не найдена!');
                alert('Ошибка: функция фильтрации не загружена. Обновите страницу.');
            }
        });
    }

    // Кнопка сброса фильтров
    if (resetFiltersBtn) {
        // Убираем старые обработчики
        const newResetBtn = resetFiltersBtn.cloneNode(true);
        resetFiltersBtn.parentNode.replaceChild(newResetBtn, resetFiltersBtn);

        newResetBtn.addEventListener('click', function() {
            console.log('Кнопка "Сбросить все" нажата');
            if (typeof window.resetAllFilters === 'function') {
                window.resetAllFilters();
            } else {
                console.error('resetAllFilters не найдена!');
                alert('Ошибка: функция сброса не загружена. Обновите страницу.');
            }
        });
    }

    // Сортировка
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            console.log('Сортировка изменена:', this.value);
            if (typeof window.applyFiltersAndRender === 'function') {
                window.applyFiltersAndRender();
            }
        });
    }

    // Добавляем стили для анимации
    if (!document.querySelector('#filterAnimStyle')) {
        const style = document.createElement('style');
        style.id = 'filterAnimStyle';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
});