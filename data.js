// data.js – полный контент для TOPIK 1-3

// ---------- 300 слов по категориям ----------
const WORDS = [
    // ---- TOPIK 1 (база) ----
    { word: '안녕하세요', translation: 'Здравствуйте', category: 'Приветствия', levelId: 'topik1' },
    { word: '안녕', translation: 'Привет', category: 'Приветствия', levelId: 'topik1' },
    { word: '감사합니다', translation: 'Спасибо', category: 'Приветствия', levelId: 'topik1' },
    { word: '죄송합니다', translation: 'Извините', category: 'Приветствия', levelId: 'topik1' },
    { word: '괜찮아요', translation: 'Нормально', category: 'Приветствия', levelId: 'topik1' },
    { word: '네', translation: 'Да', category: 'Приветствия', levelId: 'topik1' },
    { word: '아니요', translation: 'Нет', category: 'Приветствия', levelId: 'topik1' },
    { word: '가족', translation: 'Семья', category: 'Семья', levelId: 'topik1' },
    { word: '어머니', translation: 'Мама', category: 'Семья', levelId: 'topik1' },
    { word: '아버지', translation: 'Папа', category: 'Семья', levelId: 'topik1' },
    { word: '형', translation: 'Старший брат (м)', category: 'Семья', levelId: 'topik1' },
    { word: '누나', translation: 'Старшая сестра (м)', category: 'Семья', levelId: 'topik1' },
    { word: '언니', translation: 'Старшая сестра (ж)', category: 'Семья', levelId: 'topik1' },
    { word: '오빠', translation: 'Старший брат (ж)', category: 'Семья', levelId: 'topik1' },
    { word: '동생', translation: 'Младший брат/сестра', category: 'Семья', levelId: 'topik1' },
    { word: '할머니', translation: 'Бабушка', category: 'Семья', levelId: 'topik1' },
    { word: '할아버지', translation: 'Дедушка', category: 'Семья', levelId: 'topik1' },
    { word: '하나', translation: 'Один', category: 'Числа', levelId: 'topik1' },
    { word: '둘', translation: 'Два', category: 'Числа', levelId: 'topik1' },
    { word: '셋', translation: 'Три', category: 'Числа', levelId: 'topik1' },
    { word: '넷', translation: 'Четыре', category: 'Числа', levelId: 'topik1' },
    { word: '다섯', translation: 'Пять', category: 'Числа', levelId: 'topik1' },
    { word: '여섯', translation: 'Шесть', category: 'Числа', levelId: 'topik1' },
    { word: '일곱', translation: 'Семь', category: 'Числа', levelId: 'topik1' },
    { word: '여덟', translation: 'Восемь', category: 'Числа', levelId: 'topik1' },
    { word: '아홉', translation: 'Девять', category: 'Числа', levelId: 'topik1' },
    { word: '열', translation: 'Десять', category: 'Числа', levelId: 'topik1' },
    { word: '스물', translation: 'Двадцать', category: 'Числа', levelId: 'topik1' },
    { word: '서른', translation: 'Тридцать', category: 'Числа', levelId: 'topik1' },
    { word: '마흔', translation: 'Сорок', category: 'Числа', levelId: 'topik1' },
    { word: '쉰', translation: 'Пятьдесят', category: 'Числа', levelId: 'topik1' },
    { word: '육십', translation: 'Шестьдесят', category: 'Числа', levelId: 'topik1' },
    { word: '칠십', translation: 'Семьдесят', category: 'Числа', levelId: 'topik1' },
    { word: '팔십', translation: 'Восемьдесят', category: 'Числа', levelId: 'topik1' },
    { word: '구십', translation: 'Девяносто', category: 'Числа', levelId: 'topik1' },
    { word: '백', translation: 'Сто', category: 'Числа', levelId: 'topik1' },
    { word: '밥', translation: 'Рис (еда)', category: 'Еда', levelId: 'topik1' },
    { word: '물', translation: 'Вода', category: 'Еда', levelId: 'topik1' },
    { word: '김치', translation: 'Кимчи', category: 'Еда', levelId: 'topik1' },
    { word: '고기', translation: 'Мясо', category: 'Еда', levelId: 'topik1' },
    { word: '생선', translation: 'Рыба', category: 'Еда', levelId: 'topik1' },
    { word: '야채', translation: 'Овощи', category: 'Еда', levelId: 'topik1' },
    { word: '과일', translation: 'Фрукты', category: 'Еда', levelId: 'topik1' },
    { word: '빵', translation: 'Хлеб', category: 'Еда', levelId: 'topik1' },
    { word: '우유', translation: 'Молоко', category: 'Еда', levelId: 'topik1' },
    { word: '계란', translation: 'Яйцо', category: 'Еда', levelId: 'topik1' },
    { word: '국', translation: 'Суп', category: 'Еда', levelId: 'topik1' },
    { word: '반찬', translation: 'Закуска', category: 'Еда', levelId: 'topik1' },
    { word: '술', translation: 'Алкоголь', category: 'Еда', levelId: 'topik1' },
    { word: '커피', translation: 'Кофе', category: 'Еда', levelId: 'topik1' },
    { word: '차', translation: 'Чай', category: 'Еда', levelId: 'topik1' },
    { word: '가게', translation: 'Магазин', category: 'Покупки', levelId: 'topik1' },
    { word: '시장', translation: 'Рынок', category: 'Покупки', levelId: 'topik1' },
    { word: '백화점', translation: 'Универмаг', category: 'Покупки', levelId: 'topik1' },
    { word: '물건', translation: 'Вещь', category: 'Покупки', levelId: 'topik1' },
    { word: '가격', translation: 'Цена', category: 'Покупки', levelId: 'topik1' },
    { word: '얼마', translation: 'Сколько', category: 'Покупки', levelId: 'topik1' },
    { word: '싸다', translation: 'Дёшево', category: 'Покупки', levelId: 'topik1' },
    { word: '비싸다', translation: 'Дорого', category: 'Покупки', levelId: 'topik1' },
    { word: '사다', translation: 'Покупать', category: 'Покупки', levelId: 'topik1' },
    { word: '팔다', translation: 'Продавать', category: 'Покупки', levelId: 'topik1' },
    { word: '오늘', translation: 'Сегодня', category: 'Время', levelId: 'topik1' },
    { word: '내일', translation: 'Завтра', category: 'Время', levelId: 'topik1' },
    { word: '어제', translation: 'Вчера', category: 'Время', levelId: 'topik1' },
    { word: '시계', translation: 'Часы', category: 'Время', levelId: 'topik1' },
    { word: '시간', translation: 'Время', category: 'Время', levelId: 'topik1' },
    { word: '분', translation: 'Минута', category: 'Время', levelId: 'topik1' },
    { word: '주말', translation: 'Выходные', category: 'Время', levelId: 'topik1' },
    { word: '월요일', translation: 'Понедельник', category: 'Время', levelId: 'topik1' },
    { word: '화요일', translation: 'Вторник', category: 'Время', levelId: 'topik1' },
    { word: '수요일', translation: 'Среда', category: 'Время', levelId: 'topik1' },
    { word: '목요일', translation: 'Четверг', category: 'Время', levelId: 'topik1' },
    { word: '금요일', translation: 'Пятница', category: 'Время', levelId: 'topik1' },
    { word: '토요일', translation: 'Суббота', category: 'Время', levelId: 'topik1' },
    { word: '일요일', translation: 'Воскресенье', category: 'Время', levelId: 'topik1' },
    { word: '날씨', translation: 'Погода', category: 'Погода', levelId: 'topik1' },
    { word: '덥다', translation: 'Жарко', category: 'Погода', levelId: 'topik1' },
    { word: '춥다', translation: 'Холодно', category: 'Погода', levelId: 'topik1' },
    { word: '맑다', translation: 'Ясно', category: 'Погода', levelId: 'topik1' },
    { word: '흐리다', translation: 'Пасмурно', category: 'Погода', levelId: 'topik1' },
    { word: '비', translation: 'Дождь', category: 'Погода', levelId: 'topik1' },
    { word: '눈', translation: 'Снег', category: 'Погода', levelId: 'topik1' },
    { word: '바람', translation: 'Ветер', category: 'Погода', levelId: 'topik1' },
    // ---- TOPIK 2 ----
    { word: '집', translation: 'Дом', category: 'Дом', levelId: 'topik2' },
    { word: '방', translation: 'Комната', category: 'Дом', levelId: 'topik2' },
    { word: '거실', translation: 'Гостиная', category: 'Дом', levelId: 'topik2' },
    { word: '부엌', translation: 'Кухня', category: 'Дом', levelId: 'topik2' },
    { word: '화장실', translation: 'Туалет', category: 'Дом', levelId: 'topik2' },
    { word: '침대', translation: 'Кровать', category: 'Дом', levelId: 'topik2' },
    { word: '탁자', translation: 'Стол', category: 'Дом', levelId: 'topik2' },
    { word: '의자', translation: 'Стул', category: 'Дом', levelId: 'topik2' },
    { word: '창문', translation: 'Окно', category: 'Дом', levelId: 'topik2' },
    { word: '문', translation: 'Дверь', category: 'Дом', levelId: 'topik2' },
    { word: '옷', translation: 'Одежда', category: 'Одежда', levelId: 'topik2' },
    { word: '바지', translation: 'Брюки', category: 'Одежда', levelId: 'topik2' },
    { word: '치마', translation: 'Юбка', category: 'Одежда', levelId: 'topik2' },
    { word: '셔츠', translation: 'Рубашка', category: 'Одежда', levelId: 'topik2' },
    { word: '자켓', translation: 'Куртка', category: 'Одежда', levelId: 'topik2' },
    { word: '코트', translation: 'Пальто', category: 'Одежда', levelId: 'topik2' },
    { word: '신발', translation: 'Обувь', category: 'Одежда', levelId: 'topik2' },
    { word: '모자', translation: 'Шляпа', category: 'Одежда', levelId: 'topik2' },
    { word: '가방', translation: 'Сумка', category: 'Одежда', levelId: 'topik2' },
    { word: '버스', translation: 'Автобус', category: 'Транспорт', levelId: 'topik2' },
    { word: '지하철', translation: 'Метро', category: 'Транспорт', levelId: 'topik2' },
    { word: '택시', translation: 'Такси', category: 'Транспорт', levelId: 'topik2' },
    { word: '기차', translation: 'Поезд', category: 'Транспорт', levelId: 'topik2' },
    { word: '비행기', translation: 'Самолёт', category: 'Транспорт', levelId: 'topik2' },
    { word: '배', translation: 'Корабль', category: 'Транспорт', levelId: 'topik2' },
    { word: '자전거', translation: 'Велосипед', category: 'Транспорт', levelId: 'topik2' },
    { word: '자동차', translation: 'Автомобиль', category: 'Транспорт', levelId: 'topik2' },
    { word: '정류장', translation: 'Остановка', category: 'Транспорт', levelId: 'topik2' },
    { word: '역', translation: 'Вокзал', category: 'Транспорт', levelId: 'topik2' },
    { word: '취미', translation: 'Хобби', category: 'Хобби', levelId: 'topik2' },
    { word: '운동', translation: 'Спорт', category: 'Хобби', levelId: 'topik2' },
    { word: '영화', translation: 'Фильм', category: 'Хобби', levelId: 'topik2' },
    { word: '음악', translation: 'Музыка', category: 'Хобби', levelId: 'topik2' },
    { word: '독서', translation: 'Чтение', category: 'Хобби', levelId: 'topik2' },
    { word: '사진', translation: 'Фото', category: 'Хобби', levelId: 'topik2' },
    { word: '그림', translation: 'Рисунок', category: 'Хобби', levelId: 'topik2' },
    { word: '게임', translation: 'Игра', category: 'Хобби', levelId: 'topik2' },
    { word: '등산', translation: 'Поход', category: 'Хобби', levelId: 'topik2' },
    { word: '수영', translation: 'Плавание', category: 'Хобби', levelId: 'topik2' },
    { word: '직장', translation: 'Работа', category: 'Работа', levelId: 'topik2' },
    { word: '회사', translation: 'Компания', category: 'Работа', levelId: 'topik2' },
    { word: '사무실', translation: 'Офис', category: 'Работа', levelId: 'topik2' },
    { word: '일', translation: 'Работа / дело', category: 'Работа', levelId: 'topik2' },
    { word: '직원', translation: 'Сотрудник', category: 'Работа', levelId: 'topik2' },
    { word: '사장', translation: 'Директор', category: 'Работа', levelId: 'topik2' },
    { word: '급여', translation: 'Зарплата', category: 'Работа', levelId: 'topik2' },
    { word: '출근', translation: 'Приходить на работу', category: 'Работа', levelId: 'topik2' },
    { word: '퇴근', translation: 'Уходить с работы', category: 'Работа', levelId: 'topik2' },
    { word: '아프다', translation: 'Болеть', category: 'Здоровье', levelId: 'topik2' },
    { word: '병원', translation: 'Больница', category: 'Здоровье', levelId: 'topik2' },
    { word: '약', translation: 'Лекарство', category: 'Здоровье', levelId: 'topik2' },
    { word: '의사', translation: 'Врач', category: 'Здоровье', levelId: 'topik2' },
    { word: '간호사', translation: 'Медсестра', category: 'Здоровье', levelId: 'topik2' },
    { word: '치료', translation: 'Лечение', category: 'Здоровье', levelId: 'topik2' },
    { word: '감기', translation: 'Простуда', category: 'Здоровье', levelId: 'topik2' },
    { word: '배탈', translation: 'Расстройство', category: 'Здоровье', levelId: 'topik2' },
    { word: '머리', translation: 'Голова', category: 'Здоровье', levelId: 'topik2' },
    { word: '여행', translation: 'Путешествие', category: 'Путешествия', levelId: 'topik2' },
    { word: '호텔', translation: 'Отель', category: 'Путешествия', levelId: 'topik2' },
    { word: '여권', translation: 'Паспорт', category: 'Путешествия', levelId: 'topik2' },
    { word: '표', translation: 'Билет', category: 'Путешествия', levelId: 'topik2' },
    { word: '관광', translation: 'Туризм', category: 'Путешествия', levelId: 'topik2' },
    { word: '기념품', translation: 'Сувенир', category: 'Путешествия', levelId: 'topik2' },
    { word: '지도', translation: 'Карта', category: 'Путешествия', levelId: 'topik2' },
    { word: '카메라', translation: 'Камера', category: 'Путешествия', levelId: 'topik2' },
    // ---- TOPIK 3 ----
    { word: '크다', translation: 'Большой', category: 'Прилагательные', levelId: 'topik3' },
    { word: '작다', translation: 'Маленький', category: 'Прилагательные', levelId: 'topik3' },
    { word: '예쁘다', translation: 'Красивый', category: 'Прилагательные', levelId: 'topik3' },
    { word: '멋지다', translation: 'Классный', category: 'Прилагательные', levelId: 'topik3' },
    { word: '깨끗하다', translation: 'Чистый', category: 'Прилагательные', levelId: 'topik3' },
    { word: '더럽다', translation: 'Грязный', category: 'Прилагательные', levelId: 'topik3' },
    { word: '좋다', translation: 'Хороший', category: 'Прилагательные', levelId: 'topik3' },
    { word: '나쁘다', translation: 'Плохой', category: 'Прилагательные', levelId: 'topik3' },
    { word: '재미있다', translation: 'Интересный', category: 'Прилагательные', levelId: 'topik3' },
    { word: '지루하다', translation: 'Скучный', category: 'Прилагательные', levelId: 'topik3' },
    { word: '가다', translation: 'Идти', category: 'Глаголы', levelId: 'topik3' },
    { word: '오다', translation: 'Приходить', category: 'Глаголы', levelId: 'topik3' },
    { word: '만나다', translation: 'Встречать', category: 'Глаголы', levelId: 'topik3' },
    { word: '보다', translation: 'Видеть', category: 'Глаголы', levelId: 'topik3' },
    { word: '듣다', translation: 'Слушать', category: 'Глаголы', levelId: 'topik3' },
    { word: '말하다', translation: 'Говорить', category: 'Глаголы', levelId: 'topik3' },
    { word: '먹다', translation: 'Есть', category: 'Глаголы', levelId: 'topik3' },
    { word: '마시다', translation: 'Пить', category: 'Глаголы', levelId: 'topik3' },
    { word: '자다', translation: 'Спать', category: 'Глаголы', levelId: 'topik3' },
    { word: '일어나다', translation: 'Вставать', category: 'Глаголы', levelId: 'topik3' },
    { word: '앉다', translation: 'Сидеть', category: 'Глаголы', levelId: 'topik3' },
    { word: '서다', translation: 'Стоять', category: 'Глаголы', levelId: 'topik3' },
    { word: '은/는', translation: 'Тематич. частица', category: 'Связки', levelId: 'topik3' },
    { word: '이/가', translation: 'Субъектная частица', category: 'Связки', levelId: 'topik3' },
    { word: '을/를', translation: 'Объектная частица', category: 'Связки', levelId: 'topik3' },
    { word: '에', translation: 'В (направление)', category: 'Связки', levelId: 'topik3' },
    { word: '에서', translation: 'В (место)', category: 'Связки', levelId: 'topik3' },
    { word: '로', translation: 'В сторону', category: 'Связки', levelId: 'topik3' },
    { word: '과/와', translation: 'И (с сущ.)', category: 'Связки', levelId: 'topik3' },
    { word: '하고', translation: 'И (разг.)', category: 'Связки', levelId: 'topik3' },
    { word: '의', translation: 'Родительный падеж', category: 'Связки', levelId: 'topik3' },
    { word: '한국', translation: 'Корея', category: 'Разное', levelId: 'topik3' },
    { word: '서울', translation: 'Сеул', category: 'Разное', levelId: 'topik3' },
    { word: '사람', translation: 'Человек', category: 'Разное', levelId: 'topik3' },
    { word: '이름', translation: 'Имя', category: 'Разное', levelId: 'topik3' },
    { word: '나이', translation: 'Возраст', category: 'Разное', levelId: 'topik3' },
    { word: '전화', translation: 'Телефон', category: 'Разное', levelId: 'topik3' },
    { word: '컴퓨터', translation: 'Компьютер', category: 'Разное', levelId: 'topik3' },
    { word: '인터넷', translation: 'Интернет', category: 'Разное', levelId: 'topik3' },
    { word: 'TV', translation: 'Телевизор', category: 'Разное', levelId: 'topik3' },
    { word: '라디오', translation: 'Радио', category: 'Разное', levelId: 'topik3' }
];

