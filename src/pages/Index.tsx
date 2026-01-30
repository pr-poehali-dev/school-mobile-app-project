import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import ClassSelector from '@/components/school/ClassSelector';
import HomeTab from '@/components/school/HomeTab';
import TabContentComponent from '@/components/school/TabContent';
import BottomNavigation from '@/components/school/BottomNavigation';

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

const getScheduleData = () => {
  const saved = localStorage.getItem('scheduleData');
  return saved ? JSON.parse(saved) : {
    '5А': {
      'Понедельник': ['Математика', 'Русский язык', 'История', 'Физкультура', 'Английский язык'],
      'Вторник': ['Литература', 'Математика', 'Биология', 'География', 'ИЗО'],
      'Среда': ['Русский язык', 'Английский язык', 'Математика', 'Технология', 'Технология'],
      'Четверг': ['История', 'Физика', 'Математика', 'Русский язык', 'Музыка'],
      'Пятница': ['Английский язык', 'Литература', 'Обществознание', 'Биология', 'Физкультура'],
    },
    '8Б': {
      'Понедельник': ['Алгебра', 'Русский язык', 'История', 'Химия', 'Английский язык', 'Физкультура'],
      'Вторник': ['Литература', 'Геометрия', 'Биология', 'География', 'Информатика', 'ОБЖ'],
      'Среда': ['Русский язык', 'Английский язык', 'Физика', 'Алгебра', 'История', 'Физкультура'],
      'Четверг': ['Обществознание', 'Геометрия', 'Химия', 'Русский язык', 'Литература'],
      'Пятница': ['Английский язык', 'Физика', 'Биология', 'География', 'Информатика', 'Физкультура'],
    }
  };
};

const getBellsData = () => {
  const saved = localStorage.getItem('bellsData');
  return saved ? JSON.parse(saved) : {
    'Понедельник': [
      { lesson: 1, start: '08:30', end: '09:15' },
      { lesson: 2, start: '09:25', end: '10:10' },
      { lesson: 3, start: '10:30', end: '11:15' },
      { lesson: 4, start: '11:35', end: '12:20' },
      { lesson: 5, start: '12:30', end: '13:15' },
      { lesson: 6, start: '13:25', end: '14:10' },
    ],
    'Вторник': [
      { lesson: 1, start: '08:30', end: '09:15' },
      { lesson: 2, start: '09:25', end: '10:10' },
      { lesson: 3, start: '10:30', end: '11:15' },
      { lesson: 4, start: '11:35', end: '12:20' },
      { lesson: 5, start: '12:30', end: '13:15' },
      { lesson: 6, start: '13:25', end: '14:10' },
    ],
  };
};

const getMenuData = () => {
  const saved = localStorage.getItem('menuData');
  return saved ? JSON.parse(saved) : {
    'Понедельник': {
      breakfast: ['Каша овсяная', 'Масло сливочное', 'Чай с сахаром', 'Булочка'],
      lunch: ['Борщ', 'Котлета куриная', 'Пюре картофельное', 'Салат из капусты', 'Компот', 'Хлеб'],
    },
    'Вторник': {
      breakfast: ['Каша гречневая молочная', 'Яйцо вареное', 'Какао', 'Печенье'],
      lunch: ['Суп куриный', 'Рыба запеченная', 'Рис отварной', 'Салат морковный', 'Сок', 'Хлеб'],
    },
  };
};

const getTeachersData = () => {
  const saved = localStorage.getItem('teachersData');
  return saved ? JSON.parse(saved) : [
    { name: 'Иванова Мария Петровна', subject: 'Математика', category: 'Точные науки', phone: '+7 (999) 123-45-67' },
    { name: 'Петров Сергей Иванович', subject: 'Физика', category: 'Точные науки', phone: '+7 (999) 234-56-78' },
    { name: 'Сидорова Анна Владимировна', subject: 'Русский язык и литература', category: 'Гуманитарные предметы', phone: '+7 (999) 345-67-89' },
    { name: 'Козлов Дмитрий Александрович', subject: 'История', category: 'Гуманитарные предметы', phone: '+7 (999) 456-78-90' },
    { name: 'Новикова Елена Сергеевна', subject: 'Английский язык', category: 'Гуманитарные предметы', phone: '+7 (999) 567-89-01' },
    { name: 'Смирнов Алексей Николаевич', subject: 'Физкультура', category: 'Физкультура и доп. предметы', phone: '+7 (999) 678-90-12' },
  ];
};

