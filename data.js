// data.js – все данные для трёх уровней

// ---------- Генерация плана (3 уровня по 3 недели каждый) ----------
const LEVELS = [];

function buildLevel(levelId, title, desc, startWeek, topics, wordList) {
    const weeks = [];
    for (let w = 0; w < 3; w++) { // 3 недели
        const days = [];
        for (let d = 0; d < 7; d++) { // 7 дней
            const dayTopics = topics.slice((w * 7 + d) % topics.length, (w * 7 + d) % topics.length + 1);
            const lessons = [
                {
                    id: `${levelId}_w${w}_d${d}_l1`,
                    title: 'Лексика',
                    tasks: [
                        { type: 'choose', question: `Как переводится "${wordList[(w*7+d) % wordList.length]?.word || '안녕'}"?`, options: ['Привет', 'Пока', 'Спасибо'], correct: 0, word: wordList[(w*7+d) % wordList.length]?.word || '안녕' }
                    ]
                },
                {
                    id: `${levelId}_w${w}_d${d}_l2`,
                    title: 'Грамматика',
                    tasks: [
                        { type: 'fill', question: 'Вставь частицу: 학교___ 가요.', options: ['에', '에서', '을'], correct: 0 }
                    ]
                },
                {
                    id: `${levelId}_w${w}_d${d}_l3`,
                    title: 'Аудирование',
                    tasks: [
                        { type: 'audio', question: 'Прослушай и выбери перевод', audioText: '안녕하세요', options: ['Здравствуйте', 'До свидания', 'Спасибо'], correct: 0 }
                    ]
                }
            ];
            days.push({ day: d+1, title: `День ${d+1}`, topics: dayTopics, lessons: lessons });
        }
        weeks.push({ week: w+1, title: `Неделя ${w+1}`, days: days });
    }
    return { id: levelId, title, description: desc, weeks: weeks };
}

// Темы для каждого уровня
const topicsTopik1 = ['Приветствия', 'Семья', 'Числа', 'Еда', 'Покупки', 'Время', 'Погода'];
const topicsTopik2 = ['Дом', 'Одежда', 'Транспорт', 'Хобби', 'Работа', 'Здоровье', 'Путешествия'];
const topicsTopik3 = ['Прилагательные', 'Глаголы', 'Прошедшее время', 'Будущее время', 'Вежливость', 'Связки', 'Повторение'];