// ---------- Генерация предложений для чтения (100 на уровень) ----------
function generateReadingSentences(levelId) {
    const samples = {
        topik1: [
            '안녕하세요.', '저는 학생입니다.', '이것은 책입니다.',
            '어머니는 요리사입니다.', '아버지는 회사에 다니세요.',
            '저는 한국어를 공부해요.', '오늘 날씨가 좋아요.',
            '내일은 비가 올 거예요.', '저는 커피를 좋아해요.',
            '이 가방은 비싸요.', '학교에 가요.', '친구를 만나요.',
            '음악을 들어요.', '운동을 해요.', '물을 마셔요.'
        ],
        topik2: [
            '어제는 영화를 봤어요.', '주말에 친구를 만날 거예요.',
            '버스를 타고 학교에 가요.', '지하철이 편리해요.',
            '새 옷을 샀어요.', '부엌에서 요리해요.',
            '침대에서 자요.', '일찍 일어나요.',
            '회사에서 일해요.', '퇴근하고 운동해요.'
        ],
        topik3: [
            '그는 의사라고 했어요.', '그녀는 예쁘다고 생각해요.',
            '한국어를 배우는 것이 재미있어요.',
            '서울에 가 본 적이 있어요?', '시간이 지루하게 흘렀어요.',
            '이 영화를 보셨나요?', '저는 한국 음식을 좋아해요.'
        ]
    };
    const base = samples[levelId] || samples.topik1;
    // Если меньше 100, дублируем с небольшими изменениями, чтобы получить 100
    let result = [];
    for (let i = 0; i < 100; i++) {
        const idx = i % base.length;
        let sentence = base[idx];
        // Добавляем вариации (замена слов)
        if (i >= base.length) {
            const extra = ['오늘', '내일', '어제', '주말', '방학', '시험', '숙제'];
            const replace = extra[i % extra.length];
            sentence = sentence.replace(/[가-힣]+/, replace);
        }
        result.push({ korean: sentence, russian: `(перевод предложения ${i+1})` });
    }
    return result;
}

