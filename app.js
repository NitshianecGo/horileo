// app.js – полная логика приложения (начальный курс, чтение, аудио, грамматика, словарь, профиль, тема)

let currentLevelId = 'topik1';
let currentTab = 'home';
let currentIndex = 0;
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
        coins: 0,
        learnedWords: {},
        readingProgress: {},
        audioProgress: {},
        grammarProgress: {},
        beginnerCompleted: [],
        totalLessons: 0,
        wordsLearned: 0
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

// ----- Навигация -----
function navigateTo(tab) {
    currentTab = tab;
    navBtns.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    switch(tab) {
        case 'home': renderHome(); break;
        case 'plan': renderPlan(); break;
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
    const totalTasks = 100;
    const completed = 0; // упрощённо
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

// ----- План (начальный + уровни) -----
function renderPlan() {
    let html = `<h2>📚 План обучения</h2>`;
    // Начальный план
    html += `<div class="card"><h3>${BEGINNER_PLAN.title}</h3>`;
    BEGINNER_PLAN.steps.forEach((step, idx) => {
        const done = userProgress.beginnerCompleted && userProgress.beginnerCompleted.includes(step.id);
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border);">
                <span>${idx+1}. ${step.title}</span>
                <span>${done ? '✅' : '⬜'}</span>
            </div>
        `;
    });
    html += `<button class="btn-secondary" onclick="startBeginner()" style="margin-top:12px;">Начать начальный курс</button></div>`;

    // Уровни TOPIK
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

function startBeginner() {
    let startIdx = 0;
    for (let i = 0; i < BEGINNER_PLAN.steps.length; i++) {
        if (!userProgress.beginnerCompleted || !userProgress.beginnerCompleted.includes(BEGINNER_PLAN.steps[i].id)) {
            startIdx = i;
            break;
        }
    }
    userProgress.beginnerStep = startIdx;
    saveProgress();
    showBeginnerStep();
}

function showBeginnerStep() {
    const stepIndex = userProgress.beginnerStep || 0;
    const steps = BEGINNER_PLAN.steps;
    if (stepIndex >= steps.length) {
        alert('🎉 Поздравляем! Вы завершили начальный курс!');
        renderPlan();
        return;
    }
    const step = steps[stepIndex];
    const total = steps.length;
    const isCompleted = userProgress.beginnerCompleted && userProgress.beginnerCompleted.includes(step.id);

    let html = `
        <div class="card beginner-card">
            <h2>📘 Начальный этап</h2>
            <p>Шаг ${stepIndex+1} из ${total}</p>
            <h3>${step.title}</h3>
            <p>${step.description}</p>
            <div style="margin:16px 0;">
    `;

    if (step.content) {
        step.content.forEach(block => {
            if (block.type === 'consonants' || block.type === 'vowels') {
                const label = block.type === 'consonants' ? 'Согласные' : 'Гласные';
                html += `<p><strong>${label}:</strong></p><div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center;">`;
                block.letters.forEach(letter => {
                    html += `<button class="letter-btn" onclick="playAudio('${letter}')" style="font-size:2rem; padding:8px 16px; border-radius:12px; border:1px solid var(--border); background:var(--card-bg); cursor:pointer;">${letter}</button>`;
                });
                html += `</div><p style="font-size:0.8rem; color:var(--text-secondary);">Нажмите на букву, чтобы услышать произношение.</p>`;
            } else if (block.type === 'numbers') {
                html += `<p><strong>Числа:</strong></p><div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center;">`;
                block.numbers.forEach(num => {
                    html += `<button class="letter-btn" onclick="playAudio('${num}')" style="font-size:1.5rem; padding:8px 16px; border-radius:12px; border:1px solid var(--border); background:var(--card-bg); cursor:pointer;">${num}</button>`;
                });
                html += `</div><p style="font-size:0.8rem; color:var(--text-secondary);">Нажмите на число, чтобы услышать произношение.</p>`;
            } else if (block.type === 'phrases') {
                html += `<p><strong>Фразы:</strong></p><div class="phrases-list">`;
                block.phrases.forEach(phrase => {
                    html += `<div class="phrase-item">
                        <span class="ko">${phrase.korean}</span>
                        <span class="ru">${phrase.russian}</span>
                        <button class="btn-secondary" onclick="playAudio('${phrase.korean}')">🔊</button>
                    </div>`;
                });
                html += `</div>`;
            } else if (block.type === 'explanation') {
                html += `<div style="background:var(--secondary-bg); padding:16px; border-radius:12px; margin:8px 0;">${block.text}</div>`;
            }
        });
    }

    if (step.exercise) {
        const ex = step.exercise;
        html += `<div style="margin-top:20px; border-top:1px solid var(--border); padding-top:16px;">`;
        html += `<h4>Упражнение:</h4><p>${ex.question}</p>`;
        if (ex.type === 'choose') {
            html += `<div class="option-grid">`;
            ex.options.forEach((opt, idx) => {
                html += `<button class="option-btn" onclick="checkBeginnerExercise(${idx}, '${step.id}')">${opt}</button>`;
            });
            html += `</div>`;
            html += `<div id="beginner-feedback-${step.id}"></div>`;
        } else if (ex.type === 'build_syllable') {
            html += `<input type="text" id="beginner-input-${step.id}" placeholder="Введите слог" style="width:100%; padding:10px; border-radius:16px; border:1px solid var(--border); background:var(--input-bg); color:var(--text); margin:8px 0;">`;
            html += `<button class="btn-primary" onclick="checkBeginnerBuild('${step.id}', '${ex.correct}')">Проверить</button>`;
            html += `<div id="beginner-feedback-${step.id}"></div>`;
        }
        html += `</div>`;
    }

    html += `
            </div>
            <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
                <button class="btn-primary" onclick="beginnerNext()" ${isCompleted ? '' : 'disabled'}>➡️ Дальше</button>
                <button class="btn-secondary" onclick="navigateTo('plan')">Назад к плану</button>
            </div>
            ${isCompleted ? '<p style="color:green;">✅ Шаг пройден!</p>' : '<p style="color:orange;">Выполните упражнение, чтобы перейти дальше.</p>'}
        </div>
    `;
    mainEl.innerHTML = html;
}