// Базовый словарь (300+ слов с категориями и переводом)
const DICTIONARY = [
    // TOPIK 1 (база)
    { word: '안녕하세요', translation: 'Здравствуйте', category: 'Приветствия', levelId: 'topik1', learned: false },
    { word: '감사합니다', translation: 'Спасибо', category: 'Приветствия', levelId: 'topik1', learned: false },
    { word: '죄송합니다', translation: 'Извините', category: 'Приветствия', levelId: 'topik1', learned: false },
    { word: '네', translation: 'Да', category: 'Приветствия', levelId: 'topik1', learned: false },
    { word: '아니요', translation: 'Нет', category: 'Приветствия', levelId: 'topik1', learned: false },
    { word: '가족', translation: 'Семья', category: 'Семья', levelId: 'topik1', learned: false },
    { word: '어머니', translation: 'Мама', category: 'Семья', levelId: 'topik1', learned: false },
    { word: '아버지', translation: 'Папа', category: 'Семья', levelId: 'topik1', learned: false },
    { word: '하나', translation: 'Один', category: 'Числа', levelId: 'topik1', learned: false },
    { word: '둘', translation: 'Два', category: 'Числа', levelId: 'topik1', learned: false },
    { word: '셋', translation: 'Три', category: 'Числа', levelId: 'topik1', learned: false },
    { word: '밥', translation: 'Рис (еда)', category: 'Еда', levelId: 'topik1', learned: false },
    { word: '물', translation: 'Вода', category: 'Еда', levelId: 'topik1', learned: false },
    { word: '김치', translation: 'Кимчи', category: 'Еда', levelId: 'topik1', learned: false },
    { word: '가게', translation: 'Магазин', category: 'Покупки', levelId: 'topik1', learned: false },
    { word: '시장', translation: 'Рынок', category: 'Покупки', levelId: 'topik1', learned: false },
    { word: '오늘', translation: 'Сегодня', category: 'Время', levelId: 'topik1', learned: false },
    { word: '내일', translation: 'Завтра', category: 'Время', levelId: 'topik1', learned: false },
    { word: '날씨', translation: 'Погода', category: 'Погода', levelId: 'topik1', learned: false },
    { word: '덥다', translation: 'Жарко', category: 'Погода', levelId: 'topik1', learned: false },
    // TOPIK 2
    { word: '집', translation: 'Дом', category: 'Дом', levelId: 'topik2', learned: false },
    { word: '방', translation: 'Комната', category: 'Дом', levelId: 'topik2', learned: false },
    { word: '옷', translation: 'Одежда', category: 'Одежда', levelId: 'topik2', learned: false },
    { word: '바지', translation: 'Брюки', category: 'Одежда', levelId: 'topik2', learned: false },
    { word: '버스', translation: 'Автобус', category: 'Транспорт', levelId: 'topik2', learned: false },
    { word: '지하철', translation: 'Метро', category: 'Транспорт', levelId: 'topik2', learned: false },
    { word: '취미', translation: 'Хобби', category: 'Хобби', levelId: 'topik2', learned: false },
    { word: '운동', translation: 'Спорт', category: 'Хобби', levelId: 'topik2', learned: false },
    { word: '직장', translation: 'Место работы', category: 'Работа', levelId: 'topik2', learned: false },
    { word: '회사', translation: 'Компания', category: 'Работа', levelId: 'topik2', learned: false },
    { word: '아프다', translation: 'Болеть', category: 'Здоровье', levelId: 'topik2', learned: false },
    { word: '병원', translation: 'Больница', category: 'Здоровье', levelId: 'topik2', learned: false },
    { word: '여행', translation: 'Путешествие', category: 'Путешествия', levelId: 'topik2', learned: false },
    { word: '호텔', translation: 'Отель', category: 'Путешествия', levelId: 'topik2', learned: false },
    // TOPIK 3
    { word: '크다', translation: 'Большой', category: 'Прилагательные', levelId: 'topik3', learned: false },
    { word: '작다', translation: 'Маленький', category: 'Прилагательные', levelId: 'topik3', learned: false },
    { word: '예쁘다', translation: 'Красивый', category: 'Прилагательные', levelId: 'topik3', learned: false },
    { word: '가다', translation: 'Идти', category: 'Глаголы', levelId: 'topik3', learned: false },
    { word: '오다', translation: 'Приходить', category: 'Глаголы', levelId: 'topik3', learned: false },
    { word: '먹다', translation: 'Есть', category: 'Глаголы', levelId: 'topik3', learned: false },
    { word: '했어요', translation: 'Сделал (прош.)', category: 'Прошедшее время', levelId: 'topik3', learned: false },
    { word: '먹었어요', translation: 'Поел (прош.)', category: 'Прошедшее время', levelId: 'topik3', learned: false },
    { word: '할 거예요', translation: 'Сделаю (буд.)', category: 'Будущее время', levelId: 'topik3', learned: false },
    { word: '갈 거예요', translation: 'Пойду (буд.)', category: 'Будущее время', levelId: 'topik3', learned: false },
    { word: '입니다', translation: 'Является (форм.)', category: 'Вежливость', levelId: 'topik3', learned: false },
    { word: '그리고', translation: 'И (связка)', category: 'Связки', levelId: 'topik3', learned: false },
    { word: '그래서', translation: 'Поэтому', category: 'Связки', levelId: 'topik3', learned: false },
    // ... еще более 250 слов можно добавить, но для примера хватит
];

// Строим уровни
LEVELS.push(buildLevel('topik1', 'TOPIK 1 (Начальный)', 'Алфавит, базовая грамматика, повседневная лексика.', 1, topicsTopik1, DICTIONARY.filter(w => w.levelId === 'topik1')));
LEVELS.push(buildLevel('topik2', 'TOPIK 2 (Средний)', 'Сложные времена, связки, общение на бытовые темы.', 4, topicsTopik2, DICTIONARY.filter(w => w.levelId === 'topik2')));
LEVELS.push(buildLevel('topik3', 'TOPIK 3 (Продвинутый)', 'Страдательный залог, косвенная речь, официальное общение.', 7, topicsTopik3, DICTIONARY.filter(w => w.levelId === 'topik3')));