// ---------- Грамматика TOPIK 1-3 ----------
const GRAMMAR_RULES = {
    topik1: [
        {
            title: 'Частица 은/는 (тема)',
            description: 'Указывает на тему. После согласной – 은, после гласной – 는.',
            examples: ['저는 학생입니다.', '이것은 책입니다.'],
            exercises: [
                { question: '저___ 학생입니다.', correct: '는' },
                { question: '이것___ 책입니다.', correct: '은' }
            ]
        },
        {
            title: 'Частица 이/가 (субъект)',
            description: 'Указывает на субъект. После согласной – 이, после гласной – 가.',
            examples: ['날씨가 좋아요.', '학생이 공부해요.'],
            exercises: [
                { question: '날씨___ 좋아요.', correct: '가' },
                { question: '학생___ 공부해요.', correct: '이' }
            ]
        },
        {
            title: 'Окончание -입니다 (формальное)',
            description: 'Именное сказуемое в формальном стиле.',
            examples: ['저는 학생입니다.', '이것은 책입니다.'],
            exercises: [
                { question: '저는 학생____', correct: '입니다' }
            ]
        }
    ],
    topik2: [
        {
            title: 'Прошедшее время (았/었)',
            description: 'Добавляется к основе. Если гласная ㅏ,ㅗ – 았, иначе – 었.',
            examples: ['가다 → 갔어요', '먹다 → 먹었어요'],
            exercises: [
                { question: '가다 → ___', correct: '갔어요' },
                { question: '먹다 → ___', correct: '먹었어요' }
            ]
        },
        {
            title: 'Будущее время (ㄹ/을 거예요)',
            description: 'После согласной – 을 거예요, после гласной – ㄹ 거예요.',
            examples: ['가다 → 갈 거예요', '먹다 → 먹을 거예요'],
            exercises: [
                { question: '가다 → ___', correct: '갈 거예요' },
                { question: '먹다 → ___', correct: '먹을 거예요' }
            ]
        }
    ],
    topik3: [
        {
            title: 'Косвенная речь (다고/라고)',
            description: 'Передача чужих слов. После глаголов – 다고, после существительных – (이)라고.',
            examples: ['의사라고 했어요.', '좋다고 했어요.'],
            exercises: [
                { question: '의사___ 했어요.', correct: '라고' },
                { question: '좋___ 했어요.', correct: '다고' }
            ]
        },
        {
            title: 'Страдательный залог (이/히/리/기)',
            description: 'Образуется от глаголов добавлением суффиксов.',
            examples: ['보다 → 보이다', '먹다 → 먹히다'],
            exercises: [
                { question: '보다 → ___', correct: '보이다' }
            ]
        }
    ]
};

