// app.js – ядро приложения с новыми функциями

// ----- Инициализация -----
let progress = loadProgress();
let dictionary = loadDictionary();
let currentDay = progress.currentDay || 0; // 0-индекс дня
let currentLessonIndex = progress.currentLessonIndex || 0;

const mainEl = document.getElementById('app-main');
const navBtns = document.querySelectorAll('.nav-btn');
const coinDisplay = document.getElementById('coin-display');

// ----- Вспомогательные функции -----
function loadProgress() {
    try {
        const data = localStorage.getItem('horileo_progress');
        if (data) return JSON.parse(data);
    } catch(e) {}
    return {
        currentDay: 0,
        currentLessonIndex: 0,
        completedTasks: [],
        coins: 0,
        wordsLearned: 0,
        totalLessonsCompleted: 0,
        studyTime: 0
    };
}

function saveProgress() {
    localStorage.setItem('horileo_progress', JSON.stringify(progress));
    saveDictionary();
    updateCoinDisplay();
}

function loadDictionary() {
    try {
        const data = localStorage.getItem('horileo_dictionary');
        if (data) return JSON.parse(data);
    } catch(e) {}
    return DICTIONARY.map(w => ({ ...w }));
}

function saveDictionary() {
    localStorage.setItem('horileo_dictionary', JSON.stringify(dictionary));
}

function updateCoinDisplay() {
    coinDisplay.textContent = '☕ ' + progress.coins;
}

// Инициализация Speech Synthesis для iOS
let speechReady = false;
function initSpeech() {
    if (!window.speechSynthesis) return;
    // Запрашиваем голоса, чтобы активировать на iOS
    window.speechSynthesis.getVoices();
    speechReady = true;
}
// Вызовем при первом клике
document.addEventListener('click', () => {
    if (!speechReady) initSpeech();
});

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

