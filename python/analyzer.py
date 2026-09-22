from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Разрешаем CORS, чтобы Node.js мог обращаться к сервису
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модель входных данных: {"text": "..."}
class TaskText(BaseModel):
    text: str

# Словари ключевых слов для анализа
HIGH_PRIORITY_WORDS = [
    "срочно", "важно", "asap", "дедлайн", "до пятницы", "до понедельника",
    "сегодня", "завтра", "критично", "немедленно", "презентация", "клиент",
    "urgent", "important", "deadline", "presentation", "client"
]

LOW_PRIORITY_WORDS = [
    "когда-нибудь", "потом", "не срочно", "в свободное время",
    "позже", "неважно", "мелкая",
    "someday", "later", "not urgent", "free time", "not important"
]

CATEGORY_KEYWORDS = {
    "business": ["клиент", "презентация", "отчет", "встреча", "договор", "проект", "бизнес", "компания", "руководитель",
                 "client", "presentation", "report", "meeting", "contract", "project", "business", "company"],
    "study":    ["учить", "изучить", "курс", "лекция", "экзамен", "домашка", "практика", "колледж", "университет", "читать",
                 "study", "learn", "course", "lecture", "exam", "homework", "practice", "college", "university", "read"],
    "personal": ["купить", "продукты", "дом", "семья", "друг", "здоровье", "спорт", "отдохнуть", "поспать",
                 "buy", "products", "home", "family", "friend", "health", "sport", "rest", "sleep"],
    "health":   ["врач", "лекарство", "спортзал", "тренировка", "анализы", "больница",
                 "doctor", "medicine", "gym", "training", "tests", "hospital"],
    "finance":  ["оплатить", "счет", "налог", "банк", "деньги", "бюджет",
                 "pay", "bill", "tax", "bank", "money", "budget"],
}

def analyze_text(text: str):
    """Анализирует текст задачи и возвращает приоритет и категорию."""
    lower = text.lower()

    # Определяем приоритет
    priority = "medium"  # по умолчанию
    for word in HIGH_PRIORITY_WORDS:
        if word in lower:
            priority = "high"
            break
    if priority == "medium":
        for word in LOW_PRIORITY_WORDS:
            if word in lower:
                priority = "low"
                break

    # Определяем категорию
    category = "general"  # по умолчанию
    for cat, keywords in CATEGORY_KEYWORDS.items():
        for word in keywords:
            if word in lower:
                category = cat
                break
        if category != "general":
            break

    return {"priority": priority, "category": category}

@app.get("/")
def root():
    return {"status": "ok", "service": "Task Analyzer"}

@app.post("/analyze")
def analyze(task: TaskText):
    """Принимает текст задачи, возвращает приоритет и категорию."""
    result = analyze_text(task.text)
    return {
        "priority": result["priority"],
        "category": result["category"]
    }