document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('usernameInput');
    const submitUsernameBtn = document.getElementById('submitUsernameBtn');
    const usernameStatusMessage = document.getElementById('usernameStatusMessage');

    submitUsernameBtn.addEventListener('click', async () => {
        const username = usernameInput.value.trim();

        if (!username) {
            usernameStatusMessage.textContent = 'Пожалуйста, введите ваш @username Telegram';
            return;
        }

        if (!username.startsWith('@')) {
            usernameStatusMessage.textContent = 'Username должен начинаться с @';
            return;
        }

        usernameStatusMessage.textContent = 'Отправка...';

        try {
            // Здесь должен быть код для отправки username на ваш сервер
            // Для примера, мы просто имитируем отправку с задержкой
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Если отправка успешна
            usernameStatusMessage.textContent = 'Успешно отправлено!';
            usernameStatusMessage.style.color = 'green';
        } catch (error) {
            console.error('Ошибка при отправке username:', error);
            usernameStatusMessage.textContent = 'Ошибка при отправке. Пожалуйста, попробуйте еще раз.';
            usernameStatusMessage.style.color = 'red';
        }
    });
});