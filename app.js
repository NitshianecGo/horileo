// app.js – ядро приложения

// ----- Инициализация -----
let progress = loadProgress();
let allLevels = LEVELS;
let dictionary = DICTIONARY.slice(); // копия

// DOM-элементы
const mainEl = document.getElementById('app-main');
const navBtns = document.querySelectorAll('.nav-btn');
const coinDisplay = document.getElementById('coin-display');

// ----- Вспомогательные функции -----
function loadProgress() {
    try {
        const data = localStorage.getItem('horileo_progress');
        if (data) return JSON.parse(data);
    } catch(e) {}
    return JSON.parse(JSON.stringify(DEFAULT_PROGRESS));
}

function saveProgress() {
    localStorage.setItem('horileo_progress', JSON.stringify(progress));
    localStorage.setItem('horileo_dictionary', JSON.stringify(dictionary));
    updateCoinDisplay();
}

function updateCoinDisplay() {
    coinDisplay.textContent = '🍚 ' + progress.coins;
}

// ----- Навигация -----
function navigateTo(tab) {
    navBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.nav-btn[data-tab="${tab}"]`).classList.add('active');
    switch(tab) {
        case 'home': renderHome(); break;
        case 'plan': renderPlan(); break;
        case 'dictionary': renderDictionary(); break;
        case 'profile': renderProfile(); break;
    }
}

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navigateTo(btn.dataset.tab);
    });
});

// ----- Рендер главной -----
function renderHome() {
    const totalLevels = allLevels.length;
    const completed = progress.completedTasks.length;
    // Примерный прогресс (в процентах)
    const pct = Math.min(100, Math.round((completed / (totalLevels * 3 * 3)) * 100));
    let html = `
        <div class="card" style="text-align:center;">
            <h2>🐯 Привет! Я Хори</h2>
            <p>Твой прогресс: ${pct}%</p>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <br>
            <button class="btn-primary" id="continue-btn">Продолжить урок</button>
        </div>
        <div class="row">
            <div class="card" onclick="navigateTo('plan')">📚 План</div>
            <div class="card" onclick="openReading()">📖 Чтение</div>
            <div class="card" onclick="openAudio()">🎧 Аудио</div>
        </div>
        <div class="row">
            <div class="card" onclick="openGrammar()">📝 Грамматика</div>
            <div class="card" onclick="openWriting()">✍️ Письмо</div>
            <div class="card" onclick="navigateTo('dictionary')">📖 Словарь</div>
        </div>
    `;
    mainEl.innerHTML = html;
    document.getElementById('continue-btn')?.addEventListener('click', () => {
        startCurrentLesson();
    });
}

// ----- План обучения -----
function renderPlan() {
    let html = `<h2>📚 План обучения</h2>`;
    allLevels.forEach((level, idx) => {
        const isUnlocked = idx <= progress.currentLevel;
        html += `
            <div class="card" style="${!isUnlocked ? 'opacity:0.5;' : ''}">
                <h3>${level.title}</h3>
                <p>${level.description}</p>
                <div class="row">
                    ${level.lessons.map((lesson, lIdx) => `
                        <button class="btn-secondary" ${isUnlocked ? `onclick="openLesson(${idx}, ${lIdx})"` : 'disabled'}>
                            ${lesson.title}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    });
    mainEl.innerHTML = html;
}

function openLesson(levelIdx, lessonIdx) {
    const level = allLevels[levelIdx];
    const lesson = level.lessons[lessonIdx];
    progress.currentLevel = levelIdx;
    progress.currentLesson = lessonIdx;
    progress.currentTask = 0;
    saveProgress();
    renderLesson(levelIdx, lessonIdx);
}

function startCurrentLesson() {
    const lvl = progress.currentLevel;
    const les = progress.currentLesson;
    if (allLevels[lvl] && allLevels[lvl].lessons[les]) {
        renderLesson(lvl, les);
    } else {
        // найти первый доступный
        for (let i=0; i<allLevels.length; i++) {
            for (let j=0; j<allLevels[i].lessons.length; j++) {
                if (!progress.completedTasks.includes(allLevels[i].lessons[j].tasks[0]?.id)) {
                    progress.currentLevel = i;
                    progress.currentLesson = j;
                    progress.currentTask = 0;
                    saveProgress();
                    renderLesson(i, j);
                    return;
                }
            }
        }
        renderHome(); // всё пройдено
    }
}

// ----- Рендер урока -----
let currentTaskIndex = 0;
let lessonTasks = [];

function renderLesson(levelIdx, lessonIdx) {
    const lesson = allLevels[levelIdx].lessons[lessonIdx];
    lessonTasks = lesson.tasks;
    currentTaskIndex = progress.currentTask || 0;
    renderTask(currentTaskIndex);
}

function renderTask(index) {
    if (index >= lessonTasks.length) {
        // Урок завершён
        progress.totalLessonsCompleted++;
        progress.coins += 5;
        saveProgress();
        mainEl.innerHTML = `<div class="card"><h2>🎉 Урок пройден!</h2><p>+5 🍚</p><button class="btn-primary" onclick="navigateTo('plan')">К плану</button></div>`;
        return;
    }
    const task = lessonTasks[index];
    let html = `<div class="lesson-container"><h3>Задание ${index+1}/${lessonTasks.length}</h3>`;
    html += `<div class="question-text">${task.question}</div>`;

    switch(task.type) {
        case 'choose':
            html += `<div class="option-grid">`;
            task.options.forEach((opt, i) => {
                html += `<button class="option-btn" data-opt="${i}" onclick="checkChoose(${i}, ${index})">${opt}</button>`;
            });
            html += `</div>`;
            html += `<div id="feedback-${index}"></div>`;
            break;
        case 'order':
            // Перетаскивание
            html += `<div class="drag-area" id="drag-area-${index}">`;
            // Перемешаем слова
            const shuffled = [...task.words].sort(() => Math.random() - 0.5);
            shuffled.forEach(w => {
                html += `<span class="drag-item" draggable="true">${w}</span>`;
            });
            html += `</div>`;
            html += `<button class="btn-primary" onclick="checkOrder(${index})">Проверить</button>`;
            html += `<div id="feedback-${index}"></div>`;
            break;
        case 'fill':
            html += `<div class="option-grid">`;
            task.options.forEach((opt, i) => {
                html += `<button class="option-btn" data-opt="${i}" onclick="checkFill(${i}, ${index})">${opt}</button>`;
            });
            html += `</div>`;
            html += `<div id="feedback-${index}"></div>`;
            break;
        case 'audio':
            html += `<button class="btn-secondary" onclick="playAudio('${task.audioText}')">🔊 Прослушать</button>`;
            html += `<div class="option-grid">`;
            task.options.forEach((opt, i) => {
                html += `<button class="option-btn" data-opt="${i}" onclick="checkChoose(${i}, ${index})">${opt}</button>`;
            });
            html += `</div>`;
            html += `<div id="feedback-${index}"></div>`;
            break;
        case 'write':
            html += `<input type="text" id="write-input-${index}" placeholder="Введите на корейском" style="width:100%;padding:12px;border-radius:16px;border:1px solid #ddd;font-size:1.2rem;">`;
            html += `<button class="btn-primary" onclick="checkWrite(${index})">Проверить</button>`;
            html += `<div id="feedback-${index}"></div>`;
            break;
        default:
            html += `<p>Неизвестный тип задания</p>`;
    }
    html += `</div>`;
    mainEl.innerHTML = html;

    // Инициализация drag and drop
    if (task.type === 'order') {
        initDragDrop(index);
    }
}

// ----- Проверки заданий -----
function checkChoose(selected, taskIndex) {
    const task = lessonTasks[taskIndex];
    const btns = document.querySelectorAll(`.option-btn[data-opt]`);
    const correct = task.correct;
    const feedback = document.getElementById(`feedback-${taskIndex}`);
    if (selected === correct) {
        feedback.innerHTML = `<span style="color:green;">✅ Правильно!</span>`;
        btns.forEach(b => b.disabled = true);
        markTaskComplete(taskIndex);
        setTimeout(() => { nextTask(); }, 1200);
    } else {
        feedback.innerHTML = `<span style="color:red;">❌ Попробуй ещё</span>`;
        btns[selected].classList.add('wrong');
        setTimeout(() => btns[selected].classList.remove('wrong'), 600);
    }
}

function checkOrder(taskIndex) {
    const area = document.getElementById(`drag-area-${taskIndex}`);
    const items = area.querySelectorAll('.drag-item');
    const userOrder = Array.from(items).map(el => el.textContent);
    const task = lessonTasks[taskIndex];
    const correct = task.correct;
    const feedback = document.getElementById(`feedback-${taskIndex}`);
    if (userOrder.join('|') === correct.join('|')) {
        feedback.innerHTML = `<span style="color:green;">✅ Правильно!</span>`;
        markTaskComplete(taskIndex);
        setTimeout(() => { nextTask(); }, 1200);
    } else {
        feedback.innerHTML = `<span style="color:red;">❌ Неверный порядок. Попробуй перетащить</span>`;
    }
}

function checkFill(selected, taskIndex) {
    // аналогично choose
    checkChoose(selected, taskIndex);
}

function checkWrite(taskIndex) {
    const input = document.getElementById(`write-input-${taskIndex}`);
    const userAnswer = input.value.trim();
    const task = lessonTasks[taskIndex];
    // для простоты считаем, что правильный ответ - это первый вариант (для демо)
    // В реальности надо сверять с ожидаемым ответом, но у нас нет поля correct для write
    // поэтому допустим, что мы проверяем наличие слова "가" (или что-то)
    const feedback = document.getElementById(`feedback-${taskIndex}`);
    if (userAnswer.includes('가') || userAnswer.includes('안녕')) {
        feedback.innerHTML = `<span style="color:green;">✅ Принято!</span>`;
        markTaskComplete(taskIndex);
        setTimeout(() => { nextTask(); }, 1200);
    } else {
        feedback.innerHTML = `<span style="color:red;">❌ Попробуйте написать правильное слово</span>`;
    }
}

function playAudio(text) {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
}

function markTaskComplete(taskIndex) {
    const taskId = lessonTasks[taskIndex].id || `task_${Date.now()}_${taskIndex}`;
    if (!progress.completedTasks.includes(taskId)) {
        progress.completedTasks.push(taskId);
        // добавляем слово в словарь, если есть
        const task = lessonTasks[taskIndex];
        if (task.audioText) {
            addWordToDictionary(task.audioText, '');
        }
        progress.coins += 1;
        saveProgress();
        updateCoinDisplay();
    }
}

function addWordToDictionary(word, translation) {
    // проверяем, есть ли уже
    if (!dictionary.some(w => w.word === word)) {
        dictionary.push({ word, translation: translation || 'новое слово', level: 1, learned: false });
        saveProgress();
    }
}

function nextTask() {
    currentTaskIndex++;
    progress.currentTask = currentTaskIndex;
    saveProgress();
    if (currentTaskIndex >= lessonTasks.length) {
        renderLesson(progress.currentLevel, progress.currentLesson); // завершит урок
    } else {
        renderTask(currentTaskIndex);
    }
}

// ----- Drag and Drop для order -----
function initDragDrop(index) {
    const area = document.getElementById(`drag-area-${index}`);
    if (!area) return;
    let draggedItem = null;

    area.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        e.target.style.opacity = '0.5';
    });
    area.addEventListener('dragend', (e) => {
        e.target.style.opacity = '1';
    });
    area.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    area.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem && draggedItem !== e.target) {
            // переставить элементы
            const items = Array.from(area.children);
            const fromIdx = items.indexOf(draggedItem);
            const toIdx = items.indexOf(e.target);
            if (fromIdx < toIdx) {
                area.insertBefore(draggedItem, e.target.nextSibling);
            } else {
                area.insertBefore(draggedItem, e.target);
            }
        }
    });

    // Touch support for mobile
    let touchDrag = null;
    area.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.classList.contains('drag-item')) {
            touchDrag = target;
            target.style.opacity = '0.5';
        }
    }, { passive: true });
    area.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!touchDrag) return;
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.classList.contains('drag-item') && target !== touchDrag) {
            const items = Array.from(area.children);
            const fromIdx = items.indexOf(touchDrag);
            const toIdx = items.indexOf(target);
            if (fromIdx < toIdx) {
                area.insertBefore(touchDrag, target.nextSibling);
            } else {
                area.insertBefore(touchDrag, target);
            }
        }
    }, { passive: false });
    area.addEventListener('touchend', () => {
        if (touchDrag) {
            touchDrag.style.opacity = '1';
            touchDrag = null;
        }
    });
}

// ----- Разделы: Чтение, Аудио, Грамматика, Письмо -----
function openReading() {
    mainEl.innerHTML = `
        <div class="card">
            <h2>📖 Чтение (Webtoon)</h2>
            <p>Адаптированный комикс:</p>
            <div style="background:#f9f9f9;padding:16px;border-radius:16px;font-size:1.2rem;line-height:1.8;">
                <p>🐯 안녕! 나는 호리야.</p>
                <p>나는 한국어를 공부해요.</p>
                <p>오늘은 날씨가 좋아요.</p>
            </div>
            <p><em>Нажми на слово, чтобы увидеть перевод</em> (в демо-версии)</p>
            <button class="btn-primary" onclick="navigateTo('home')">Назад</button>
        </div>
    `;
}

function openAudio() {
    mainEl.innerHTML = `
        <div class="card">
            <h2>🎧 Аудирование</h2>
            <p>Послушай фразу и выбери перевод</p>
            <button class="btn-secondary" onclick="playAudio('안녕하세요')">🔊 안녕하세요</button>
            <div class="option-grid">
                <button class="option-btn" onclick="alert('Правильно!')">Здравствуйте</button>
                <button class="option-btn" onclick="alert('Неправильно')">До свидания</button>
                <button class="option-btn" onclick="alert('Неправильно')">Спасибо</button>
            </div>
            <br>
            <button class="btn-primary" onclick="navigateTo('home')">Назад</button>
        </div>
    `;
}

function openGrammar() {
    mainEl.innerHTML = `
        <div class="card">
            <h2>📝 Грамматика</h2>
            <p>Тренажёр частиц:</p>
            <p>Выбери правильную частицу: <strong>학교___ 가요.</strong></p>
            <div class="option-grid">
                <button class="option-btn" onclick="alert('✅ Правильно!')">에</button>
                <button class="option-btn" onclick="alert('❌ Неверно')">에서</button>
                <button class="option-btn" onclick="alert('❌ Неверно')">을</button>
            </div>
            <br>
            <button class="btn-primary" onclick="navigateTo('home')">Назад</button>
        </div>
    `;
}

function openWriting() {
    mainEl.innerHTML = `
        <div class="card">
            <h2>✍️ Письмо от руки</h2>
            <p>Нарисуй слог <strong>가</strong> на холсте</p>
            <div class="canvas-wrapper">
                <canvas id="writing-canvas" width="300" height="300"></canvas>
            </div>
            <button class="btn-secondary" onclick="clearCanvas()">Очистить</button>
            <button class="btn-primary" onclick="navigateTo('home')">Готово</button>
        </div>
    `;
    // Инициализация canvas для рисования
    setTimeout(() => {
        const canvas = document.getElementById('writing-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        canvas.addEventListener('mousedown', (e) => { isDrawing = true; draw(e); });
        canvas.addEventListener('mousemove', (e) => { if (isDrawing) draw(e); });
        canvas.addEventListener('mouseup', () => { isDrawing = false; });
        canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; drawTouch(e); });
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (isDrawing) drawTouch(e); });
        canvas.addEventListener('touchend', () => { isDrawing = false; });

        function draw(e) {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (canvas.height / rect.height);
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI*2);
            ctx.fill();
        }
        function drawTouch(e) {
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
            const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI*2);
            ctx.fill();
        }
        window.clearCanvas = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    }, 100);
}

// ----- Словарь -----
function renderDictionary() {
    let html = `<h2>📖 Мой Ханбок (словарь)</h2>`;
    html += `<button class="btn-secondary" onclick="startRepetition()">🔁 Повторение карточек</button>`;
    html += `<div id="dict-list">`;
    dictionary.forEach(item => {
        html += `
            <div class="dict-item">
                <span class="dict-word">${item.word}</span>
                <span class="dict-trans">${item.translation}</span>
                <span>${item.learned ? '✅' : '⬜'}</span>
            </div>
        `;
    });
    html += `</div>`;
    mainEl.innerHTML = html;
}

function startRepetition() {
    const unlearned = dictionary.filter(w => !w.learned);
    if (unlearned.length === 0) {
        alert('Все слова изучены! 🎉');
        return;
    }
    const word = unlearned[Math.floor(Math.random() * unlearned.length)];
    const html = `
        <div class="modal-overlay show" id="rep-modal">
            <div class="modal-content">
                <h2>🔁 Повторение</h2>
                <p style="font-size:2rem;">${word.word}</p>
                <p><em>Как переводится?</em></p>
                <input type="text" id="rep-answer" placeholder="Введите перевод" style="width:100%;padding:10px;margin:12px 0;border-radius:16px;border:1px solid #ddd;">
                <button class="btn-primary" onclick="checkRepetition('${word.word}')">Проверить</button>
                <button class="btn-secondary" onclick="closeModal()">Закрыть</button>
                <div id="rep-feedback"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function checkRepetition(word) {
    const input = document.getElementById('rep-answer');
    const answer = input.value.trim().toLowerCase();
    const dictWord = dictionary.find(w => w.word === word);
    if (!dictWord) return;
    const correct = dictWord.translation.toLowerCase();
    const fb = document.getElementById('rep-feedback');
    if (answer === correct) {
        dictWord.learned = true;
        saveProgress();
        fb.innerHTML = '<span style="color:green;">✅ Отлично!</span>';
        setTimeout(() => { closeModal(); renderDictionary(); }, 1000);
    } else {
        fb.innerHTML = `<span style="color:red;">❌ Правильно: ${dictWord.translation}</span>`;
    }
}

function closeModal() {
    const modal = document.getElementById('rep-modal');
    if (modal) modal.remove();
}

// ----- Профиль -----
function renderProfile() {
    const totalWords = dictionary.length;
    const learnedWords = dictionary.filter(w => w.learned).length;
    const completedLessons = progress.totalLessonsCompleted;
    const coins = progress.coins;
    // Оценка уровня TOPIK (приблизительно)
    let level = 'TOPIK 1';
    if (completedLessons > 5) level = 'TOPIK 2';
    if (completedLessons > 15) level = 'TOPIK 3';
    const html = `
        <div class="card">
            <h2>👤 Мой прогресс</h2>
            <p>🐯 Выучено слов: ${learnedWords}/${totalWords}</p>
            <p>📚 Пройдено уроков: ${completedLessons}</p>
            <p>🍚 Монет: ${coins}</p>
            <p>🏆 Уровень: ${level}</p>
            <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(100, (learnedWords/totalWords)*100)}%"></div></div>
            <hr>
            <h4>Настройки</h4>
            <label>Скорость речи: <input type="range" min="0.5" max="1.5" step="0.1" value="0.9" id="speed-range"></label>
            <br>
            <button class="btn-secondary" onclick="resetProgress()">Сбросить прогресс</button>
        </div>
    `;
    mainEl.innerHTML = html;
    // Сохраняем скорость
    document.getElementById('speed-range')?.addEventListener('change', (e) => {
        localStorage.setItem('horileo_speed', e.target.value);
    });
}

function resetProgress() {
    if (confirm('Вы уверены? Весь прогресс будет удалён.')) {
        localStorage.removeItem('horileo_progress');
        localStorage.removeItem('horileo_dictionary');
        progress = JSON.parse(JSON.stringify(DEFAULT_PROGRESS));
        dictionary = DICTIONARY.slice();
        saveProgress();
        navigateTo('home');
    }
}

// ----- Инициализация приложения -----
navigateTo('home');
saveProgress();

// Обработка Speech Synthesis rate
const savedSpeed = localStorage.getItem('horileo_speed');
if (savedSpeed) {
    window.speechSpeed = parseFloat(savedSpeed);
} else {
    window.speechSpeed = 0.9;
}
// Патчим playAudio для использования скорости
const origPlay = window.playAudio;
window.playAudio = function(text) {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = window.speechSpeed || 0.9;
    window.speechSynthesis.speak(utterance);
};
