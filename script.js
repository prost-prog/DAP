// ===== Шаг 3.1: Объект состояния формы =====
const formState = {
    values: {
        name: '',
        email: '',
        password: '',
        agree: false
    },
    errors: {
        name: '',
        email: '',
        password: '',
        agree: ''
    },
    isValid: false
};

// ===== Шаг 3.2: Правила валидации =====
const validationRules = {
    name(value) {
        if (!value.trim()) return 'Имя обязательно для заполнения';
        if (value.trim().length < 2) return 'Имя должно содержать минимум 2 символа';
        if (!/^[а-яА-Яa-zA-Z\s]+$/.test(value)) return 'Имя может содержать только буквы и пробелы';
        return '';
    },
    email(value) {
        if (!value.trim()) return 'Email обязателен для заполнения';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Некорректный email адрес';
        return '';
    },
    password(value) {
        if (!value) return 'Пароль обязателен для заполнения';
        if (value.length < 6) return 'Пароль должен содержать минимум 6 символов';
        return '';
    },
    agree(value) {
        if (!value) return 'Необходимо принять условия использования';
        return '';
    }
};

// ===== Вспомогательные элементы DOM =====
const form = document.getElementById('registrationForm');
const inputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    agree: document.getElementById('agree')
};
const errorElements = {
    name: document.querySelector('[data-error-for="name"]'),
    email: document.querySelector('[data-error-for="email"]'),
    password: document.querySelector('[data-error-for="password"]'),
    agree: document.querySelector('[data-error-for="agree"]')
};
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

// ===== Шаг 3.3: Живая валидация =====
function validateField(fieldName, value) {
    const error = validationRules[fieldName](value);
    formState.errors[fieldName] = error;
    formState.values[fieldName] = value;

    // Обновляем интерфейс поля
    const input = inputs[fieldName];
    if (input.type === 'checkbox') {
        errorElements[fieldName].textContent = error;
        input.parentElement.style.color = error ? '#e74c3c' : '';
    } else {
        errorElements[fieldName].textContent = error;
        input.classList.toggle('error', !!error);
    }

    // Проверяем общую валидность формы
    updateFormValidity();
}

function updateFormValidity() {
    const hasErrors = Object.values(formState.errors).some(error => error !== '');
    formState.isValid = !hasErrors;

    // Активируем/деактивируем кнопку
    submitBtn.disabled = !formState.isValid;
    submitBtn.classList.toggle('active', formState.isValid);
}

// Навешиваем обработчики
inputs.name.addEventListener('input', (e) => validateField('name', e.target.value));
inputs.email.addEventListener('input', (e) => validateField('email', e.target.value));
inputs.password.addEventListener('input', (e) => validateField('password', e.target.value));
inputs.agree.addEventListener('change', (e) => validateField('agree', e.target.checked));

// ===== Шаг 3.5: Обработка отправки формы =====
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (formState.isValid) {
        // Показываем сообщение об успехе
        formMessage.textContent = 'Регистрация прошла успешно! Добро пожаловать!';
        formMessage.className = 'form-message success';
        
        // Опционально: можно сбросить форму и состояние через пару секунд
        setTimeout(() => {
            form.reset();
            // Сброс состояния
            formState.values = { name: '', email: '', password: '', agree: false };
            formState.errors = { name: '', email: '', password: '', agree: '' };
            formState.isValid = false;
// Скрыть ошибки
            Object.values(errorElements).forEach(el => el.textContent = '');
            Object.values(inputs).forEach(input => {
                if (input.type !== 'checkbox') input.classList.remove('error');
            });
            submitBtn.disabled = true;
            submitBtn.classList.remove('active');
            formMessage.style.display = 'none';
        }, 3000);
    }
});