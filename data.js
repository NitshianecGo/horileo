// data.js – все данные для обучения

const LEVELS = [
    {
        id: 0,
        title: 'Приручи хангыль',
        description: 'Изучим согласные, гласные и правила чтения',
        lessons: [
            {
                id: 'l0_1',
                title: 'Согласные (ㄱ,ㄴ,ㄷ...)',
                tasks: [
                    { type: 'choose', question: 'Как читается буква ㄱ?', options: ['g/k', 'n', 'd'], correct: 0 },
                    { type: 'choose', question: 'Как читается буква ㄴ?', options: ['g', 'n', 'm'], correct: 1 },
                    { type: 'audio', question: 'Послушай и выбери правильное чтение', audioText: '가', options: ['ga', 'na', 'da'], correct: 0 }
                ]
            },
            {
                id: 'l0_2',
                title: 'Гласные (ㅏ,ㅓ,ㅗ...)',
                tasks: [
                    { type: 'choose', question: 'Как читается ㅏ?', options: ['a', 'o', 'u'], correct: 0 },
                    { type: 'choose', question: 'Как читается ㅓ?', options: ['a', 'eo', 'i'], correct: 1 }
                ]
            }
        ]
    },
    {
        id: 1,
        title: 'Первые шаги',
        description: 'Приветствия, частицы, окончания',
        lessons: [
            {
                id: 'l1_1',
                title: 'Приветствия',
                tasks: [
                    { type: 'choose', question: 'Как сказать "Здравствуйте" (формально)?', options: ['안녕', '안녕하세요', '안녕히가세요'], correct: 1 },
                    { type: 'order', question: 'Составь предложение "Я иду в школу" (나는 학교에 간다)', words: ['나는', '학교에', '간다'], correct: ['나는','학교에','간다'] },
                    { type: 'fill', question: 'Вставь частицу: 나는 학교___ 가요.', options: ['에', '에서', '을'], correct: 0 }
                ]
            }
        ]
    },
    // ... можно добавить до 8 этапов, но для демонстрации оставим два
];

// Словарь (изначально пустой, но добавим стартовые слова)
const DICTIONARY = [
    { word: '안녕하세요', translation: 'Здравствуйте', level: 1, learned: false },
    { word: '학교', translation: 'школа', level: 1, learned: false },
    { word: '가다', translation: 'идти', level: 1, learned: false },
];

// Состояние прогресса пользователя (будет храниться в localStorage)
const DEFAULT_PROGRESS = {
    currentLevel: 0,
    currentLesson: 0,
    currentTask: 0,
    completedTasks: [], // id заданий
    coins: 0,
    wordsLearned: 0,
    totalLessonsCompleted: 0,
    studyTime: 0, // в минутах
};