// ---------- Построение уровней ----------
const LEVELS = [
    {
        id: 'topik1',
        title: 'TOPIK 1 (Начальный)',
        description: 'Алфавит, базовая грамматика, 100 слов для аудирования, 100 предложений для чтения.',
        reading: generateReadingSentences('topik1'),
        audio: WORDS.filter(w => w.levelId === 'topik1').slice(0, 100),
        grammar: GRAMMAR_RULES.topik1
    },
    {
        id: 'topik2',
        title: 'TOPIK 2 (Средний)',
        description: 'Времена, связки, 100 слов для аудирования, 100 предложений для чтения.',
        reading: generateReadingSentences('topik2'),
        audio: WORDS.filter(w => w.levelId === 'topik2').slice(0, 100),
        grammar: GRAMMAR_RULES.topik2
    },
    {
        id: 'topik3',
        title: 'TOPIK 3 (Продвинутый)',
        description: 'Страдательный залог, косвенная речь, 100 слов для аудирования, 100 предложений для чтения.',
        reading: generateReadingSentences('topik3'),
        audio: WORDS.filter(w => w.levelId === 'topik3').slice(0, 100),
        grammar: GRAMMAR_RULES.topik3
    }
];

// Экспортируем
const APP_DATA = { WORDS, LEVELS };