function checkBeginnerExercise(selected, stepId) {
    const step = BEGINNER_PLAN.steps.find(s => s.id === stepId);
    if (!step || !step.exercise) return;
    const correct = step.exercise.correct;
    const fb = document.getElementById(`beginner-feedback-${stepId}`);
    if (selected === correct) {
        fb.innerHTML = '<span style="color:green;">✅ Правильно! +1 ☕</span>';
        if (!userProgress.beginnerCompleted) userProgress.beginnerCompleted = [];
        if (!userProgress.beginnerCompleted.includes(stepId)) {
            userProgress.beginnerCompleted.push(stepId);
            userProgress.coins = (userProgress.coins || 0) + 1;
            saveProgress();
            const nextBtn = document.querySelector('.beginner-card .btn-primary');
            if (nextBtn) nextBtn.disabled = false;
        }
    } else {
        fb.innerHTML = '<span style="color:red;">❌ Неверно, попробуйте снова.</span>';
    }
}

function checkBeginnerBuild(stepId, correct) {
    const input = document.getElementById(`beginner-input-${stepId}`);
    if (!input) return;
    const answer = input.value.trim();
    const fb = document.getElementById(`beginner-feedback-${stepId}`);
    if (answer === correct) {
        fb.innerHTML = '<span style="color:green;">✅ Правильно! +1 ☕</span>';
        if (!userProgress.beginnerCompleted) userProgress.beginnerCompleted = [];
        if (!userProgress.beginnerCompleted.includes(stepId)) {
            userProgress.beginnerCompleted.push(stepId);
            userProgress.coins = (userProgress.coins || 0) + 1;
            saveProgress();
            const nextBtn = document.querySelector('.beginner-card .btn-primary');
            if (nextBtn) nextBtn.disabled = false;
        }
    } else {
        fb.innerHTML = `<span style="color:red;">❌ Неверно. Правильный ответ: ${correct}</span>`;
    }
}

function beginnerNext() {
    const currentIdx = userProgress.beginnerStep || 0;
    if (currentIdx < BEGINNER_PLAN.steps.length - 1) {
        userProgress.beginnerStep = currentIdx + 1;
        saveProgress();
        showBeginnerStep();
    } else {
        alert('🎉 Вы завершили все шаги начального курса!');
        renderPlan();
    }
}

