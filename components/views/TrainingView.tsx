'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  PlayCircle, 
  Clock, 
  CheckCircle, 
  Lock,
  ChevronRight,
  Award,
  Video,
  FileText,
  HelpCircle,
  Star,
  ArrowRight,
  X
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  progress: number;
  category: 'basics' | 'production' | 'finance' | 'hr' | 'advanced';
  level: 'beginner' | 'intermediate' | 'advanced';
  lessonsList: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz';
  completed: boolean;
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Основы работы с платформой',
    description: 'Познакомьтесь с основными функциями и возможностями системы управления фабрикой',
    duration: '45 мин',
    lessons: 5,
    progress: 0,
    category: 'basics',
    level: 'beginner',
    lessonsList: [
      { id: '1-1', title: 'Введение в систему', duration: '5 мин', type: 'video', completed: false },
      { id: '1-2', title: 'Навигация по интерфейсу', duration: '10 мин', type: 'video', completed: false },
      { id: '1-3', title: 'Настройка профиля', duration: '8 мин', type: 'article', completed: false },
      { id: '1-4', title: 'Основные разделы', duration: '12 мин', type: 'video', completed: false },
      { id: '1-5', title: 'Тест: Основы', duration: '10 мин', type: 'quiz', completed: false },
    ]
  },
  {
    id: '2',
    title: 'Управление производством',
    description: 'Научитесь создавать заказы, управлять партиями и отслеживать прогресс',
    duration: '1ч 20мин',
    lessons: 8,
    progress: 0,
    category: 'production',
    level: 'beginner',
    lessonsList: [
      { id: '2-1', title: 'Создание нового заказа', duration: '10 мин', type: 'video', completed: false },
      { id: '2-2', title: 'Назначение фабрик', duration: '8 мин', type: 'video', completed: false },
      { id: '2-3', title: 'Управление партиями', duration: '15 мин', type: 'video', completed: false },
      { id: '2-4', title: 'Статусы и этапы', duration: '10 мин', type: 'article', completed: false },
      { id: '2-5', title: 'Отслеживание брака', duration: '12 мин', type: 'video', completed: false },
      { id: '2-6', title: 'Отчёты по производству', duration: '10 мин', type: 'video', completed: false },
      { id: '2-7', title: 'Аналитика эффективности', duration: '10 мин', type: 'video', completed: false },
      { id: '2-8', title: 'Тест: Производство', duration: '5 мин', type: 'quiz', completed: false },
    ]
  },
  {
    id: '3',
    title: 'Финансы и бухгалтерия',
    description: 'Работа с финансовыми отчётами, транзакциями и аналитикой прибыли',
    duration: '1ч',
    lessons: 6,
    progress: 0,
    category: 'finance',
    level: 'intermediate',
    lessonsList: [
      { id: '3-1', title: 'Обзор финансового раздела', duration: '10 мин', type: 'video', completed: false },
      { id: '3-2', title: 'Добавление транзакций', duration: '12 мин', type: 'video', completed: false },
      { id: '3-3', title: 'Загрузка банковских выписок', duration: '8 мин', type: 'video', completed: false },
      { id: '3-4', title: 'Категоризация расходов', duration: '10 мин', type: 'article', completed: false },
      { id: '3-5', title: 'Отчёты для бухгалтерии', duration: '15 мин', type: 'video', completed: false },
      { id: '3-6', title: 'Тест: Финансы', duration: '5 мин', type: 'quiz', completed: false },
    ]
  },
  {
    id: '4',
    title: 'Управление персоналом',
    description: 'Добавление сотрудников, расчёт зарплат и KPI',
    duration: '50 мин',
    lessons: 5,
    progress: 0,
    category: 'hr',
    level: 'intermediate',
    lessonsList: [
      { id: '4-1', title: 'Добавление сотрудников', duration: '10 мин', type: 'video', completed: false },
      { id: '4-2', title: 'Назначение на фабрики', duration: '8 мин', type: 'video', completed: false },
      { id: '4-3', title: 'Расчёт зарплаты', duration: '15 мин', type: 'video', completed: false },
      { id: '4-4', title: 'Система KPI и бонусов', duration: '12 мин', type: 'video', completed: false },
      { id: '4-5', title: 'Тест: HR', duration: '5 мин', type: 'quiz', completed: false },
    ]
  },
  {
    id: '5',
    title: 'Продвинутая аналитика',
    description: 'Глубокий анализ данных, прогнозирование и оптимизация',
    duration: '1ч 30мин',
    lessons: 7,
    progress: 0,
    category: 'advanced',
    level: 'advanced',
    lessonsList: [
      { id: '5-1', title: 'Аналитические дашборды', duration: '15 мин', type: 'video', completed: false },
      { id: '5-2', title: 'Сравнение фабрик', duration: '12 мин', type: 'video', completed: false },
      { id: '5-3', title: 'Прогнозирование прибыли', duration: '15 мин', type: 'video', completed: false },
      { id: '5-4', title: 'Оптимизация производства', duration: '12 мин', type: 'article', completed: false },
      { id: '5-5', title: 'Выявление узких мест', duration: '10 мин', type: 'video', completed: false },
      { id: '5-6', title: 'Экспорт отчётов', duration: '10 мин', type: 'video', completed: false },
      { id: '5-7', title: 'Финальный тест', duration: '16 мин', type: 'quiz', completed: false },
    ]
  },
];

