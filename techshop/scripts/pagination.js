// pagination.js - пагинация для каталога товаров

let currentPage = 1;
const itemsPerPage = 12;
let allFilteredProducts = [];

function updatePagination() {
    const totalPages = Math.ceil(allFilteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = allFilteredProducts.slice(startIndex, endIndex);

    // Отображаем товары на текущей странице
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid && typeof renderProducts === 'function') {
        renderProducts(pageProducts, productsGrid);
    } else if (productsGrid && typeof window.renderProducts === 'function') {
        window.renderProducts(pageProducts, productsGrid);
    }

    // Обновляем кнопки пагинации
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageLinks = document.querySelectorAll('.page-link[data-page]');

    pageLinks.forEach(link => {
        const page = parseInt(link.dataset.page);
        if (page <= totalPages) {
            link.style.display = 'inline-block';
            if (page === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        } else {
            link.style.display = 'none';
        }
    });

    if (prevPage) {
        if (currentPage <= 1) {
            prevPage.classList.add('disabled');
        } else {
            prevPage.classList.remove('disabled');
        }
    }

    if (nextPage) {
        if (currentPage >= totalPages) {
            nextPage.classList.add('disabled');
        } else {
            nextPage.classList.remove('disabled');
        }
    }
}

// Функция для обновления отфильтрованных товаров (вызывается после фильтрации)
function updateFilteredProducts(filteredProducts) {
    allFilteredProducts = filteredProducts;
    currentPage = 1;
    updatePagination();
}

// Переопределяем функцию фильтрации с пагинацией
function overrideFilterWithPagination() {
    if (typeof window.applyFiltersAndRender !== 'undefined') {
        const originalApplyFiltersAndRender = window.applyFiltersAndRender;

        window.applyFiltersAndRender = function() {
            // Получаем отфильтрованные товары
            const productsGrid = document.getElementById('productsGrid');
            if (!productsGrid) return;

            const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
            const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);
            const brandCheckboxes = document.querySelectorAll('input[name="brand"]:checked');
            const selectedBrands = Array.from(brandCheckboxes).map(cb => cb.value);
            const priceRange = document.getElementById('priceRange');
            const maxPrice = priceRange ? parseInt(priceRange.value) : 300000;
            const sortSelect = document.getElementById('sortSelect');
            const sortBy = sortSelect ? sortSelect.value : 'popular';

            let filtered = [...allProductsData];

            if (selectedCategories.length > 0) {
                filtered = filtered.filter(product => selectedCategories.includes(product.category));
            }
            if (selectedBrands.length > 0) {
                filtered = filtered.filter(product => selectedBrands.includes(product.brand));
            }
            filtered = filtered.filter(product => product.price <= maxPrice);

            if (sortBy === 'price-asc') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (sortBy === 'price-desc') {
                filtered.sort((a, b) => b.price - a.price);
            }

            // Обновляем пагинацию с отфильтрованными товарами
            allFilteredProducts = filtered;
            currentPage = 1;
            updatePagination();

            const count = filtered.length;
            if (count === 0 && typeof showNotification === 'function') {
                showNotification('Товаров не найдено', 'warning');
            } else if (count > 0 && typeof showNotification === 'function') {
                showNotification(`Найдено ${count} товаров`, 'success');
            }
        };
    }
}

// Инициализация пагинации
function initPagination() {
    if (typeof allProductsData !== 'undefined' && allProductsData.length > 0) {
        // Сохраняем все товары как изначальные
        allFilteredProducts = [...allProductsData];
        currentPage = 1;
        updatePagination();

        // Переопределяем фильтрацию
        overrideFilterWithPagination();
    }

    // Назначаем обработчики событий для кнопок пагинации
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageLinks = document.querySelectorAll('.page-link[data-page]');

    pageLinks.forEach(link => {
        // Удаляем старые обработчики
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        newLink.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage = parseInt(this.dataset.page);
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    if (prevPage) {
        const newPrevPage = prevPage.cloneNode(true);
        prevPage.parentNode.replaceChild(newPrevPage, prevPage);

        newPrevPage.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    if (nextPage) {
        const newNextPage = nextPage.cloneNode(true);
        nextPage.parentNode.replaceChild(newNextPage, nextPage);

        newNextPage.addEventListener('click', function(e) {
            e.preventDefault();
            const totalPages = Math.ceil(allFilteredProducts.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
}

// Запускаем инициализацию после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    // Ждём загрузки товаров из catalog-products.js
    setTimeout(function() {
        if (typeof allProductsData !== 'undefined' && allProductsData.length > 0) {
            initPagination();
        } else {
            // Если товары ещё не загружены, ждём ещё
            const checkInterval = setInterval(function() {
                if (typeof allProductsData !== 'undefined' && allProductsData.length > 0) {
                    clearInterval(checkInterval);
                    initPagination();
                }
            }, 100);
        }
    }, 200);
});

// Экспортируем функции для использования в других скриптах
window.updateFilteredProducts = updateFilteredProducts;
window.paginationCurrentPage = function() { return currentPage; };
window.paginationTotalPages = function() { return Math.ceil(allFilteredProducts.length / itemsPerPage); };