// ----- План уровня (список разделов) -----
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
        <button class="btn-secondary" onclick="navigateTo('plan')">Назад к плану</button>
    `;
    mainEl.innerHTML = html;
}

// ----- ЧТЕНИЕ -----
function openReadingSection() {
    const level = LEVELS.find(l => l.id === currentLevelId);
    if (!level) return;
    readingItems = level.reading;
    const progress = userProgress.readingProgress?.[currentLevelId] || { index: 0, completed: [], skipped: [] };
    currentIndex = progress.index || 0;
    if (currentIndex >= readingItems.length) currentIndex = readingItems.length - 1;
    navigateTo('reading');
}

function renderReading() {
    if (!readingItems || readingItems.length === 0) {
        mainEl.innerHTML = `<div class="card"><h2>Нет предложений</h2><button class="btn-primary" onclick="navigateTo('home')">Назад</button></div>`;
        return;
    }
    const item = readingItems[currentIndex];
    const total = readingItems.length;
    const progress = userProgress.readingProgress?.[currentLevelId] || { index: 0, completed: [], skipped: [] };
    const isCompleted = progress.completed && progress.completed.includes(currentIndex);
    const isSkipped = progress.skipped && progress.skipped.includes(currentIndex);

    let html = `
        <div class="card">
            <h2>📖 Чтение (${currentLevelId})</h2>
            <p>Предложение ${currentIndex+1} из ${total}</p>
            <div class="reading-text">${item.korean}</div>
            <button class="btn-secondary audio-play-btn" onclick="playAudio('${item.korean}')">🔊 Прослушать</button>
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

// ----- АУДИРОВАНИЕ -----
function openAudioSection() {
    const level = LEVELS.find(l => l.id === currentLevelId);
    if (!level) return;
    audioItems = level.audio;
    const progress = userProgress.audioProgress?.[currentLevelId] || { index: 0, completed: [], skipped: [] };
    currentIndex = progress.index || 0;
    if (currentIndex >= audioItems.length) currentIndex = audioItems.length - 1;
    navigateTo('audio');
}