const faqItems = [
  {
    question: 'Как добавить новую фабрику?',
    answer: 'Перейдите в раздел "Фабрики" и нажмите кнопку "Добавить фабрику". Заполните обязательные поля (название, город) и дополнительную информацию.'
  },
  {
    question: 'Как загрузить финансовый отчёт?',
    answer: 'В разделе "Отчёты" перетащите файл в область загрузки или нажмите "Выбрать файлы". Поддерживаются форматы Excel, PDF и Word.'
  },
  {
    question: 'Как рассчитывается зарплата сотрудников?',
    answer: 'Зарплата состоит из базовой ставки и бонусов за KPI. Система автоматически рассчитывает итоговую сумму на основе эффективности.'
  },
  {
    question: 'Можно ли экспортировать данные?',
    answer: 'Да, в каждом разделе есть возможность экспорта в Excel или PDF. Также можно сформировать комплексные отчёты.'
  },
  {
    question: 'Как восстановить пароль?',
    answer: 'Обратитесь к администратору системы для сброса пароля. В демо-версии используйте логин: admin, пароль: admin123'
  },
];

export default function TrainingView() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'basics' | 'production' | 'finance' | 'hr' | 'advanced'>('all');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basics': return 'bg-blue-100 text-blue-700';
      case 'production': return 'bg-purple-100 text-purple-700';
      case 'finance': return 'bg-green-100 text-green-700';
      case 'hr': return 'bg-orange-100 text-orange-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'basics': return 'Основы';
      case 'production': return 'Производство';
      case 'finance': return 'Финансы';
      case 'hr': return 'HR';
      case 'advanced': return 'Продвинутый';
      default: return category;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Начинающий';
      case 'intermediate': return 'Средний';
      case 'advanced': return 'Продвинутый';
      default: return level;
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'article': return <FileText className="w-4 h-4" />;
      case 'quiz': return <HelpCircle className="w-4 h-4" />;
      default: return <PlayCircle className="w-4 h-4" />;
    }
  };

  const filteredCourses = filter === 'all' ? courses : courses.filter(c => c.category === filter);

  const totalProgress = Math.round(
    courses.reduce((sum, course) => sum + course.progress, 0) / courses.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">📚 Обучение</h2>
            <p className="text-purple-100">Изучите все возможности платформы</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-purple-100 text-sm">Курсов доступно</p>
            <p className="text-3xl font-bold">{courses.length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-purple-100 text-sm">Всего уроков</p>
            <p className="text-3xl font-bold">{courses.reduce((sum, c) => sum + c.lessons, 0)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-purple-100 text-sm">Прогресс</p>
            <p className="text-3xl font-bold">{totalProgress}%</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'basics', 'production', 'finance', 'hr', 'advanced'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat === 'all' ? 'Все курсы' : getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <div 
            key={course.id} 
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setSelectedCourse(course)}
          >
            <div className={`h-2 ${
              course.category === 'basics' ? 'bg-blue-500' :
              course.category === 'production' ? 'bg-purple-500' :
              course.category === 'finance' ? 'bg-green-500' :
              course.category === 'hr' ? 'bg-orange-500' : 'bg-red-500'
            }`} />
            
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
                  {getCategoryLabel(course.category)}
                </span>
                <span className="text-xs text-gray-500">{getLevelLabel(course.level)}</span>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <PlayCircle className="w-4 h-4" />
                  {course.lessons} уроков
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Прогресс</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                {course.progress > 0 ? 'Продолжить' : 'Начать'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          Частые вопросы
        </h3>
        <div className="space-y-2">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedFaq === index ? 'rotate-90' : ''
                }`} />
              </button>
              {expandedFaq === index && (
                <div className="px-4 pb-4 text-gray-600 bg-gray-50">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 mb-2">💡 Совет</h3>
            <p className="text-sm text-amber-800">
              Начните с курса "Основы работы с платформой", чтобы быстро освоить все функции. 
              После прохождения каждого курса вы получите сертификат.
            </p>
          </div>
        </div>
      </div>

      {/* Course Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className={`p-6 text-white ${
              selectedCourse.category === 'basics' ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
              selectedCourse.category === 'production' ? 'bg-gradient-to-r from-purple-600 to-purple-700' :
              selectedCourse.category === 'finance' ? 'bg-gradient-to-r from-green-600 to-green-700' :
              selectedCourse.category === 'hr' ? 'bg-gradient-to-r from-orange-600 to-orange-700' :
              'bg-gradient-to-r from-red-600 to-red-700'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                    {getCategoryLabel(selectedCourse.category)}
                  </span>
                  <h3 className="text-xl font-bold mt-2">{selectedCourse.title}</h3>
                  <p className="text-sm opacity-80 mt-1">{selectedCourse.description}</p>
                </div>
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedCourse.duration}
                </div>
                <div className="flex items-center gap-1">
                  <PlayCircle className="w-4 h-4" />
                  {selectedCourse.lessons} уроков
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Сертификат
                </div>
              </div>
            </div>

            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Содержание курса</h4>
              <div className="space-y-2">
                {selectedCourse.lessonsList.map((lesson, index) => (
                  <div 
                    key={lesson.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      lesson.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${lesson.completed ? 'text-green-700' : 'text-gray-900'}`}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {getLessonIcon(lesson.type)}
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <PlayCircle className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                <PlayCircle className="w-5 h-5" />
                {selectedCourse.progress > 0 ? 'Продолжить обучение' : 'Начать курс'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}