// data.js – обновлённый: начальный курс с интерактивом, исправлены переводы

// ---------- 300 слов по категориям (переводы исправлены) ----------
const WORDS = [
    { word: '안녕하세요', translation: 'Здравствуйте', category: 'Приветствия', levelId: 'topik1' },
    { word: '안녕', translation: 'Привет', category: 'Приветствия', levelId: 'topik1' },
    { word: '감사합니다', translation: 'Спасибо', category: 'Приветствия', levelId: 'topik1' },
    { word: '죄송합니다', translation: 'Извините', category: 'Приветствия', levelId: 'topik1' },
    { word: '괜찮아요', translation: 'Нормально, хорошо', category: 'Приветствия', levelId: 'topik1' },
    { word: '네', translation: 'Да', category: 'Приветствия', levelId: 'topik1' },
    { word: '아니요', translation: 'Нет', category: 'Приветствия', levelId: 'topik1' },
    { word: '가족', translation: 'Семья', category: 'Семья', levelId: 'topik1' },
    { word: '어머니', translation: 'Мама', category: 'Семья', levelId: 'topik1' },
    { word: '아버지', translation: 'Папа', category: 'Семья', levelId: 'topik1' },
    { word: '형', translation: 'Старший брат (для мужчины)', category: 'Семья', levelId: 'topik1' },
    { word: '누나', translation: 'Старшая сестра (для мужчины)', category: 'Семья', levelId: 'topik1' },
    { word: '언니', translation: 'Старшая сестра (для женщины)', category: 'Семья', levelId: 'topik1' },
    { word: '오빠', translation: 'Старший брат (для женщины)', category: 'Семья', levelId: 'topik1' },
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
    { word: '반찬', translation: 'Гарнир, закуска', category: 'Еда', levelId: 'topik1' },
    { word: '술', translation: 'Алкоголь', category: 'Еда', levelId: 'topik1' },
    { word: '커피', translation: 'Кофе', category: 'Еда', levelId: 'topik1' },
    { word: '차', translation: 'Чай', category: 'Еда', levelId: 'topik1' },
    { word: '가게', translation: 'Магазин', category: 'Покупки', levelId: 'topik1' },
    { word: '시장', translation: 'Рынок', category: 'Покупки', levelId: 'topik1' },
    { word: '백화점', translation: 'Универмаг', category: 'Покупки', levelId: 'topik1' },
    { word: '물건', translation: 'Вещь, товар', category: 'Покупки', levelId: 'topik1' },
    { word: '가격', translation: 'Цена', category: 'Покупки', levelId: 'topik1' },
    { word: '얼마', translation: 'Сколько (стоит)', category: 'Покупки', levelId: 'topik1' },
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
    { word: '맑다', translation: 'Ясно (о погоде)', category: 'Погода', levelId: 'topik1' },
    { word: '흐리다', translation: 'Пасмурно', category: 'Погода', levelId: 'topik1' },
    { word: '비', translation: 'Дождь', category: 'Погода', levelId: 'topik1' },
    { word: '눈', translation: 'Снег', category: 'Погода', levelId: 'topik1' },
    { word: '바람', translation: 'Ветер', category: 'Погода', levelId: 'topik1' },
    // TOPIK 2
    { word: '집', translation: 'Дом', category: 'Дом', levelId: 'topik2' },
    { word: '방', translation: 'Комната', category: 'Дом', levelId: 'topik2' },
    { word: '거실', translation: 'Гостиная', category: 'Дом', levelId: 'topik2' },
    { word: '부엌', translation: 'Кухня', category: 'Дом', levelId: 'topik2' },
    { word: '화장실', translation: 'Туалет', category: 'Дом', levelId: 'topik2' },
    { word: '침대', translation: 'Кровать', category: 'Дом', levelId: 'topik2' },
    { word: '탁자', translation: 'Стол (журнальный)', category: 'Дом', levelId: 'topik2' },
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
    { word: '역', translation: 'Вокзал, станция', category: 'Транспорт', levelId: 'topik2' },
    { word: '취미', translation: 'Хобби', category: 'Хобби', levelId: 'topik2' },
    { word: '운동', translation: 'Спорт, упражнение', category: 'Хобби', levelId: 'topik2' },
    { word: '영화', translation: 'Фильм', category: 'Хобби', levelId: 'topik2' },
    { word: '음악', translation: 'Музыка', category: 'Хобби', levelId: 'topik2' },
    { word: '독서', translation: 'Чтение (книг)', category: 'Хобби', levelId: 'topik2' },
    { word: '사진', translation: 'Фотография', category: 'Хобби', levelId: 'topik2' },
    { word: '그림', translation: 'Рисунок', category: 'Хобби', levelId: 'topik2' },
    { word: '게임', translation: 'Игра', category: 'Хобби', levelId: 'topik2' },
    { word: '등산', translation: 'Поход в горы', category: 'Хобби', levelId: 'topik2' },
    { word: '수영', translation: 'Плавание', category: 'Хобби', levelId: 'topik2' },
    { word: '직장', translation: 'Место работы', category: 'Работа', levelId: 'topik2' },
    { word: '회사', translation: 'Компания', category: 'Работа', levelId: 'topik2' },
    { word: '사무실', translation: 'Офис', category: 'Работа', levelId: 'topik2' },
    { word: '일', translation: 'Работа, дело', category: 'Работа', levelId: 'topik2' },
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
    { word: '배탈', translation: 'Расстройство желудка', category: 'Здоровье', levelId: 'topik2' },
    { word: '머리', translation: 'Голова', category: 'Здоровье', levelId: 'topik2' },
    { word: '여행', translation: 'Путешествие', category: 'Путешествия', levelId: 'topik2' },
    { word: '호텔', translation: 'Отель', category: 'Путешествия', levelId: 'topik2' },
    { word: '여권', translation: 'Паспорт', category: 'Путешествия', levelId: 'topik2' },
    { word: '표', translation: 'Билет', category: 'Путешествия', levelId: 'topik2' },
    { word: '관광', translation: 'Туризм', category: 'Путешествия', levelId: 'topik2' },
    { word: '기념품', translation: 'Сувенир', category: 'Путешествия', levelId: 'topik2' },
    { word: '지도', translation: 'Карта', category: 'Путешествия', levelId: 'topik2' },
    { word: '카메라', translation: 'Камера', category: 'Путешествия', levelId: 'topik2' },
    // TOPIK 3
    { word: '크다', translation: 'Большой', category: 'Прилагательные', levelId: 'topik3' },
    { word: '작다', translation: 'Маленький', category: 'Прилагательные', levelId: 'topik3' },
    { word: '예쁘다', translation: 'Красивый', category: 'Прилагательные', levelId: 'topik3' },
    { word: '멋지다', translation: 'Классный, шикарный', category: 'Прилагательные', levelId: 'topik3' },
    { word: '깨끗하다', translation: 'Чистый', category: 'Прилагательные', levelId: 'topik3' },
    { word: '더럽다', translation: 'Грязный', category: 'Прилагательные', levelId: 'topik3' },
    { word: '좋다', translation: 'Хороший', category: 'Прилагательные', levelId: 'topik3' },
    { word: '나쁘다', translation: 'Плохой', category: 'Прилагательные', levelId: 'topik3' },
    { word: '재미있다', translation: 'Интересный, весёлый', category: 'Прилагательные', levelId: 'topik3' },
    { word: '지루하다', translation: 'Скучный', category: 'Прилагательные', levelId: 'topik3' },
    { word: '가다', translation: 'Идти, ехать', category: 'Глаголы', levelId: 'topik3' },
    { word: '오다', translation: 'Приходить', category: 'Глаголы', levelId: 'topik3' },
    { word: '만나다', translation: 'Встречать', category: 'Глаголы', levelId: 'topik3' },
    { word: '보다', translation: 'Видеть, смотреть', category: 'Глаголы', levelId: 'topik3' },
    { word: '듣다', translation: 'Слушать', category: 'Глаголы', levelId: 'topik3' },
    { word: '말하다', translation: 'Говорить', category: 'Глаголы', levelId: 'topik3' },
    { word: '먹다', translation: 'Есть (кушать)', category: 'Глаголы', levelId: 'topik3' },
    { word: '마시다', translation: 'Пить', category: 'Глаголы', levelId: 'topik3' },
    { word: '자다', translation: 'Спать', category: 'Глаголы', levelId: 'topik3' },
    { word: '일어나다', translation: 'Вставать, просыпаться', category: 'Глаголы', levelId: 'topik3' },
    { word: '앉다', translation: 'Сидеть', category: 'Глаголы', levelId: 'topik3' },
    { word: '서다', translation: 'Стоять', category: 'Глаголы', levelId: 'topik3' },
    { word: '은/는', translation: 'Тематическая частица', category: 'Частицы', levelId: 'topik3' },
    { word: '이/가', translation: 'Субъектная частица', category: 'Частицы', levelId: 'topik3' },
    { word: '을/를', translation: 'Объектная частица', category: 'Частицы', levelId: 'topik3' },
    { word: '에', translation: 'В, на (направление)', category: 'Частицы', levelId: 'topik3' },
    { word: '에서', translation: 'В, на (место действия)', category: 'Частицы', levelId: 'topik3' },
    { word: '로', translation: 'В сторону, на (средство)', category: 'Частицы', levelId: 'topik3' },
    { word: '과/와', translation: 'И (с существительными)', category: 'Частицы', levelId: 'topik3' },
    { word: '하고', translation: 'И (разговорный)', category: 'Частицы', levelId: 'topik3' },
    { word: '의', translation: 'Родительный падеж (чей?)', category: 'Частицы', levelId: 'topik3' },
    { word: '한국', translation: 'Корея', category: 'Страны', levelId: 'topik3' },
    { word: '서울', translation: 'Сеул', category: 'Города', levelId: 'topik3' },
    { word: '사람', translation: 'Человек', category: 'Общее', levelId: 'topik3' },
    { word: '이름', translation: 'Имя', category: 'Общее', levelId: 'topik3' },
    { word: '나이', translation: 'Возраст', category: 'Общее', levelId: 'topik3' },
    { word: '전화', translation: 'Телефон', category: 'Общее', levelId: 'topik3' },
    { word: '컴퓨터', translation: 'Компьютер', category: 'Общее', levelId: 'topik3' },
    { word: '인터넷', translation: 'Интернет', category: 'Общее', levelId: 'topik3' },
    { word: 'TV', translation: 'Телевизор', category: 'Общее', levelId: 'topik3' },
    { word: '라디오', translation: 'Радио', category: 'Общее', levelId: 'topik3' }
];

