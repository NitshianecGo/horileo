// app.js – локальная версия без регистрации

let currentLevelId = 'topik1';
let currentWeekIndex = 0;
let currentDayIndex = 0;
let currentLessonIndex = 0;
let currentTaskIndex = 0;
let currentTasks = [];
let userProgress = {};

const mainEl = document.getElementById('app-main');
const navBtns = document.querySelectorAll('.nav-btn');
const coinDisplay = document.getElementById('coin-display');

// ----- Загрузка и сохранение прогресса (localStorage) -----
function loadProgress() {
    try {
        const data = localStorage.getItem('horileo_progress');
        if (data) {
            userProgress = JSON.parse(data);
            return;
        }
    } catch(e) {}
    userProgress = {
        currentLevel: 'topik1',
        completedTasks: [],
        coins: 0,
        wordsLearned: 0,
        totalLessons: 0,
        learnedWords: {} // для словаря: word -> true/false
    };
}

function saveProgress() {
    localStorage.setItem('horileo_progress', JSON.stringify(userProgress));
    // Также синхронизируем словарь
    const dictData = {};
    DICTIONARY.forEach(w => { dictData[w.word] = w.learned; });
    localStorage.setItem('horileo_dictionary', JSON.stringify(dictData));
    updateCoinDisplay();
}

function updateCoinDisplay() {
    coinDisplay.textContent = '☕ ' + (userProgress.coins || 0);
}

