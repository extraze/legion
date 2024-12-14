// Счетчики избранного/корзины/закладок

// Функция для обновления счётчика
// Функция для обновления счётчика
function toggleCounter(button, counterId) {
    const counterElement = document.getElementById(counterId);
    let currentCount = parseInt(counterElement.textContent, 10);

    // Проверяем состояние кнопки
    if (button.dataset.clicked === "true") {
        // Убираем из счётчика
        if (currentCount > 0) {
            currentCount -= 1;
            counterElement.textContent = currentCount;
        }

        // Возвращаем исходный цвет кнопки
        button.style.background = "#264065";
        button.dataset.clicked = "false";

        // Обновляем localStorage
        saveState(counterId, currentCount, button.dataset.clicked);
    } else {
        // Добавляем в счётчик
        currentCount += 1;
        counterElement.textContent = currentCount;

        // Меняем цвет кнопки на hover
        button.style.background = "#F2722C";
        button.dataset.clicked = "true";

        // Обновляем localStorage
        saveState(counterId, currentCount, button.dataset.clicked);
    }
}

// Функция для сохранения состояния в localStorage
function saveState(counterId, count, clicked) {
    localStorage.setItem(counterId, JSON.stringify({ count, clicked }));
}

// Функция для восстановления состояния
function restoreState(button, counterId) {
    const savedState = localStorage.getItem(counterId);

    if (savedState) {
        const { count, clicked } = JSON.parse(savedState);

        // Восстанавливаем значение счётчика
        document.getElementById(counterId).textContent = count;

        // Восстанавливаем состояние кнопки
        if (clicked === "true") {
            button.style.background = "#F2722C";
            button.dataset.clicked = "true";
        } else {
            button.style.background = "#264065";
            button.dataset.clicked = "false";
        }
    }
}


// Инициализация всех кнопок и счётчиков
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-to-favorites').forEach(button => {
        restoreState(button, 'favorites-counter');
        button.addEventListener('click', () => toggleCounter(button, 'favorites-counter'));
    });

    document.querySelectorAll('.add-to-marks').forEach(button => {
        restoreState(button, 'marks-counter');
        button.addEventListener('click', () => toggleCounter(button, 'marks-counter'));
    });

    document.querySelectorAll('.add-to-basket').forEach(button => {
        restoreState(button, 'basket-counter');
        button.addEventListener('click', () => toggleCounter(button, 'basket-counter'));
    });
});





// Поиск

// Получаем элементы
const searchIcon = document.querySelector('.search-icon');
const searchPopup = document.querySelector('.search-popup');

// Показать/скрыть поле поиска при нажатии на иконку
searchIcon.addEventListener('click', (e) => {
  e.stopPropagation(); // Предотвращаем распространение клика
  const isVisible = searchPopup.style.display === 'block';
  searchPopup.style.display = isVisible ? 'none' : 'block';
});

// Скрыть поле при клике вне области поиска
document.addEventListener('click', (e) => {
  if (!searchPopup.contains(e.target) && e.target !== searchIcon) {
    searchPopup.style.display = 'none';
  }
});



// Рейтинг

/* const stars = document.querySelectorAll('.stars img');
const ratingValue = document.getElementById('rating-value');

const averageRating = 4; // Средний рейтинг
const totalReviews = 50; // Общее количество отзывов

function displayRating(rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('filled'); // Меняем картинку на "заполненную"
        } else {
            star.classList.remove('filled'); // Возвращаем картинку на "пустую"
        }
    });
}

displayRating(Math.round(averageRating));

ratingValue.textContent = `${averageRating}`;
ratingValue.addEventListener('click', () => {
    window.location.href = '/reviews';
}); */

