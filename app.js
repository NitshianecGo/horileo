// app.js – полная логика

let currentLevelId = 'topik1';
let currentTab = 'home'; // home, plan, reading, audio, grammar, dictionary, profile
let currentIndex = 0; // для чтения, аудио, грамматики
let currentGrammarExerciseIndex = 0;
let readingItems = [];
let audioItems = [];
let grammarItems = [];
let userProgress = {};

const mainEl = document.getElementById('app-main');
const navBtns = document.querySelectorAll('.nav-btn');
const coinDisplay = document.getElementById('coin-display');

// ----- Загрузка и сохранение прогресса -----
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
        learnedWords: {},
        readingProgress: {}, // { levelId: { index: 5, completed: [0,1,2] } }
        audioProgress: {},
        grammarProgress: {}
    };
}

function saveProgress() {
    localStorage.setItem('horileo_progress', JSON.stringify(userProgress));
    updateCoinDisplay();
}

function updateCoinDisplay() {
    coinDisplay.textContent = '☕ ' + (userProgress.coins || 0);
}

// ----- Инициализация -----
loadProgress();
navigateTo('home');

// ----- Навигация по вкладкам -----
function navigateTo(tab) {
    currentTab = tab;
    navBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.nav-btn[data-tab="${tab}"]`).classList.add('active');
    switch(tab) {
        case 'home': renderHome(); break;
        case 'plan': renderLevelSelection(); break;
        case 'dictionary': renderDictionary(); break;
        case 'profile': renderProfile(); break;
        case 'reading': renderReading(); break;
        case 'audio': renderAudio(); break;
        case 'grammar': renderGrammar(); break;
        default: renderHome();
    }
}

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navigateTo(btn.dataset.tab);
    });
});

// ----- Главная -----
function renderHome() {
    const totalTasks = 100; // условно
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
            <div class="card" onclick="openReadingSection()">📖 Чтение</div>
            <div class="card" onclick="openAudioSection()">🎧 Аудирование</div>
            <div class="card" onclick="openGrammarSection()">📝 Грамматика</div>
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

// ----- План (для совместимости, но теперь не используется для уроков) -----
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
    html += `
        <div class="card">
            <h3>Разделы курса</h3>
            <div class="row">
                <div class="card" onclick="openReadingSection()">📖 Чтение (${level.reading.length} предложений)</div>
                <div class="card" onclick="openAudioSection()">🎧 Аудирование (${level.audio.length} слов)</div>
                <div class="card" onclick="openGrammarSection()">📝 Грамматика (${level.grammar.length} правил)</div>
            </div>
        </div>
    `;
    mainEl.innerHTML = html;
}

// ----- Раздел ЧТЕНИЕ -----
function openReadingSection() {
    const level = LEVELS.find(l => l.id === currentLevelId);
    if (!level) return;
    readingItems = level.reading;
    // Восстанавливаем прогресс
    const progress = userProgress.readingProgress?.[currentLevelId] || { index: 0, completed: [] };
    currentIndex = progress.index || 0;
    if (currentIndex >= readingItems.length) currentIndex = readingItems.length - 1;
    navigateTo('reading');
}

function renderReading() {
    if (readingItems.length === 0) {
        mainEl.innerHTML = `<div class="card"><h2>Нет предложений для чтения</h2><button class="btn-primary" onclick="navigateTo('home')">Назад</button></div>`;
        return;
    }
    const item = readingItems[currentIndex];
    const total = readingItems.length;
    const progress = userProgress.readingProgress?.[currentLevelId] || { index: 0, completed: [] };
    const isCompleted = progress.completed && progress.completed.includes(currentIndex);
    const isSkipped = progress.skipped && progress.skipped.includes(currentIndex);

    let html = `
        <div class="card">
            <h2>📖 Чтение (${currentLevelId})</h2>
            <p>Предложение ${currentIndex+1} из ${total}</p>
            <div class="reading-text">${item.korean}</div>
            <div id="translation-display" style="display:none; background:#f0f8ff; padding:12px; border-radius:16px; margin:8px 0;">
                <strong>Перевод:</strong> ${item.russian}
            </div>
            <div id="feedback" style="margin:8px 0;"></div>
            <div class="row" style="justify-content:center; gap:10px;">
                <button class="btn-secondary" onclick="readingPrev()" ${currentIndex === 0 ? 'disabled' : ''}>⬅ Назад</button>
                <button class="btn-primary" onclick="readingCheck()">✅ Проверить</button>
                <button class="btn-secondary" onclick="readingSkip()">⏭ Пропустить</button>
                <button class="btn-secondary" onclick="readingNext()" ${currentIndex === total-1 ? 'disabled' : ''}>Дальше ➡</button>
            </div>
            <div style="margin-top:12px;">
                <span>Статус: ${isCompleted ? '✅ Пройдено' : isSkipped ? '⏭ Пропущено' : '⬜ Не пройдено'}</span>
            </div>
            <br>
            <button class="btn-primary" onclick="navigateTo('home')">На главную</button>
        </div>
    `;
    mainEl.innerHTML = html;
}

function readingCheck() {
    const display = document.getElementById('translation-display');
    if (display) display.style.display = 'block';
    // Отметить как пройденное, если ещё не отмечено
    const progress = userProgress.readingProgress?.[currentLevelId] || { index: 0, completed: [], skipped: [] };
    if (!progress.completed) progress.completed = [];
    if (!progress.skipped) progress.skipped = [];
    if (!progress.completed.includes(currentIndex) && !progress.skipped.includes(currentIndex)) {
        progress.completed.push(currentIndex);
        userProgress.coins = (userProgress.coins || 0) + 1;
        if (!userProgress.readingProgress) userProgress.readingProgress = {};
        userProgress.readingProgress[currentLevelId] = progress;
        saveProgress();
        document.getElementById('feedback').innerHTML = '<span style="color:green;">✅ Отлично! +1 ☕</span>';
        // Обновим статус
        const statusSpan = document.querySelector('.card > div:last-child span');
        if (statusSpan) statusSpan.textContent = '✅ Пройдено';
    } else {
        document.getElementById('feedback').innerHTML = '<span style="color:orange;">⏳ Уже выполнено</span>';
    }
}

function readingSkip() {
    const progress = userProgress.readingProgress?.[currentLevelId] || { index: 0, completed: [], skipped: [] };
    if (!progress.skipped) progress.skipped = [];
    if (!progress.skipped.includes(currentIndex)) {
        progress.skipped.push(currentIndex);
        if (!userProgress.readingProgress) userProgress.readingProgress = {};
        userProgress.readingProgress[currentLevelId] = progress;
        saveProgress();
        document.getElementById('feedback').innerHTML = '<span style="color:orange;">⏭ Пропущено</span>';
        const statusSpan = document.querySelector('.card > div:last-child span');
        if (statusSpan) statusSpan.textContent = '⏭ Пропущено';
    } else {
        document.getElementById('feedback').innerHTML = '<span style="color:orange;">⏳ Уже пропущено</span>';
    }
}

function readingNext() {
    if (currentIndex < readingItems.length - 1) {
        currentIndex++;
        const progress = userProgress.readingProgress?.[currentLevelId] || { index: 0, completed: [], skipped: [] };
        progress.index = currentIndex;
        if (!userProgress.readingProgress) userProgress.readingProgress = {};
        userProgress.readingProgress[currentLevelId] = progress;
        saveProgress();
        renderReading();
    }
}

function readingPrev() {
    if (currentIndex > 0) {
        currentIndex--;
        const progress = userProgress.readingProgress?.[currentLevelId] || { index: 0, completed: [], skipped: [] };
        progress.index = currentIndex;
        if (!userProgress.readingProgress) userProgress.readingProgress = {};
        userProgress.readingProgress[currentLevelId] = progress;
        saveProgress();
        renderReading();
    }
}

// ----- Раздел АУДИРОВАНИЕ (аналогично чтению) -----
function openAudioSection() {
    const level = LEVELS.find(l => l.id === currentLevelId);
    if (!level) return;
    audioItems = level.audio;
    const progress = userProgress.audioProgress?.[currentLevelId] || { index: 0, completed: [] };
    currentIndex = progress.index || 0;
    if (currentIndex >= audioItems.length) currentIndex = audioItems.length - 1;
    navigateTo('audio');
}

function renderAudio() {
    if (audioItems.length === 0) {
        mainEl.innerHTML = `<div class="card"><h2>Нет слов для аудирования</h2><button class="btn-primary" onclick="navigateTo('home')">Назад</button></div>`;
        return;
    }
    const item = audioItems[currentIndex];
    const total = audioItems.length;
    const progress = userProgress.audioProgress?.[currentLevelId] || { index: 0, completed: [] };
    const isCompleted = progress.completed && progress.completed.includes(currentIndex);
    const isSkipped = progress.skipped && progress.skipped.includes(currentIndex);

    let html = `
        <div class="card">
            <h2>🎧 Аудирование (${currentLevelId})</h2>
            <p>Слово ${currentIndex+1} из ${total}</p>
            <div style="font-size:2rem; margin:12px 0;">🔊</div>
            <button class="btn-secondary audio-play-btn" onclick="playAudio('${item.korean}')">▶ Прослушать</button>
            <div id="translation-display" style="display:none; background:#f0f8ff; padding:12px; border-radius:16px; margin:8px 0;">
                <strong>Перевод:</strong> ${item.russian}
            </div>
            <div id="feedback" style="margin:8px 0;"></div>
            <div class="row" style="justify-content:center; gap:10px;">
                <button class="btn-secondary" onclick="audioPrev()" ${currentIndex === 0 ? 'disabled' : ''}>⬅ Назад</button>
                <button class="btn-primary" onclick="audioCheck()">✅ Проверить</button>
                <button class="btn-secondary" onclick="audioSkip()">⏭ Пропустить</button>
                <button class="btn-secondary" onclick="audioNext()" ${currentIndex === total-1 ? 'disabled' : ''}>Дальше ➡</button>
            </div>
            <div style="margin-top:12px;">
                <span>Статус: ${isCompleted ? '✅ Пройдено' : isSkipped ? '⏭ Пропущено' : '⬜ Не пройдено'}</span>
            </div>
            <br>
            <button class="btn-primary" onclick="navigateTo('home')">На главную</button>
        </div>
    `;
    mainEl.innerHTML = html;
}

function audioCheck() {
    const display = document.getElementById('translation-display');
    if (display) display.style.display = 'block';
    const progress = userProgress.audioProgress?.[currentLevelId] || { index: 0, completed: [], skipped: [] };
    if (!progress.completed) progress.completed = [];
    if (!progress.skipped) progress.skipped = [];
    if (!progress.completed.includes(currentIndex) && !progress.skipped.includes(currentIndex)) {
        progress.completed.push(currentIndex);
        userProgress.coins = (userProgress.coins || 0) + 1;
        if (!userProgress.audioProgress) userProgress.audioProgress = {};
        userProgress.audioProgress[currentLevelId] = progress;
        saveProgress();
        document.getElementById('feedback').innerHTML = '<span style="color:green;">✅ Отлично! +1 ☕</span>';
        const statusSpan = document.querySelector('.card > div:last-child span');
        if (statusSpan) statusSpan.textContent = '✅ Пройдено';
    } else {
        document.getElementById('feedback').innerHTML = '<span style="color:orange;">⏳ Уже выполнено</span>';
    }
}

function audioSkip() {
    const progress = userProgress.audioProgress?.[currentLevelId] || { index: 0, completed: [], skipped: [] };
    if (!progress.skipped) progress.skipped = [];
    if (!progress.skipped.includes(currentIndex)) {
        progress.skipped.push(currentIndex);
        if (!userProgress.audioProgress) userProgress.audioProgress = {};
        userProgress.audioProgress[currentLevelId] = progress;
        saveProgress();
        document.getElementById('feedback').innerHTML = '<span style="color:orange;">⏭ Пропущено</span>';
        const statusSpan = document.querySelector('.card > div:last-child span');
        if (statusSpan) statusSpan.textContent = '⏭ Пропущено';
    } else {
        document.getElementById('feedback').innerHTML = '<span style="color:orange;">⏳ Уже пропущено</span>';
    }
}

function audioNext() {
    if (currentIndex < audioItems.length - 1) {
        currentIndex++;
        const progress = userProgress.audioProgress?.[currentLevelId] || { index: 0, completed: [], skipped: [] };
        progress.index = currentIndex;
        if (!userProgress.audioProgress) userProgress.audioProgress = {};
        userProgress.audioProgress[currentLevelId] = progress;
        saveProgress();
        renderAudio();
    }
}

function audioPrev() {
    if (currentIndex > 0) {
        currentIndex--;
        const progress = userProgress.audioProgress?.[currentLevelId] || { index: 0, completed: [], skipped: [] };
        progress.index = currentIndex;
        if (!userProgress.audioProgress) userProgress.audioProgress = {};
        userProgress.audioProgress[currentLevelId] = progress;
        saveProgress();
        renderAudio();
    }
}

// ----- Раздел ГРАММАТИКА (правила с упражнениями) -----
function openGrammarSection() {
    const level = LEVELS.find(l => l.id === currentLevelId);
    if (!level) return;
    grammarItems = level.grammar;
    const progress = userProgress.grammarProgress?.[currentLevelId] || { ruleIndex: 0, exerciseIndex: 0, completed: [] };
    currentIndex = progress.ruleIndex || 0;
    currentGrammarExerciseIndex = progress.exerciseIndex || 0;
    if (currentIndex >= grammarItems.length) currentIndex = grammarItems.length - 1;
    navigateTo('grammar');
}

function renderGrammar() {
    if (grammarItems.length === 0) {
        mainEl.innerHTML = `<div class="card"><h2>Нет грамматических правил</h2><button class="btn-primary" onclick="navigateTo('home')">Назад</button></div>`;
        return;
    }
    const rule = grammarItems[currentIndex];
    const total = grammarItems.length;
    const progress = userProgress.grammarProgress?.[currentLevelId] || { ruleIndex: 0, exerciseIndex: 0, completed: [] };
    const isCompleted = progress.completed && progress.completed.includes(currentIndex);

    // Показываем правило и упражнения (для простоты покажем первое упражнение)
    const exercise = rule.exercises && rule.exercises.length > 0 ? rule.exercises[0] : null;

    let html = `
        <div class="card">
            <h2>📝 Грамматика (${currentLevelId})</h2>
            <p>Правило ${currentIndex+1} из ${total}</p>
            <h3>${rule.title}</h3>
            <p>${rule.description}</p>
            <div style="background:#f0f0f0; padding:12px; border-radius:16px; margin:8px 0;">
                <strong>Примеры:</strong>
                <ul>
                    ${rule.examples.map(ex => `<li>${ex}</li>`).join('')}
                </ul>
            </div>
            ${exercise ? `
                <div style="margin-top:16px;">
                    <h4>Упражнение:</h4>
                    <p>${exercise.question}</p>
                    <input type="text" id="grammar-answer" placeholder="Введите ответ" style="width:100%; padding:10px; border-radius:16px; border:1px solid #ddd; margin:8px 0;">
                    <button class="btn-primary" onclick="checkGrammarAnswer('${exercise.correct}')">Проверить</button>
                    <div id="grammar-feedback" style="margin:8px 0;"></div>
                </div>
            ` : `<p>Нет упражнений для этого правила.</p>`}
            <div id="feedback" style="margin:8px 0;"></div>
            <div class="row" style="justify-content:center; gap:10px;">
                <button class="btn-secondary" onclick="grammarPrev()" ${currentIndex === 0 ? 'disabled' : ''}>⬅ Назад</button>
                <button class="btn-primary" onclick="grammarComplete()">✅ Завершить правило</button>
                <button class="btn-secondary" onclick="grammarSkip()">⏭ Пропустить</button>
                <button class="btn-secondary" onclick="grammarNext()" ${currentIndex === total-1 ? 'disabled' : ''}>Дальше ➡</button>
            </div>
            <div style="margin-top:12px;">
                <span>Статус: ${isCompleted ? '✅ Пройдено' : '⬜ Не пройдено'}</span>
            </div>
            <br>
            <button class="btn-primary" onclick="navigateTo('home')">На главную</button>
        </div>
    `;
    mainEl.innerHTML = html;
}

function checkGrammarAnswer(correct) {
    const input = document.getElementById('grammar-answer');
    const fb = document.getElementById('grammar-feedback');
    if (!input) return;
    const answer = input.value.trim();
    if (answer === correct) {
        fb.innerHTML = '<span style="color:green;">✅ Правильно!</span>';
        // Можно дать монетку
        userProgress.coins = (userProgress.coins || 0) + 1;
        saveProgress();
    } else {
        fb.innerHTML = `<span style="color:red;">❌ Неверно. Правильный ответ: ${correct}</span>`;
    }
}

function grammarComplete() {
    const progress = userProgress.grammarProgress?.[currentLevelId] || { ruleIndex: 0, exerciseIndex: 0, completed: [] };
    if (!progress.completed) progress.completed = [];
    if (!progress.completed.includes(currentIndex)) {
        progress.completed.push(currentIndex);
        userProgress.coins = (userProgress.coins || 0) + 2;
        if (!userProgress.grammarProgress) userProgress.grammarProgress = {};
        userProgress.grammarProgress[currentLevelId] = progress;
        saveProgress();
        document.getElementById('feedback').innerHTML = '<span style="color:green;">✅ Правило изучено! +2 ☕</span>';
        const statusSpan = document.querySelector('.card > div:last-child span');
        if (statusSpan) statusSpan.textContent = '✅ Пройдено';
    } else {
        document.getElementById('feedback').innerHTML = '<span style="color:orange;">⏳ Уже выполнено</span>';
    }
}

function grammarSkip() {
    const progress = userProgress.grammarProgress?.[currentLevelId] || { ruleIndex: 0, exerciseIndex: 0, completed: [], skipped: [] };
    if (!progress.skipped) progress.skipped = [];
    if (!progress.skipped.includes(currentIndex)) {
        progress.skipped.push(currentIndex);
        if (!userProgress.grammarProgress) userProgress.grammarProgress = {};
        userProgress.grammarProgress[currentLevelId] = progress;
        saveProgress();
        document.getElementById('feedback').innerHTML = '<span style="color:orange;">⏭ Пропущено</span>';
        const statusSpan = document.querySelector('.card > div:last-child span');
        if (statusSpan) statusSpan.textContent = '⏭ Пропущено';
    } else {
        document.getElementById('feedback').innerHTML = '<span style="color:orange;">⏳ Уже пропущено</span>';
    }
}

function grammarNext() {
    if (currentIndex < grammarItems.length - 1) {
        currentIndex++;
        const progress = userProgress.grammarProgress?.[currentLevelId] || { ruleIndex: 0, exerciseIndex: 0, completed: [], skipped: [] };
        progress.ruleIndex = currentIndex;
        progress.exerciseIndex = 0;
        if (!userProgress.grammarProgress) userProgress.grammarProgress = {};
        userProgress.grammarProgress[currentLevelId] = progress;
        saveProgress();
        renderGrammar();
    }
}

function grammarPrev() {
    if (currentIndex > 0) {
        currentIndex--;
        const progress = userProgress.grammarProgress?.[currentLevelId] || { ruleIndex: 0, exerciseIndex: 0, completed: [], skipped: [] };
        progress.ruleIndex = currentIndex;
        progress.exerciseIndex = 0;
        if (!userProgress.grammarProgress) userProgress.grammarProgress = {};
        userProgress.grammarProgress[currentLevelId] = progress;
        saveProgress();
        renderGrammar();
    }
}

// ----- Общая озвучка -----
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

// ----- Словарь (упрощённо) -----
function renderDictionary() {
    // Показываем слова, связанные с текущим уровнем
    const levelDict = DICTIONARY.filter(w => w.levelId === currentLevelId);
    let html = `<h2>📖 Словарь (${currentLevelId})</h2>`;
    html += `<p>Всего слов: ${levelDict.length}</p>`;
    html += `<div id="dict-list">`;
    levelDict.slice(0, 50).forEach(item => {
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
    html += `</div>`;
    mainEl.innerHTML = html;
}

// ----- Профиль -----
function renderProfile() {
    const totalWords = DICTIONARY.length;
    const learnedWords = Object.keys(userProgress.learnedWords || {}).length;
    const completedLessons = userProgress.totalLessons || 0;
    const coins = userProgress.coins || 0;
    let level = 'TOPIK 1';
    if (completedLessons > 10) level = 'TOPIK 2';
    if (completedLessons > 30) level = 'TOPIK 3';
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
        userProgress = { currentLevel: 'topik1', completedTasks: [], coins: 0, wordsLearned: 0, totalLessons: 0, learnedWords: {}, readingProgress: {}, audioProgress: {}, grammarProgress: {} };
        saveProgress();
        navigateTo('home');
    }
}

// Инициализация Speech Synthesis для iOS
document.addEventListener('touchstart', () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.getVoices();
}, { once: true });