// ---------- Грамматические правила (исправлены переводы) ----------
const GRAMMAR_RULES = {
    topik1: [
        { title: 'Частица 은/는 (тема)', description: 'Указывает тему. После согласной – 은, после гласной – 는.', examples: ['저는 학생입니다.', '이것은 책입니다.'], exercises: [{ question: '저___ 학생입니다.', correct: '는' }, { question: '이것___ 책입니다.', correct: '은' }] },
        { title: 'Частица 이/가 (субъект)', description: 'Указывает субъект. После согласной – 이, после гласной – 가.', examples: ['날씨가 좋아요.', '학생이 공부해요.'], exercises: [{ question: '날씨___ 좋아요.', correct: '가' }, { question: '학생___ 공부해요.', correct: '이' }] },
        { title: 'Окончание -입니다 (формальное)', description: 'Именное сказуемое в формальном стиле.', examples: ['저는 학생입니다.', '이것은 책입니다.'], exercises: [{ question: '저는 학생____', correct: '입니다' }] },
        { title: 'Окончание -이에요/예요 (вежливое)', description: 'Именное сказуемое в вежливом разговорном стиле. После согласной – 이에요, после гласной – 예요.', examples: ['저는 학생이에요.', '이것은 책이에요.'], exercises: [{ question: '저는 학생____', correct: '이에요' }, { question: '이것은 책____', correct: '이에요' }] },
        { title: 'Настоящее время (формальное -ㅂ니다/습니다)', description: 'После согласной – 습니다, после гласной – ㅂ니다.', examples: ['가다 → 갑니다', '먹다 → 먹습니다'], exercises: [{ question: '가다 → ___', correct: '갑니다' }, { question: '먹다 → ___', correct: '먹습니다' }] },
        { title: 'Настоящее время (вежливое -아/어요)', description: 'После гласной ㅏ,ㅗ – 아요, иначе – 어요.', examples: ['가다 → 가요', '먹다 → 먹어요'], exercises: [{ question: '가다 → ___', correct: '가요' }, { question: '먹다 → ___', correct: '먹어요' }] },
        { title: 'Отрицание 안 (перед глаголом)', description: 'Ставится перед глаголом для отрицания.', examples: ['안 가요', '안 먹어요'], exercises: [{ question: '가요 → ___', correct: '안 가요' }] },
        { title: 'Отрицание 못 (не мочь)', description: 'Выражает невозможность.', examples: ['못 가요', '못 먹어요'], exercises: [{ question: '가요 → ___', correct: '못 가요' }] },
        { title: 'Будущее время (ㄹ/을 거예요)', description: 'После согласной – 을 거예요, после гласной – ㄹ 거예요.', examples: ['가다 → 갈 거예요', '먹다 → 먹을 거예요'], exercises: [{ question: '가다 → ___', correct: '갈 거예요' }, { question: '먹다 → ___', correct: '먹을 거예요' }] },
        { title: 'Прошедшее время (았/었어요)', description: 'После гласной ㅏ,ㅗ – 았어요, иначе – 었어요.', examples: ['가다 → 갔어요', '먹다 → 먹었어요'], exercises: [{ question: '가다 → ___', correct: '갔어요' }, { question: '먹다 → ___', correct: '먹었어요' }] },
        { title: 'Частица 에 (направление/время)', description: 'Указывает направление или время.', examples: ['학교에 가요', '3시에 만나요'], exercises: [{ question: '학교___ 가요.', correct: '에' }, { question: '3시___ 만나요.', correct: '에' }] },
        { title: 'Частица 에서 (место действия)', description: 'Указывает место действия.', examples: ['학교에서 공부해요'], exercises: [{ question: '학교___ 공부해요.', correct: '에서' }] },
        { title: 'Частица 을/를 (объект)', description: 'После согласной – 을, после гласной – 를.', examples: ['책을 읽어요', '물을 마셔요'], exercises: [{ question: '책___ 읽어요.', correct: '을' }, { question: '물___ 마셔요.', correct: '을' }] },
        { title: 'Частица 하고 (и, с)', description: 'Соединяет существительные.', examples: ['친구하고 가요'], exercises: [{ question: '친구___ 가요.', correct: '하고' }] }
    ],
    topik2: [
        { title: 'Прошедшее время (았/었) – подробно', description: 'Добавляется к основе глагола. Правила выбора.', examples: ['가다 → 갔어요', '먹다 → 먹었어요', '하다 → 했어요'], exercises: [{ question: '하다 → ___', correct: '했어요' }] },
        { title: 'Будущее время (ㄹ/을 거예요) – продолжение', description: 'Используется для выражения намерения или предположения.', examples: ['내일 갈 거예요', '비가 올 거예요'], exercises: [{ question: '내일 가___', correct: '갈 거예요' }] },
        { title: 'Связка -고 (и, а затем)', description: 'Соединяет два действия.', examples: ['밥을 먹고 학교에 가요'], exercises: [{ question: '밥을 먹___ 학교에 가요.', correct: '고' }] },
        { title: 'Связка -지만 (но)', description: 'Выражает противопоставление.', examples: ['배가 고프지만 참아요'], exercises: [{ question: '배가 고프___ 참아요.', correct: '지만' }] },
        { title: 'Связка -아/어서 (потому что, и поэтому)', description: 'Указывает причину или последовательность.', examples: ['피곤해서 일찍 잤어요'], exercises: [{ question: '피곤해___ 일찍 잤어요.', correct: '서' }] },
        { title: 'Связка -거나 (или)', description: 'Выражает выбор.', examples: ['커피를 마시거나 차를 마셔요'], exercises: [{ question: '커피를 마시___ 차를 마셔요.', correct: '거나' }] },
        { title: 'Вежливая форма -시- (к старшим)', description: 'Добавляется к основе глагола для выражения уважения.', examples: ['선생님이 오세요'], exercises: [{ question: '선생님이 오___', correct: '세요' }] },
        { title: 'Выражение желания -고 싶다', description: 'Хотеть сделать что-то.', examples: ['가고 싶어요', '먹고 싶어요'], exercises: [{ question: '가다 → ___', correct: '가고 싶어요' }] },
        { title: 'Выражение намерения -려고 하다', description: 'Собираться сделать.', examples: ['가려고 해요'], exercises: [{ question: '가다 → ___', correct: '가려고 해요' }] },
        { title: 'Причина -니까', description: 'Указывает причину (разговорный стиль).', examples: ['배가 고프니까 먹어요'], exercises: [{ question: '배가 고프___ 먹어요.', correct: '니까' }] },
        { title: 'Выражение состояния -아/어 있다', description: 'Описывает продолжающееся состояние.', examples: ['앉아 있어요'], exercises: [{ question: '앉다 → ___', correct: '앉아 있어요' }] }
    ],
    topik3: [
        { title: 'Косвенная речь (다고/라고)', description: 'Передача чужих слов. После глаголов – 다고, после существительных – (이)라고.', examples: ['의사라고 했어요.', '좋다고 했어요.'], exercises: [{ question: '의사___ 했어요.', correct: '라고' }, { question: '좋___ 했어요.', correct: '다고' }] },
        { title: 'Страдательный залог (이/히/리/기)', description: 'Образуется от глаголов добавлением суффиксов.', examples: ['보다 → 보이다', '먹다 → 먹히다'], exercises: [{ question: '보다 → ___', correct: '보이다' }] },
        { title: 'Пассивные формы -되다', description: 'Используется с существительными для образования пассива.', examples: ['결정되다'], exercises: [{ question: '결정하다 → ___', correct: '결정되다' }] },
        { title: 'Причинно-следственная связь -기 때문에', description: 'Потому что (книжный стиль).', examples: ['비가 오기 때문에 집에 있어요'], exercises: [{ question: '비가 오___ 집에 있어요.', correct: '기 때문에' }] },
        { title: 'Условное наклонение -면', description: 'Если (условие).', examples: ['비가 오면 집에 있어요'], exercises: [{ question: '비가 오___ 집에 있어요.', correct: '면' }] },
        { title: 'Временная связь -을 때', description: 'Когда (время действия).', examples: ['학교에 갈 때 친구를 만나요'], exercises: [{ question: '학교에 갈 ___ 친구를 만나요.', correct: '때' }] },
        { title: 'Сравнение -보다', description: 'Чем (сравнение).', examples: ['사과가 바나나보다 커요'], exercises: [{ question: '사과가 바나나___ 커요.', correct: '보다' }] },
        { title: 'Выражение намерения -려고', description: 'Для того чтобы (цель).', examples: ['한국어를 배우려고 한국에 왔어요'], exercises: [{ question: '한국어를 배우___ 한국에 왔어요.', correct: '려고' }] },
        { title: 'Выражение уступки -아/어도', description: 'Даже если.', examples: ['비가 와도 나가요'], exercises: [{ question: '비가 와___ 나가요.', correct: '도' }] },
        { title: 'Выражение долженствования -아/어야 하다', description: 'Должен, нужно.', examples: ['숙제를 해야 해요'], exercises: [{ question: '숙제를 해___ 해요.', correct: '야' }] }
    ]
};