document.querySelectorAll('.product').forEach((product) => {
    const stars = product.querySelectorAll('.stars img');
    const ratingValue = product.querySelector('#rating-value');
    
    const averageRating = 4; // Средний рейтинг, например, можно подставить с бэкенда
    const totalReviews = 50; // Общее количество отзывов, можно подставить с бэкенда

    // Функция для отображения рейтинга
    function displayRating(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('filled'); // Заполненная звезда
            } else {
                star.classList.remove('filled'); // Пустая звезда
            }
        });
    }

    // Отображение среднего рейтинга (округленного)
    displayRating(Math.round(averageRating));

    // Отображаем количество отзывов в ссылке
    ratingValue.textContent = `${averageRating} (${totalReviews} отзывов)`;

    // Переход на страницу с отзывами по клику на рейтинг
    ratingValue.addEventListener('click', () => {
        window.location.href = '/reviews';
    });
});



// Слайдер

const sliderWrapper = document.querySelector(".slider-wrapper");
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".slider-dots");

let currentIndex = 0; // Текущая страница
const slidesPerPage = 3; // Товаров на странице
const totalPages = Math.ceil(slides.length / slidesPerPage); // Всего страниц

// Создание точек-индикаторов
for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement("span");
    dot.className = i === 0 ? "active" : "";
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
}

// Переход на слайд по индексу
function goToSlide(index) {
    currentIndex = index;
    const offset = -(index * 100); // Смещение в процентах
    sliderWrapper.style.transform = `translateX(${offset}%)`;

    updateDots();
}

// Обновление активной точки
function updateDots() {
    document.querySelectorAll(".slider-dots span").forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentIndex);
    });
}

// Мышь (десктоп) перелистывание
sliderWrapper.addEventListener("mousedown", (e) => {
    e.preventDefault(); // Убираем выделение
    startX = e.clientX;
});

sliderWrapper.addEventListener("mouseup", (e) => {
    const deltaX = e.clientX - startX;

    if (deltaX < -50 && currentIndex < totalPages - 1) {
        goToSlide(currentIndex + 1);
    } else if (deltaX > 50 && currentIndex > 0) {
        goToSlide(currentIndex - 1);
    }
});

// Убираем выделение картинок при перетаскивании
slides.forEach((slide) => {
    slide.addEventListener("dragstart", (e) => e.preventDefault());
});

// https://habr.com/ru/articles/501258/#4


// Слайдер1

document.querySelectorAll(".product-slider").forEach((slider) => {
    const sliderWrapper = slider.querySelector(".product-slider-wrapper");
    const slides = slider.querySelectorAll(".product-slide");
    const dotsContainer = slider.querySelector(".product-slider-dots");

    let currentIndex = 0; // Текущий индекс слайда
    const slidesPerPage = 1; // Одна картинка на слайд
    const totalPages = Math.ceil(slides.length / slidesPerPage); // Всего страниц

    // Создание точек-индикаторов
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement("span");
        dot.className = i === 0 ? "active" : "";
        dot.addEventListener("click", () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    // Переход на слайд по индексу
    function goToSlide(index) {
        currentIndex = index;
        const offset = -(index * 100); // Смещение в процентах
        sliderWrapper.style.transform = `translateX(${offset}%)`;
        updateDots();
    }

    // Обновление активной точки
    function updateDots() {
        dotsContainer.querySelectorAll("span").forEach((dot, idx) => {
            dot.classList.toggle("active", idx === currentIndex);
        });
    }

    // Добавляем поддержку свайпов для мобильных устройств
    let startX = 0;

    sliderWrapper.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    sliderWrapper.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;

        if (deltaX < -50 && currentIndex < totalPages - 1) {
            goToSlide(currentIndex + 1);
        } else if (deltaX > 50 && currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    });

    // Мышь (десктоп) перелистывание
    sliderWrapper.addEventListener("mousedown", (e) => {
        e.preventDefault(); // Убираем выделение
        startX = e.clientX;
    });

    sliderWrapper.addEventListener("mouseup", (e) => {
        const deltaX = e.clientX - startX;

        if (deltaX < -50 && currentIndex < totalPages - 1) {
            goToSlide(currentIndex + 1);
        } else if (deltaX > 50 && currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    });

    // Убираем выделение картинок при перетаскивании
    slides.forEach((slide) => {
        slide.addEventListener("dragstart", (e) => e.preventDefault());
    });
});