// ----- Главная -----
function renderHome() {
    const totalDays = PLAN.length;
    const completed = progress.completedTasks.length;
    const pct = Math.min(100, Math.round((completed / (totalDays * 3 * 3)) * 100));
    let html = `
        <div class="card" style="text-align:center;">
            <h2>🐯 Привет! Я Хори</h2>
            <p>Твой прогресс: ${pct}%</p>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <br>
            <button class="btn-primary" id="continue-btn">Продолжить обучение</button>
        </div>
        <div class="row">
            <div class="card" onclick="navigateTo('plan')">📚 План</div>
            <div class="card" onclick="openReading()">📖 Чтение</div>
            <div class="card" onclick="openAudio()">🎧 Аудирование</div>
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

// ----- План (21 день) -----
function renderPlan() {
    let html = `<h2>📚 3-недельный план (TOPIK 1)</h2>`;
    PLAN.forEach((day, idx) => {
        const isUnlocked = idx <= progress.currentDay;
        const dayNumber = idx + 1;
        const dayOfWeek = WEEKDAYS[idx % 7];
        html += `
            <div class="card" style="${!isUnlocked ? 'opacity:0.5;' : ''}">
                <h3>День ${dayNumber} (${dayOfWeek}) – ${day.title}</h3>
                <p>${day.topics.join(' • ')}</p>
                <button class="btn-secondary" ${isUnlocked ? `onclick="openDay(${idx})"` : 'disabled'}>
                    ${isUnlocked ? 'Открыть' : '🔒'}
                </button>
            </div>
        `;
    });
    mainEl.innerHTML = html;
}

function openDay(dayIdx) {
    progress.currentDay = dayIdx;
    progress.currentLessonIndex = 0;
    saveProgress();
    renderDayLessons(dayIdx);
}

function renderDayLessons(dayIdx) {
    const day = PLAN[dayIdx];
    // Создаём 2-3 урока для этого дня на основе тем
    const lessons = generateLessonsForDay(day);
    let html = `<h2>📖 День ${dayIdx+1}: ${day.title}</h2>`;
    lessons.forEach((lesson, lIdx) => {
        const isComplete = progress.completedTasks.includes(lesson.id);
        html += `
            <div class="card">
                <h4>${lesson.title}</h4>
                <p>${lesson.description || ''}</p>
                <button class="btn-secondary" ${!isComplete ? `onclick="openLesson(${dayIdx}, ${lIdx})"` : 'disabled'}>
                    ${isComplete ? '✅ Пройдено' : 'Начать'}
                </button>
            </div>
        `;
    });
    html += `<button class="btn-primary" onclick="navigateTo('plan')">Назад к плану</button>`;
    mainEl.innerHTML = html;
}

// Генерация уроков для дня (используем слова из словаря)
function generateLessonsForDay(day) {
    const lessons = [];
    const topics = day.topics;
    // Урок 1: лексика по теме
    const wordsForTopic = dictionary.filter(w => 
        day.topics.some(t => w.category.includes(t) || w.word.includes(t))
    ).slice(0, 10);
    if (wordsForTopic.length > 0) {
        lessons.push({
            id: `day${day.day}_lesson1`,
            title: `Слова по теме "${day.title}"`,
            description: 'Изучи основные слова',
            tasks: wordsForTopic.map((w, i) => ({
                id: `task_${day.day}_1_${i}`,
                type: 'choose',
                question: `Как переводится "${w.word}"?`,
                options: shuffle([w.translation, ...getRandomTranslations(w.translation, 3)]),
                correct: 0,
                word: w.word
            }))
        });
    }
    // Урок 2: грамматика (например, частицы или времена)
    lessons.push({
        id: `day${day.day}_lesson2`,
        title: `Грамматика: ${day.topics[0]}`,
        description: 'Потренируйся в построении предложений',
        tasks: generateGrammarTasks(day)
    });
    // Урок 3: аудирование или чтение
    lessons.push({
        id: `day${day.day}_lesson3`,
        title: `Практика: чтение и аудирование`,
        description: 'Прослушай и прочитай предложения',
        tasks: generatePracticeTasks(day)
    });
    return lessons;
}

// Вспомогательные функции для генерации заданий
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getRandomTranslations(exclude, count) {
    const all = dictionary.map(w => w.translation).filter(t => t !== exclude);
    const shuffled = shuffle(all);
    return shuffled.slice(0, count);
}

function generateGrammarTasks(day) {
    // Для демонстрации вернём простые задания
    return [
        {
            id: `gram_${day.day}_1`,
            type: 'fill',
            question: `Вставь правильную частицу: "학교___ 가요."`,
            options: ['에', '에서', '을'],
            correct: 0
        },
        {
            id: `gram_${day.day}_2`,
            type: 'order',
            question: 'Составь предложение "Я иду в школу"',
            words: ['나는', '학교에', '간다'],
            correct: ['나는', '학교에', '간다']
        }
    ];
}

function generatePracticeTasks(day) {
    // Вернём аудио-задание
    const sampleWord = dictionary.find(w => w.category === day.topics[0])?.word || '안녕하세요';
    return [
        {
            id: `prac_${day.day}_1`,
            type: 'audio',
            question: `Прослушай и выбери правильный перевод`,
            audioText: sampleWord,
            options: shuffle([dictionary.find(w => w.word === sampleWord)?.translation || 'Привет', 'Пока', 'Спасибо', 'Извините']),
            correct: 0
        }
    ];
}

// Открытие урока (рендер заданий)
let currentLessonTasks = [];
let currentTaskIndex = 0;

function openLesson(dayIdx, lessonIdx) {
    const day = PLAN[dayIdx];
    const lessons = generateLessonsForDay(day);
    const lesson = lessons[lessonIdx];
    if (!lesson) return;
    currentLessonTasks = lesson.tasks;
    currentTaskIndex = 0;
    progress.currentDay = dayIdx;
    progress.currentLessonIndex = lessonIdx;
    saveProgress();
    renderTask();
}

function renderTask() {
    if (currentTaskIndex >= currentLessonTasks.length) {
        // Урок пройден
        progress.totalLessonsCompleted++;
        progress.coins += 5;
        saveProgress();
        mainEl.innerHTML = `
            <div class="card">
                <h2>🎉 Урок пройден!</h2>
                <p>+5 ☕</p>
                <button class="btn-primary" onclick="navigateTo('plan')">К плану</button>
            </div>
        `;
        return;
    }
    const task = currentLessonTasks[currentTaskIndex];
    let html = `<div class="lesson-container"><h3>Задание ${currentTaskIndex+1}/${currentLessonTasks.length}</h3>`;
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

// ----- Проверки заданий (обновлены) -----
function checkChoose(selected) {
    const task = currentLessonTasks[currentTaskIndex];
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
    const task = currentLessonTasks[currentTaskIndex];
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
    const task = currentLessonTasks[currentTaskIndex];
    const feedback = document.getElementById('feedback');
    // Для демо считаем, что правильно, если содержит слово из audioText или первое слово
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
    const task = currentLessonTasks[currentTaskIndex];
    if (!progress.completedTasks.includes(task.id)) {
        progress.completedTasks.push(task.id);
        // Если есть слово, добавим в словарь
        if (task.word) {
            const existing = dictionary.find(w => w.word === task.word);
            if (existing) existing.learned = true;
            else dictionary.push({ word: task.word, translation: task.options?.[0] || '', category: '', learned: true });
        }
        progress.coins += 1;
        saveProgress();
        updateCoinDisplay();
    }
}

function nextTask() {
    currentTaskIndex++;
    progress.currentLessonIndex = currentTaskIndex;
    saveProgress();
    renderTask();
}

function startCurrentLesson() {
    const dayIdx = progress.currentDay;
    const lessonIdx = progress.currentLessonIndex;
    openLesson(dayIdx, lessonIdx);
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
    if (!window.speechSynthesis) {
        alert('Ваш браузер не поддерживает синтез речи.');
        return;
    }
    // Отменяем предыдущую речь, чтобы не накладывалось
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = parseFloat(localStorage.getItem('horileo_speed')) || 0.9;
    // Для iOS может потребоваться voice
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find(v => v.lang.startsWith('ko'));
    if (koreanVoice) utterance.voice = koreanVoice;
    window.speechSynthesis.speak(utterance);
}

// ----- Разделы: Чтение, Аудирование, Грамматика, Письмо -----
function openReading() {
    const sampleText = '안녕하세요. 저는 호리입니다. 오늘은 날씨가 좋아요.';
    let html = `
        <div class="card">
            <h2>📖 Чтение</h2>
            <div class="reading-text">${sampleText}</div>
            <button class="btn-secondary audio-play-btn" onclick="playAudio('${sampleText}')">🔊 Воспроизвести текст</button>
            <p><em>Нажми на слово, чтобы увидеть перевод (в демо-версии)</em></p>
            <button class="btn-primary" onclick="navigateTo('home')">Назад</button>
        </div>
    `;
    mainEl.innerHTML = html;
}

function openAudio() {
    const phrases = ['안녕하세요', '감사합니다', '죄송합니다'];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    const correctTrans = dictionary.find(w => w.word === randomPhrase)?.translation || 'Привет';
    const options = shuffle([correctTrans, 'Пока', 'Спасибо', 'Извините']);
    let html = `
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
            <br>
            <button class="btn-primary" onclick="navigateTo('home')">Назад</button>
        </div>
    `;
    mainEl.innerHTML = html;
    window.checkAudioAnswer = function(selected, correct) {
        const fb = document.getElementById('audio-feedback');
        if (selected === correct) {
            fb.innerHTML = '<span style="color:green;">✅ Правильно!</span>';
            progress.coins += 2;
            saveProgress();
            updateCoinDisplay();
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
    // Покажем только первые 50 для скорости
    const shown = dictionary.slice(0, 50);
    shown.forEach(item => {
        html += `
            <div class="dict-item">
                <span class="dict-word">${item.word}</span>
                <span class="dict-trans">${item.translation}</span>
                <span>${item.learned ? '✅' : '⬜'}</span>
                <button class="btn-secondary" onclick="playAudio('${item.word}')">🔊</button>
            </div>
        `;
    });
    html += `<p><em>Всего слов: ${dictionary.length}</em></p>`;
    html += `</div>`;
    mainEl.innerHTML = html;
}

let repetitionMode = 'ko->ru'; // или 'ru->ko'
let repetitionQueue = [];
let currentRepIndex = 0;

function startRepetition() {
    // Берём невыученные слова
    let unlearned = dictionary.filter(w => !w.learned);
    if (unlearned.length === 0) {
        alert('🎉 Все слова изучены! Можно повторить все.');
        unlearned = dictionary.slice();
    }
    // Перемешиваем и берём первые 20 для сессии
    repetitionQueue = shuffle(unlearned).slice(0, 20);
    currentRepIndex = 0;
    // Спрашиваем режим
    const mode = confirm('Повторять с корейского на русский? (Нажмите "OK" – корейский→русский, "Отмена" – русский→корейский)');
    repetitionMode = mode ? 'ko->ru' : 'ru->ko';
    showRepetitionCard();
}

function showRepetitionCard() {
    if (currentRepIndex >= repetitionQueue.length) {
        alert('🎉 Отлично! Сессия повторения завершена.');
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
    // Фокус на поле ввода
    setTimeout(() => document.getElementById('rep-answer')?.focus(), 100);
}

function checkRepetition(expected) {
    const input = document.getElementById('rep-answer');
    const userAnswer = input.value.trim();
    const feedback = document.getElementById('rep-feedback');
    if (userAnswer.toLowerCase() === expected.toLowerCase()) {
        feedback.innerHTML = `<span style="color:green;">✅ Правильно!</span>`;
        // Отмечаем слово выученным
        const word = repetitionQueue[currentRepIndex];
        const dictWord = dictionary.find(w => w.word === word.word);
        if (dictWord) dictWord.learned = true;
        progress.wordsLearned++;
        saveDictionary();
        saveProgress();
        // Автоматически переходим к следующему через 1.5 сек
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
    // Помечаем, чтобы повторить позже (не учим)
    // Просто переходим дальше по кнопке "Продолжить"
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

// ----- Профиль (с чашкой) -----
function renderProfile() {
    const totalWords = dictionary.length;
    const learnedWords = dictionary.filter(w => w.learned).length;
    const completedLessons = progress.totalLessonsCompleted;
    const coins = progress.coins;
    let level = 'TOPIK 1 (начальный)';
    if (completedLessons > 10) level = 'TOPIK 1 (средний)';
    if (completedLessons > 18) level = 'TOPIK 1 (продвинутый)';
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
        progress = { currentDay: 0, currentLessonIndex: 0, completedTasks: [], coins: 0, wordsLearned: 0, totalLessonsCompleted: 0, studyTime: 0 };
        dictionary = DICTIONARY.map(w => ({ ...w }));
        saveProgress();
        navigateTo('home');
    }
}

// ----- Инициализация приложения -----
navigateTo('home');
saveProgress();

// Поддержка iOS: активация speech при первом касании
document.addEventListener('touchstart', () => {
    if (!speechReady) initSpeech();
}, { once: true });