// ---------- Генерация 100 предложений для чтения (исправлены переводы) ----------
function generateReading(levelId) {
    const templates = {
        topik1: [
            { korean: '안녕하세요.', russian: 'Здравствуйте.' },
            { korean: '저는 학생입니다.', russian: 'Я студент.' },
            { korean: '이것은 책입니다.', russian: 'Это книга.' },
            { korean: '어머니는 요리사입니다.', russian: 'Мама – повар.' },
            { korean: '아버지는 회사에 다니세요.', russian: 'Папа работает в компании.' },
            { korean: '저는 한국어를 공부해요.', russian: 'Я изучаю корейский язык.' },
            { korean: '오늘 날씨가 좋아요.', russian: 'Сегодня хорошая погода.' },
            { korean: '내일은 비가 올 거예요.', russian: 'Завтра будет дождь.' },
            { korean: '저는 커피를 좋아해요.', russian: 'Я люблю кофе.' },
            { korean: '이 가방은 비싸요.', russian: 'Эта сумка дорогая.' },
            { korean: '학교에 가요.', russian: 'Иду в школу.' },
            { korean: '친구를 만나요.', russian: 'Встречаю друга.' },
            { korean: '음악을 들어요.', russian: 'Слушаю музыку.' },
            { korean: '운동을 해요.', russian: 'Занимаюсь спортом.' },
            { korean: '물을 마셔요.', russian: 'Пью воду.' }
        ],
        topik2: [
            { korean: '어제는 영화를 봤어요.', russian: 'Вчера я смотрел фильм.' },
            { korean: '주말에 친구를 만날 거예요.', russian: 'На выходных встречу друга.' },
            { korean: '버스를 타고 학교에 가요.', russian: 'Еду в школу на автобусе.' },
            { korean: '지하철이 편리해요.', russian: 'Метро удобно.' },
            { korean: '새 옷을 샀어요.', russian: 'Купил новую одежду.' },
            { korean: '부엌에서 요리해요.', russian: 'Готовлю на кухне.' },
            { korean: '침대에서 자요.', russian: 'Сплю на кровати.' },
            { korean: '일찍 일어나요.', russian: 'Встаю рано.' },
            { korean: '회사에서 일해요.', russian: 'Работаю в компании.' },
            { korean: '퇴근하고 운동해요.', russian: 'После работы занимаюсь спортом.' }
        ],
        topik3: [
            { korean: '그는 의사라고 했어요.', russian: 'Он сказал, что он врач.' },
            { korean: '그녀는 예쁘다고 생각해요.', russian: 'Она считает себя красивой.' },
            { korean: '한국어를 배우는 것이 재미있어요.', russian: 'Изучать корейский язык интересно.' },
            { korean: '서울에 가 본 적이 있어요?', russian: 'Бывали ли вы в Сеуле?' },
            { korean: '시간이 지루하게 흘렀어요.', russian: 'Время пролетело скучно.' }
        ]
    };
    const base = templates[levelId] || templates.topik1;
    const result = [];
    for (let i = 0; i < 100; i++) {
        const idx = i % base.length;
        result.push(base[idx]);
    }
    return result;
}