function renderAudio() {
    if (!audioItems || audioItems.length === 0) {
        mainEl.innerHTML = `<div class="card"><h2>Нет слов</h2><button class="btn-primary" onclick="navigateTo('home')">Назад</button></div>`;
        return;
    }
    const item = audioItems[currentIndex];
    const total = audioItems.length;
    const progress = userProgress.audioProgress?.[currentLevelId] || { index: 0, completed: [], skipped: [] };
    const isCompleted = progress.completed && progress.completed.includes(currentIndex);
    const isSkipped = progress.skipped && progress.skipped.includes(currentIndex);

    let html = `
        <div class="card">
            <h2>🎧 Аудирование (${currentLevelId})</h2>
            <p>Слово ${currentIndex+1} из ${total}</p>
            <div style="font-size:2rem; margin:12px 0;">🔊</div>
            <button class="btn-secondary audio-play-btn" onclick="playAudio('${item.word}')">▶ Прослушать</button>
            <div id="translation-display" style="display:none; background:#f0f8ff; padding:12px; border-radius:16px; margin:8px 0;">
                <strong>Перевод:</strong> ${item.translation}
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

// ----- ГРАММАТИКА -----
function openGrammarSection() {
    const level = LEVELS.find(l => l.id === currentLevelId);
    if (!level) return;
    grammarItems = level.grammar;
    const progress = userProgress.grammarProgress?.[currentLevelId] || { ruleIndex: 0, exerciseIndex: 0, completed: [], skipped: [] };
    currentIndex = progress.ruleIndex || 0;
    if (currentIndex >= grammarItems.length) currentIndex = grammarItems.length - 1;
    navigateTo('grammar');
}

function renderGrammar() {
    if (!grammarItems || grammarItems.length === 0) {
        mainEl.innerHTML = `<div class="card"><h2>Нет правил</h2><button class="btn-primary" onclick="navigateTo('home')">Назад</button></div>`;
        return;
    }
    const rule = grammarItems[currentIndex];
    const total = grammarItems.length;
    const progress = userProgress.grammarProgress?.[currentLevelId] || { ruleIndex: 0, exerciseIndex: 0, completed: [], skipped: [] };
    const isCompleted = progress.completed && progress.completed.includes(currentIndex);
    const isSkipped = progress.skipped && progress.skipped.includes(currentIndex);

    let html = `
        <div class="card">
            <h2>📝 Грамматика (${currentLevelId})</h2>
            <p>Правило ${currentIndex+1} из ${total}</p>
            <h3>${rule.title}</h3>
            <p>${rule.description}</p>
            <div style="background:var(--secondary-bg); padding:12px; border-radius:16px; margin:8px 0;">
                <strong>Примеры:</strong>
                <ul>
                    ${rule.examples.map(ex => `<li>${ex}</li>`).join('')}
                </ul>
            </div>
            ${rule.exercises && rule.exercises.length > 0 ? `
                <div style="margin-top:16px;">
                    <h4>Упражнение:</h4>
                    <p>${rule.exercises[0].question}</p>
                    <input type="text" id="grammar-answer" placeholder="Введите ответ" style="width:100%; padding:10px; border-radius:16px; border:1px solid var(--border); background:var(--input-bg); color:var(--text); margin:8px 0;">
                    <button class="btn-primary" onclick="checkGrammarAnswer('${rule.exercises[0].correct}')">Проверить</button>
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
                <span>Статус: ${isCompleted ? '✅ Пройдено' : isSkipped ? '⏭ Пропущено' : '⬜ Не пройдено'}</span>
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
        userProgress.coins = (userProgress.coins || 0) + 1;
        saveProgress();
    } else {
        fb.innerHTML = `<span style="color:red;">❌ Неверно. Правильный ответ: ${correct}</span>`;
    }
}

function grammarComplete() {
    const progress = userProgress.grammarProgress?.[currentLevelId] || { ruleIndex: 0, exerciseIndex: 0, completed: [], skipped: [] };
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
        if (!userProgress.grammarProgress) userProgress.grammarProgress = {};
        userProgress.grammarProgress[currentLevelId] = progress;
        saveProgress();
        renderGrammar();
    }
}

// ----- ОЗВУЧКА (женский голос) -----
function playAudio(text) {
    if (!window.speechSynthesis) {
        alert('Ваш браузер не поддерживает синтез речи.');
        return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = parseFloat(localStorage.getItem('horileo_speed')) || 0.9;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    for (const v of voices) {
        if (v.lang.startsWith('ko')) {
            const name = v.name.toLowerCase();
            if (name.includes('female') || name.includes('google') || name.includes('여성')) {
                selectedVoice = v;
                break;
            }
        }
    }
    if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('ko'));
    }
    if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Выбран голос:', selectedVoice.name);
    }
    window.speechSynthesis.speak(utterance);
}

// ----- СЛОВАРЬ -----
function renderDictionary() {
    const levelWords = WORDS.filter(w => w.levelId === currentLevelId);
    let html = `<h2>📖 Словарь (${currentLevelId})</h2>`;
    html += `<p>Всего слов: ${levelWords.length}</p>`;
    html += `<button class="btn-secondary" onclick="startRepetition()">🔁 Повторение карточек</button>`;
    html += `<div id="dict-list">`;
    levelWords.slice(0, 100).forEach(item => {
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

// ----- КАРТОЧКИ ПОВТОРЕНИЯ -----
let repetitionQueue = [];
let currentRepIndex = 0;
let repetitionMode = 'ko->ru';

function startRepetition() {
    const levelWords = WORDS.filter(w => w.levelId === currentLevelId);
    const unlearned = levelWords.filter(w => !(userProgress.learnedWords?.[w.word]));
    let pool = unlearned.length > 0 ? unlearned : levelWords;
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
        feedback.innerHTML = '<span style="color:green;">✅ Правильно!</span>';
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

// ----- ПРОФИЛЬ -----
function renderProfile() {
    const totalWords = WORDS.filter(w => w.levelId === currentLevelId).length;
    const learnedWords = Object.keys(userProgress.learnedWords || {}).filter(w => WORDS.find(word => word.word === w && word.levelId === currentLevelId)).length;
    const coins = userProgress.coins || 0;
    const beginnerProgress = userProgress.beginnerCompleted ? userProgress.beginnerCompleted.length : 0;
    const totalBeginner = BEGINNER_PLAN.steps.length;
    let level = 'Начальный';
    if (beginnerProgress >= totalBeginner) level = 'TOPIK 1';
    if (learnedWords > 30) level = 'TOPIK 2';
    if (learnedWords > 60) level = 'TOPIK 3';

    const html = `
        <div class="card">
            <h2>👤 Мой прогресс</h2>
            <p>🐯 Начальный курс: ${beginnerProgress}/${totalBeginner} шагов</p>
            <p>📖 Выучено слов (${currentLevelId}): ${learnedWords}/${totalWords}</p>
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
        userProgress = { currentLevel: 'topik1', coins: 0, learnedWords: {}, readingProgress: {}, audioProgress: {}, grammarProgress: {}, beginnerCompleted: [], totalLessons: 0, wordsLearned: 0 };
        saveProgress();
        navigateTo('home');
    }
}

// ----- Утилиты -----
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ----- ТЕМА -----
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('horileo_theme', isDark ? 'dark' : 'light');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}

function loadTheme() {
    const theme = localStorage.getItem('horileo_theme');
    const btn = document.getElementById('theme-toggle');
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        if (btn) btn.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-theme');
        if (btn) btn.textContent = '🌙';
    }
}

// ----- ИНИЦИАЛИЗАЦИЯ -----
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    loadProgress();
    navigateTo('home');
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
});

// Активация Speech для iOS
document.addEventListener('touchstart', () => {
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
}, { once: true });