const getNewsData = () => {
  const saved = localStorage.getItem('newsData');
  return saved ? JSON.parse(saved) : [
    { id: 1, title: 'Родительское собрание', text: 'Уважаемые родители! 20 января в 18:00 состоится общешкольное родительское собрание. Присутствие обязательно.', date: '2026-01-10', pinned: true },
    { id: 2, title: 'Каникулы', text: 'С 25 января по 31 января - зимние каникулы. Занятия возобновятся 1 февраля.', date: '2026-01-08', pinned: false },
    { id: 3, title: 'Олимпиада по математике', text: 'Приглашаем учеников 5-11 классов принять участие в школьной олимпиаде по математике 15 января.', date: '2026-01-05', pinned: false },
  ];
};

const getContactsData = () => {
  const saved = localStorage.getItem('contactsData');
  return saved ? JSON.parse(saved) : {
    phone: '+7 (495) 123-45-67',
    email: 'school@example.ru',
    address: 'г. Москва, ул. Школьная, д. 1'
  };
};

export default function Index() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedClass, setSelectedClass] = useState(() => localStorage.getItem('myClass') || '');
  const [showClassSelector, setShowClassSelector] = useState(() => !localStorage.getItem('myClass'));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scheduleData, setScheduleData] = useState(getScheduleData());
  const [bellsData, setBellsData] = useState(getBellsData());
  const [menuData, setMenuData] = useState(getMenuData());
  const [teachersData, setTeachersData] = useState(getTeachersData());
  const [newsData, setNewsData] = useState(getNewsData());
  const [contactsData, setContactsData] = useState(getContactsData());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setScheduleData(getScheduleData());
      setBellsData(getBellsData());
      setMenuData(getMenuData());
      setTeachersData(getTeachersData());
      setNewsData(getNewsData());
      setContactsData(getContactsData());
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const getCurrentDayIndex = () => currentTime.getDay() === 0 ? 6 : currentTime.getDay() - 1;
  const currentDay = DAYS[getCurrentDayIndex()];

  const getCurrentLesson = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hours * 60 + minutes;

    const todayBells = bellsData[currentDay] || bellsData['Понедельник'] || [];

    for (const bell of todayBells) {
      const [startH, startM] = bell.start.split(':').map(Number);
      const [endH, endM] = bell.end.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        return { status: 'lesson', lesson: bell.lesson, minutesLeft: endMinutes - currentMinutes };
      }

      if (bell.lesson < todayBells.length) {
        const nextBell = todayBells.find(b => b.lesson === bell.lesson + 1);
        if (nextBell) {
          const [nextH, nextM] = nextBell.start.split(':').map(Number);
          const nextStartMinutes = nextH * 60 + nextM;
          if (currentMinutes >= endMinutes && currentMinutes < nextStartMinutes) {
            return { status: 'break', nextLesson: bell.lesson + 1, minutesLeft: nextStartMinutes - currentMinutes };
          }
        }
      }
    }

    const firstLesson = todayBells[0];
    const [firstH, firstM] = firstLesson.start.split(':').map(Number);
    const firstStartMinutes = firstH * 60 + firstM;
    if (currentMinutes < firstStartMinutes) {
      return { status: 'before', minutesLeft: firstStartMinutes - currentMinutes };
    }

    return { status: 'after' };
  };

  const lessonInfo = getCurrentLesson();

  const handleClassSelect = (className: string) => {
    setSelectedClass(className);
    localStorage.setItem('myClass', className);
    setShowClassSelector(false);
  };

  const handleChangeClass = () => {
    setShowClassSelector(true);
  };

  if (showClassSelector) {
    return <ClassSelector onClassSelect={handleClassSelect} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Школа 📚
            </h1>
            <Button variant="link" className="h-auto p-0 text-sm" onClick={handleChangeClass}>
              {selectedClass} • Сменить класс
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="/teacher" title="Вход для учителей">
                <Icon name="User" size={18} />
              </a>
            </Button>
            <Icon name="Sun" size={18} className="text-muted-foreground" />
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            <Icon name="Moon" size={18} className="text-muted-foreground" />
          </div>
        </div>

        {activeTab === 'home' ? (
          <HomeTab
            currentTime={currentTime}
            currentDay={currentDay}
            lessonInfo={lessonInfo}
            onTabChange={setActiveTab}
          />
        ) : (
          <TabContentComponent
            activeTab={activeTab}
            selectedClass={selectedClass}
            scheduleData={scheduleData}
            bellsData={bellsData}
            menuData={menuData}
            teachersData={teachersData}
            newsData={newsData}
            contactsData={contactsData}
            onBack={() => setActiveTab('home')}
          />
        )}
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}