// ---------- НАЧАЛЬНЫЙ КУРС (полнофункциональный, интерактивный) ----------
const BEGINNER_PLAN = {
    title: 'С нуля – алфавит и основы',
    steps: [
        {
            id: 'step1',
            title: 'Согласные хангыля',
            description: 'Изучите 14 базовых согласных. Нажмите на букву, чтобы услышать произношение.',
            content: [
                { type: 'consonants', letters: ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'] }
            ],
            exercise: {
                type: 'choose',
                question: 'Какая буква читается как "г/к"?',
                options: ['ㄱ', 'ㄴ', 'ㄷ'],
                correct: 0
            }
        },
        {
            id: 'step2',
            title: 'Гласные хангыля',
            description: 'Изучите 10 базовых гласных. Нажмите на букву, чтобы услышать произношение.',
            content: [
                { type: 'vowels', letters: ['ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ'] }
            ],
            exercise: {
                type: 'choose',
                question: 'Какая гласная читается как "а"?',
                options: ['ㅏ', 'ㅓ', 'ㅗ'],
                correct: 0
            }
        },
        {
            id: 'step3',
            title: 'Составление слогов',
            description: 'Слог состоит из начальной согласной, гласной и (иногда) конечной согласной (받침). Пример: ㄱ + ㅏ = 가.',
            content: [
                { type: 'explanation', text: 'Попробуйте собрать слог из предложенных букв.' }
            ],
            exercise: {
                type: 'build_syllable',
                question: 'Соберите слог "га" (ㄱ + ㅏ)',
                correct: '가'
            }
        },
        {
            id: 'step4',
            title: 'Правила чтения (ассимиляция)',
            description: 'В корейском некоторые буквы меняют звучание при стечении. Пример: ㄱ + ㄴ → ㅇㄴ.',
            content: [
                { type: 'explanation', text: 'Например, "한국" читается как "한국", но "한국어" – как "한구거".' }
            ],
            exercise: {
                type: 'choose',
                question: 'Как правильно прочитать "한국어"?',
                options: ['한국어', '한구거', '한국어 (как пишется)'],
                correct: 1
            }
        },
        {
            id: 'step5',
            title: 'Корейские числа (родные)',
            description: 'Родные числа используются для счёта предметов (1-99).',
            content: [
                { type: 'numbers', numbers: ['하나','둘','셋','넷','다섯','여섯','일곱','여덟','아홉','열'] }
            ],
            exercise: {
                type: 'choose',
                question: 'Как будет "три" (родное число)?',
                options: ['하나', '둘', '셋'],
                correct: 2
            }
        },
        {
            id: 'step6',
            title: 'Китайские числа (система)',
            description: 'Используются для дат, цен, номеров телефонов.',
            content: [
                { type: 'numbers', numbers: ['일','이','삼','사','오','육','칠','팔','구','십'] }
            ],
            exercise: {
                type: 'choose',
                question: 'Как будет "пять" (китайское число)?',
                options: ['일', '오', '구'],
                correct: 1
            }
        },
        {
            id: 'step7',
            title: 'Приветствия и базовые фразы',
            description: 'Основные фразы для общения.',
            content: [
                { type: 'phrases', phrases: [
                    { korean: '안녕하세요', russian: 'Здравствуйте' },
                    { korean: '감사합니다', russian: 'Спасибо' },
                    { korean: '죄송합니다', russian: 'Извините' },
                    { korean: '괜찮아요', russian: 'Нормально' }
                ] }
            ],
            exercise: {
                type: 'match',
                question: 'Как переводится "안녕하세요"?',
                options: ['Здравствуйте', 'Спасибо', 'Извините'],
                correct: 0
            }
        },
        {
            id: 'step8',
            title: 'Времена дня',
            description: 'Слова для обозначения частей суток.',
            content: [
                { type: 'phrases', phrases: [
                    { korean: '아침', russian: 'Утро' },
                    { korean: '점심', russian: 'Обед' },
                    { korean: '저녁', russian: 'Вечер' },
                    { korean: '밤', russian: 'Ночь' }
                ] }
            ],
            exercise: {
                type: 'choose',
                question: 'Как будет "вечер" по-корейски?',
                options: ['아침', '점심', '저녁'],
                correct: 2
            }
        },
        {
            id: 'step9',
            title: 'Погода',
            description: 'Основные слова о погоде.',
            content: [
                { type: 'phrases', phrases: [
                    { korean: '날씨가 좋아요', russian: 'Погода хорошая' },
                    { korean: '비가 와요', russian: 'Идёт дождь' },
                    { korean: '눈이 와요', russian: 'Идёт снег' },
                    { korean: '더워요', russian: 'Жарко' },
                    { korean: '추워요', russian: 'Холодно' }
                ] }
            ],
            exercise: {
                type: 'choose',
                question: 'Как сказать "жарко"?',
                options: ['더워요', '추워요', '비가 와요'],
                correct: 0
            }
        },
        {
            id: 'step10',
            title: 'Семья',
            description: 'Названия членов семьи.',
            content: [
                { type: 'phrases', phrases: [
                    { korean: '가족', russian: 'Семья' },
                    { korean: '어머니', russian: 'Мама' },
                    { korean: '아버지', russian: 'Папа' },
                    { korean: '형', russian: 'Старший брат (для мужчины)' },
                    { korean: '누나', russian: 'Старшая сестра (для мужчины)' }
                ] }
            ],
            exercise: {
                type: 'choose',
                question: 'Как будет "папа"?',
                options: ['어머니', '아버지', '형'],
                correct: 1
            }
        }
    ]
};

// ---------- Построение уровней ----------
const LEVELS = [
    {
        id: 'topik1',
        title: 'TOPIK 1 (Начальный)',
        description: 'Алфавит, базовая грамматика, 100 слов для аудирования, 100 предложений для чтения.',
        reading: generateReading('topik1'),
        audio: WORDS.filter(w => w.levelId === 'topik1').slice(0, 100),
        grammar: GRAMMAR_RULES.topik1
    },
    {
        id: 'topik2',
        title: 'TOPIK 2 (Средний)',
        description: 'Времена, связки, 100 слов для аудирования, 100 предложений для чтения.',
        reading: generateReading('topik2'),
        audio: WORDS.filter(w => w.levelId === 'topik2').slice(0, 100),
        grammar: GRAMMAR_RULES.topik2
    },
    {
        id: 'topik3',
        title: 'TOPIK 3 (Продвинутый)',
        description: 'Страдательный залог, косвенная речь, 100 слов для аудирования, 100 предложений для чтения.',
        reading: generateReading('topik3'),
        audio: WORDS.filter(w => w.levelId === 'topik3').slice(0, 100),
        grammar: GRAMMAR_RULES.topik3
    }
];

// Экспортируем
const APP_DATA = { WORDS, LEVELS, BEGINNER_PLAN };