// ----- Навигация -----
function navigateTo(tab) {
    navBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.nav-btn[data-tab="${tab}"]`).classList.add('active');
    switch(tab) {
        case 'home': renderHome(); break;
        case 'plan': renderLevelSelection(); break;
        case 'dictionary': renderDictionary(); break;
        case 'profile': renderProfile(); break;
    }
}

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navigateTo(btn.dataset.tab);
    });
});

// ----- Главная -----
function renderHome() {
    const totalTasks = 100; // пример
    const completed = userProgress.completedTasks ? userProgress.completedTasks.length : 0;
    const pct = Math.min(100, Math.round((completed / totalTasks) * 100));
    let html = `
        <div class="card" style="text-align:center;">
            <h2>🐯 Привет, ученик!</h2>
            <p>Твой прогресс: ${pct}%</p>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <br>
            <button class="btn-primary" onclick="continueLearning()">Продолжить обучение</button>
        </div>
        <div class="card">
            <h3>Выбери уровень TOPIK</h3>
            <div class="row">
                ${LEVELS.map(l => `
                    <div class="card" onclick="selectLevel('${l.id}')" style="cursor:pointer;">
                        <h4>${l.title}</h4>
                        <p>${l.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="row">
            <div class="card" onclick="openReading()">📖 Чтение</div>
            <div class="card" onclick="openAudio()">🎧 Аудирование</div>
            <div class="card" onclick="openGrammar()">📝 Грамматика</div>
        </div>
    `;
    mainEl.innerHTML = html;
}

function selectLevel(levelId) {
    currentLevelId = levelId;
    userProgress.currentLevel = levelId;
    saveProgress();
    renderLevelPlan(levelId);
}

function continueLearning() {
    const levelId = userProgress.currentLevel || 'topik1';
    selectLevel(levelId);
}

// ----- План уровня -----
function renderLevelSelection() {
    let html = `<h2>📚 Выберите уровень</h2>`;
    LEVELS.forEach(l => {
        html += `
            <div class="card" onclick="selectLevel('${l.id}')" style="cursor:pointer;">
                <h3>${l.title}</h3>
                <p>${l.description}</p>
            </div>
        `;
    });
    mainEl.innerHTML = html;
}

function renderLevelPlan(levelId) {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return;
    let html = `<h2>📚 ${level.title}</h2>`;
    level.weeks.forEach((week, wIdx) => {
        html += `<h3>${week.title}</h3>`;
        week.days.forEach((day, dIdx) => {
            const isComplete = userProgress.completedTasks && userProgress.completedTasks.includes(day.lessons[0]?.id);
            html += `
                <div class="card" style="${isComplete ? 'opacity:0.7;' : ''}">
                    <h4>${day.title}</h4>
                    <p>Темы: ${day.topics.join(', ')}</p>
                    <button class="btn-secondary" onclick="openDay(${wIdx}, ${dIdx}, '${levelId}')">
                        ${isComplete ? '✅ Пройдено' : 'Начать'}
                    </button>
                </div>
            `;
        });
    });
    mainEl.innerHTML = html;
}

function openDay(weekIdx, dayIdx, levelId) {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return;
    const day = level.weeks[weekIdx].days[dayIdx];
    currentWeekIndex = weekIdx;
    currentDayIndex = dayIdx;
    const lessons = day.lessons;
    if (lessons.length === 0) {
        alert('В этом дне пока нет уроков');
        return;
    }
    openLesson(levelId, weekIdx, dayIdx, 0);
}

function openLesson(levelId, weekIdx, dayIdx, lessonIdx) {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return;
    const day = level.weeks[weekIdx].days[dayIdx];
    const lesson = day.lessons[lessonIdx];
    if (!lesson) return;
    currentTasks = lesson.tasks;
    currentTaskIndex = 0;
    currentLessonIndex = lessonIdx;
    renderTask();
}

function renderTask() {
    if (currentTaskIndex >= currentTasks.length) {
        // Урок завершён
        userProgress.totalLessons = (userProgress.totalLessons || 0) + 1;
        userProgress.coins = (userProgress.coins || 0) + 5;
        const taskId = currentTasks[0]?.id || `task_${Date.now()}`;
        if (!userProgress.completedTasks) userProgress.completedTasks = [];
        if (!userProgress.completedTasks.includes(taskId)) {
            userProgress.completedTasks.push(taskId);
        }
        saveProgress();
        mainEl.innerHTML = `
            <div class="card">
                <h2>🎉 Урок пройден!</h2>
                <p>+5 ☕</p>
                <button class="btn-primary" onclick="renderLevelPlan('${currentLevelId}')">К плану</button>
            </div>
        `;
        return;
    }
    const task = currentTasks[currentTaskIndex];
    let html = `<div class="lesson-container"><h3>Задание ${currentTaskIndex+1}/${currentTasks.length}</h3>`;
    html += `<div class="question-text">${task.question}</div>`;

    switch(task.type) {
        case 'choose':
            html += `<div class="option-grid">`;
            task.options.forEach((opt, i) => {
                html += `<button class="option-btn" data-opt="${i}" onclick="checkChoose(${i})">${opt}</button>`;
            });
            html += `</div>`;
            html += `<div id="feedback"></div>`;
            break;
        case 'order':
            html += `<div class="drag-area" id="drag-area">`;
            const shuffled = shuffle([...task.words]);
            shuffled.forEach(w => {
                html += `<span class="drag-item" draggable="true">${w}</span>`;
            });
            html += `</div>`;
            html += `<button class="btn-primary" onclick="checkOrder()">Проверить</button>`;
            html += `<div id="feedback"></div>`;
            break;
        case 'fill':
            html += `<div class="option-grid">`;
            task.options.forEach((opt, i) => {
                html += `<button class="option-btn" data-opt="${i}" onclick="checkFill(${i})">${opt}</button>`;
            });
            html += `</div>`;
            html += `<div id="feedback"></div>`;
            break;
        case 'audio':
            html += `<button class="btn-secondary audio-play-btn" onclick="playAudio('${task.audioText}')">🔊 Прослушать</button>`;
            html += `<div class="option-grid">`;
            task.options.forEach((opt, i) => {
                html += `<button class="option-btn" data-opt="${i}" onclick="checkChoose(${i})">${opt}</button>`;
            });
            html += `</div>`;
            html += `<div id="feedback"></div>`;
            break;
        case 'write':
            html += `<input type="text" id="write-input" placeholder="Введите на корейском" style="width:100%;padding:12px;border-radius:16px;border:1px solid #ddd;font-size:1.2rem;">`;
            html += `<button class="btn-primary" onclick="checkWrite()">Проверить</button>`;
            html += `<div id="feedback"></div>`;
            break;
        default:
            html += `<p>Неизвестный тип задания</p>`;
    }
    html += `</div>`;
    mainEl.innerHTML = html;

    if (task.type === 'order') {
        initDragDrop();
    }
}

// ----- Проверки заданий -----
function checkChoose(selected) {
    const task = currentTasks[currentTaskIndex];
    const feedback = document.getElementById('feedback');
    if (selected === task.correct) {
        feedback.innerHTML = `<span style="color:green;">✅ Правильно!</span>`;
        markTaskComplete();
        setTimeout(() => nextTask(), 1200);
    } else {
        feedback.innerHTML = `<span style="color:red;">❌ Попробуй ещё</span>`;
    }
}

function checkOrder() {
    const area = document.getElementById('drag-area');
    const items = area.querySelectorAll('.drag-item');
    const userOrder = Array.from(items).map(el => el.textContent);
    const task = currentTasks[currentTaskIndex];
    const feedback = document.getElementById('feedback');
    if (userOrder.join('|') === task.correct.join('|')) {
        feedback.innerHTML = `<span style="color:green;">✅ Правильно!</span>`;
        markTaskComplete();
        setTimeout(() => nextTask(), 1200);
    } else {
        feedback.innerHTML = `<span style="color:red;">❌ Неверный порядок.</span>`;
    }
}

function checkFill(selected) {
    checkChoose(selected);
}

function checkWrite() {
    const input = document.getElementById('write-input');
    const userAnswer = input.value.trim();
    const task = currentTasks[currentTaskIndex];
    const feedback = document.getElementById('feedback');
    const expected = task.audioText || task.options?.[0] || '';
    if (userAnswer.includes(expected) || expected.includes(userAnswer)) {
        feedback.innerHTML = `<span style="color:green;">✅ Принято!</span>`;
        markTaskComplete();
        setTimeout(() => nextTask(), 1200);
    } else {
        feedback.innerHTML = `<span style="color:red;">❌ Попробуйте ещё раз. Подсказка: ${expected}</span>`;
    }
}

function markTaskComplete() {
    const task = currentTasks[currentTaskIndex];
    if (!userProgress.completedTasks) userProgress.completedTasks = [];
    if (!userProgress.completedTasks.includes(task.id)) {
        userProgress.completedTasks.push(task.id);
        if (task.word) {
            const dictWord = DICTIONARY.find(w => w.word === task.word);
            if (dictWord) dictWord.learned = true;
        }
        userProgress.coins = (userProgress.coins || 0) + 1;
        saveProgress();
    }
}

function nextTask() {
    currentTaskIndex++;
    saveProgress();
    renderTask();
}

// ----- Вспомогательные функции -----
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ----- Drag and Drop -----
function initDragDrop() {
    const area = document.getElementById('drag-area');
    if (!area) return;
    let draggedItem = null;
    area.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        e.target.style.opacity = '0.5';
    });
    area.addEventListener('dragend', (e) => {
        e.target.style.opacity = '1';
    });
    area.addEventListener('dragover', (e) => e.preventDefault());
    area.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem && draggedItem !== e.target) {
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
    // Touch
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

// ----- Озвучка (с поддержкой iOS) -----
function playAudio(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = parseFloat(localStorage.getItem('horileo_speed')) || 0.9;
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find(v => v.lang.startsWith('ko'));
    if (koreanVoice) utterance.voice = koreanVoice;
    window.speechSynthesis.speak(utterance);
}

// ----- Чтение, Аудирование, Грамматика, Письмо (упрощённо) -----
function openReading() {
    const sampleText = '안녕하세요. 저는 호리입니다. 오늘은 날씨가 좋아요.';
    mainEl.innerHTML = `
        <div class="card">
            <h2>📖 Чтение</h2>
            <div class="reading-text">${sampleText}</div>
            <button class="btn-secondary audio-play-btn" onclick="playAudio('${sampleText}')">🔊 Воспроизвести текст</button>
            <button class="btn-primary" onclick="navigateTo('home')">Назад</button>
        </div>
    `;
}

function openAudio() {
    const phrases = ['안녕하세요', '감사합니다', '죄송합니다'];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    const correctTrans = DICTIONARY.find(w => w.word === randomPhrase)?.translation || 'Привет';
    const options = shuffle([correctTrans, 'Пока', 'Спасибо', 'Извините']);
    mainEl.innerHTML = `
        <div class="card">
            <h2>🎧 Аудирование</h2>
            <p>Прослушай фразу и выбери правильный перевод</p>
            <button class="btn-secondary audio-play-btn" onclick="playAudio('${randomPhrase}')">🔊 Прослушать</button>
            <div class="option-grid">
                ${options.map((opt, i) => `
                    <button class="option-btn" onclick="checkAudioAnswer('${opt}', '${correctTrans}')">${opt}</button>
                `).join('')}
            </div>
            <div id="audio-feedback"></div>
            <button class="btn-primary" onclick="navigateTo('home')">Назад</button>
        </div>
    `;
    window.checkAudioAnswer = function(selected, correct) {
        const fb = document.getElementById('audio-feedback');
        if (selected === correct) {
            fb.innerHTML = '<span style="color:green;">✅ Правильно!</span>';
            userProgress.coins = (userProgress.coins || 0) + 2;
            saveProgress();
        } else {
            fb.innerHTML = `<span style="color:red;">❌ Неверно. Правильно: ${correct}</span>`;
        }
    };
}

function openGrammar() {
    mainEl.innerHTML = `
        <div class="card">
            <h2>📝 Грамматика</h2>
            <p>Выбери правильную частицу: <strong>학교___ 가요.</strong></p>
            <div class="option-grid">
                <button class="option-btn" onclick="alert('✅ Правильно!')">에</button>
                <button class="option-btn" onclick="alert('❌ Неверно')">에서</button>
                <button class="option-btn" onclick="alert('❌ Неверно')">을</button>
            </div>
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

// ----- Словарь и карточки -----
function renderDictionary() {
    let html = `<h2>📖 Мой Ханбок (словарь)</h2>`;
    html += `<button class="btn-secondary" onclick="startRepetition()">🔁 Повторение карточек</button>`;
    html += `<div id="dict-list">`;
    const shown = DICTIONARY.slice(0, 50);
    shown.forEach(item => {
        const learned = userProgress.learnedWords?.[item.word] || false;
        html += `
            <div class="dict-item">
                <span class="dict-word">${item.word}</span>
                <span class="dict-trans">${item.translation}</span>
                <span>${learned ? '✅' : '⬜'}</span>
                <button class="btn-secondary" onclick="playAudio('${item.word}')">🔊</button>
            </div>
        `;
    });
    html += `<p><em>Всего слов: ${DICTIONARY.length}</em></p>`;
    html += `</div>`;
    mainEl.innerHTML = html;
}

let repetitionQueue = [];
let currentRepIndex = 0;
let repetitionMode = 'ko->ru';

function startRepetition() {
    const unlearned = DICTIONARY.filter(w => !(userProgress.learnedWords?.[w.word]));
    let pool = unlearned.length > 0 ? unlearned : DICTIONARY.slice();
    repetitionQueue = shuffle(pool).slice(0, 20);
    currentRepIndex = 0;
    const mode = confirm('Повторять с корейского на русский? (OK – корейский→русский, Отмена – русский→корейский)');
    repetitionMode = mode ? 'ko->ru' : 'ru->ko';
    showRepetitionCard();
}

function showRepetitionCard() {
    if (currentRepIndex >= repetitionQueue.length) {
        alert('🎉 Сессия повторения завершена.');
        renderDictionary();
        return;
    }
    const word = repetitionQueue[currentRepIndex];
    const isKoToRu = repetitionMode === 'ko->ru';
    const displayText = isKoToRu ? word.word : word.translation;
    const expectedAnswer = isKoToRu ? word.translation : word.word;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show';
    modal.id = 'rep-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>🔁 Повторение (${currentRepIndex+1}/${repetitionQueue.length})</h2>
            <div class="word-display">${displayText}</div>
            <button class="btn-secondary audio-play-btn" onclick="playAudio('${word.word}')">🔊 Прослушать</button>
            <input type="text" id="rep-answer" placeholder="Введите перевод" autofocus>
            <div id="rep-feedback"></div>
            <div class="modal-buttons">
                <button class="btn-dontknow" onclick="dontKnow()">😕 Я не знаю</button>
                <button class="btn-check" onclick="checkRepetition('${expectedAnswer}')">✅ Проверить</button>
                <button class="btn-next" onclick="nextRepetition()">➡️ Продолжить</button>
                <button class="btn-close" onclick="closeRepetition()">❌ Закрыть</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => document.getElementById('rep-answer')?.focus(), 100);
}

function checkRepetition(expected) {
    const input = document.getElementById('rep-answer');
    const userAnswer = input.value.trim();
    const feedback = document.getElementById('rep-feedback');
    if (userAnswer.toLowerCase() === expected.toLowerCase()) {
        feedback.innerHTML = `<span style="color:green;">✅ Правильно!</span>`;
        const word = repetitionQueue[currentRepIndex];
        if (!userProgress.learnedWords) userProgress.learnedWords = {};
        userProgress.learnedWords[word.word] = true;
        userProgress.wordsLearned = (userProgress.wordsLearned || 0) + 1;
        saveProgress();
        setTimeout(() => nextRepetition(), 1200);
    } else {
        feedback.innerHTML = `<span style="color:red;">❌ Неверно. Правильно: ${expected}</span>`;
    }
}

function dontKnow() {
    const feedback = document.getElementById('rep-feedback');
    const word = repetitionQueue[currentRepIndex];
    const expected = repetitionMode === 'ko->ru' ? word.translation : word.word;
    feedback.innerHTML = `<span style="color:orange;">😕 Правильный ответ: ${expected}</span>`;
}

function nextRepetition() {
    currentRepIndex++;
    closeRepetition();
    if (currentRepIndex < repetitionQueue.length) {
        showRepetitionCard();
    } else {
        alert('🎉 Сессия завершена!');
        renderDictionary();
    }
}

function closeRepetition() {
    const modal = document.getElementById('rep-modal');
    if (modal) modal.remove();
}

// ----- Профиль -----
function renderProfile() {
    const totalWords = DICTIONARY.length;
    const learnedWords = Object.keys(userProgress.learnedWords || {}).length;
    const completedLessons = userProgress.totalLessons || 0;
    const coins = userProgress.coins || 0;
    let level = 'TOPIK 1 (начальный)';
    if (completedLessons > 10) level = 'TOPIK 1 (средний)';
    if (completedLessons > 20) level = 'TOPIK 2 (продвинутый)';
    if (completedLessons > 30) level = 'TOPIK 3 (эксперт)';
    const html = `
        <div class="card">
            <h2>👤 Мой прогресс</h2>
            <p>🐯 Выучено слов: ${learnedWords}/${totalWords}</p>
            <p>📚 Пройдено уроков: ${completedLessons}</p>
            <p>☕ Чашек (очков): ${coins}</p>
            <p>🏆 Уровень: ${level}</p>
            <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(100, (learnedWords/totalWords)*100)}%"></div></div>
            <hr>
            <h4>Настройки</h4>
            <label>Скорость речи: <input type="range" min="0.5" max="1.5" step="0.1" value="${localStorage.getItem('horileo_speed') || 0.9}" id="speed-range"></label>
            <br>
            <button class="btn-secondary" onclick="resetProgress()">Сбросить прогресс</button>
        </div>
    `;
    mainEl.innerHTML = html;
    document.getElementById('speed-range')?.addEventListener('change', (e) => {
        localStorage.setItem('horileo_speed', e.target.value);
    });
}

function resetProgress() {
    if (confirm('Вы уверены? Весь прогресс будет удалён.')) {
        localStorage.removeItem('horileo_progress');
        localStorage.removeItem('horileo_dictionary');
        userProgress = { currentLevel: 'topik1', completedTasks: [], coins: 0, wordsLearned: 0, totalLessons: 0, learnedWords: {} };
        DICTIONARY.forEach(w => w.learned = false);
        saveProgress();
        navigateTo('home');
    }
}

// ----- Инициализация -----
loadProgress();
navigateTo('home');

// Активация speech для iOS
document.addEventListener('touchstart', () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.getVoices();
}, { once: true });
