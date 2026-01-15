import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
const CLASSES = ['1А', '1Б', '2А', '2Б', '3А', '3Б', '4А', '4Б', '5А', '5Б', '6А', '6Б', '7А', '7Б', '8А', '8Б', '9А', '9Б', '10А', '10Б', '11А', '11Б'];

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
  const [selectedClass, setSelectedClass] = useState('5А');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Школа 📚
          </h1>
          <div className="flex items-center gap-2">
            <Icon name="Sun" size={18} className="text-muted-foreground" />
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            <Icon name="Moon" size={18} className="text-muted-foreground" />
          </div>
        </div>

        {activeTab === 'home' && (
          <div className="space-y-4 animate-slide-up">
            <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
              <div className="text-center space-y-3">
                <div className="text-sm opacity-90">{currentDay}</div>
                <div className="text-4xl font-heading font-bold">
                  {currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </div>
                
                {lessonInfo.status === 'lesson' && (
                  <div className="space-y-2 animate-pulse-soft">
                    <div className="text-lg font-semibold">Урок {lessonInfo.lesson}</div>
                    <div className="text-2xl font-heading font-bold">{lessonInfo.minutesLeft} мин</div>
                    <div className="text-sm opacity-90">до конца урока</div>
                  </div>
                )}

                {lessonInfo.status === 'break' && (
                  <div className="space-y-2 animate-pulse-soft">
                    <div className="text-lg font-semibold">Перемена</div>
                    <div className="text-2xl font-heading font-bold">{lessonInfo.minutesLeft} мин</div>
                    <div className="text-sm opacity-90">до {lessonInfo.nextLesson} урока</div>
                  </div>
                )}

                {lessonInfo.status === 'before' && (
                  <div className="space-y-2">
                    <div className="text-lg font-semibold">До начала занятий</div>
                    <div className="text-2xl font-heading font-bold">{lessonInfo.minutesLeft} мин</div>
                  </div>
                )}

                {lessonInfo.status === 'after' && (
                  <div className="space-y-2">
                    <div className="text-lg font-semibold">Уроки закончились</div>
                    <div className="text-sm opacity-90">Увидимся завтра! 👋</div>
                  </div>
                )}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 hover-scale"
                onClick={() => setActiveTab('schedule')}
              >
                <Icon name="Calendar" size={28} className="text-primary" />
                <span className="font-semibold">Расписание</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 hover-scale"
                onClick={() => setActiveTab('bells')}
              >
                <Icon name="Bell" size={28} className="text-accent" />
                <span className="font-semibold">Звонки</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 hover-scale"
                onClick={() => setActiveTab('menu')}
              >
                <Icon name="UtensilsCrossed" size={28} className="text-secondary" />
                <span className="font-semibold">Столовая</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 hover-scale"
                onClick={() => setActiveTab('teachers')}
              >
                <Icon name="Users" size={28} className="text-primary" />
                <span className="font-semibold">Учителя</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 hover-scale"
                onClick={() => setActiveTab('contacts')}
              >
                <Icon name="Phone" size={28} className="text-accent" />
                <span className="font-semibold">Контакты</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 hover-scale"
                onClick={() => setActiveTab('info')}
              >
                <Icon name="Info" size={28} className="text-secondary" />
                <span className="font-semibold">Информация</span>
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" onClick={() => setActiveTab('home')} className="mb-2">
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            
            <Card className="p-4">
              <h2 className="text-2xl font-heading font-bold mb-4">Расписание уроков</h2>
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">Выберите класс</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Tabs defaultValue="Понедельник" className="w-full">
                <TabsList className="grid grid-cols-5 w-full mb-4">
                  {DAYS.slice(0, 5).map(day => (
                    <TabsTrigger key={day} value={day} className="text-xs">
                      {day.slice(0, 2)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {DAYS.slice(0, 5).map(day => (
                  <TabsContent key={day} value={day} className="space-y-2">
                    {(scheduleData[selectedClass]?.[day] || 
                      scheduleData['5А']?.[day] || []).map((subject, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                          {idx + 1}
                        </div>
                        <span className="font-medium">{subject}</span>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </div>
        )}

        {activeTab === 'bells' && (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" onClick={() => setActiveTab('home')} className="mb-2">
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            
            <Card className="p-4">
              <h2 className="text-2xl font-heading font-bold mb-4">Расписание звонков</h2>
              <Tabs defaultValue="Понедельник" className="w-full">
                <TabsList className="grid grid-cols-5 w-full mb-4">
                  {DAYS.slice(0, 5).map(day => (
                    <TabsTrigger key={day} value={day} className="text-xs">
                      {day.slice(0, 2)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {DAYS.slice(0, 5).map(day => (
                  <TabsContent key={day} value={day} className="space-y-2">
                    {(bellsData[day] || bellsData['Понедельник'] || []).map((bell) => (
                      <div key={bell.lesson} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-accent/10 to-primary/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-accent-foreground">
                            {bell.lesson}
                          </div>
                          <span className="font-semibold">Урок {bell.lesson}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-semibold">{bell.start}</div>
                          <div className="text-sm text-muted-foreground">{bell.end}</div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" onClick={() => setActiveTab('home')} className="mb-2">
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            
            <Card className="p-4">
              <h2 className="text-2xl font-heading font-bold mb-4">Меню столовой</h2>
              <Tabs defaultValue="Понедельник" className="w-full">
                <TabsList className="grid grid-cols-5 w-full mb-4">
                  {DAYS.slice(0, 5).map(day => (
                    <TabsTrigger key={day} value={day} className="text-xs">
                      {day.slice(0, 2)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {DAYS.slice(0, 5).map(day => (
                  <TabsContent key={day} value={day} className="space-y-4">
                    <div>
                      <h3 className="font-heading font-bold text-lg mb-2 flex items-center gap-2">
                        <Icon name="Coffee" size={20} className="text-secondary" />
                        Завтрак
                      </h3>
                      <ul className="space-y-1">
                        {(menuData[day]?.breakfast || menuData['Понедельник']?.breakfast || []).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-secondary">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg mb-2 flex items-center gap-2">
                        <Icon name="UtensilsCrossed" size={20} className="text-primary" />
                        Обед
                      </h3>
                      <ul className="space-y-1">
                        {(menuData[day]?.lunch || menuData['Понедельник']?.lunch || []).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-primary">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" onClick={() => setActiveTab('home')} className="mb-2">
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            
            <Card className="p-4">
              <h2 className="text-2xl font-heading font-bold mb-4">Учителя</h2>
              <div className="space-y-3">
                {teachersData.map((teacher, idx) => (
                  <Card key={idx} className="p-4 bg-muted/30">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-heading font-bold text-lg">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{teacher.name}</h3>
                        <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                        <p className="text-xs text-accent mt-1">{teacher.category}</p>
                        <Button variant="link" className="h-auto p-0 text-xs mt-2" asChild>
                          <a href={`tel:${teacher.phone}`}>
                            <Icon name="Phone" size={14} className="mr-1" />
                            {teacher.phone}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" onClick={() => setActiveTab('home')} className="mb-2">
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            
            <Card className="p-6">
              <h2 className="text-2xl font-heading font-bold mb-6">Контакты школы</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="Phone" size={24} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Телефон</div>
                    <a href={`tel:${contactsData.phone}`} className="text-lg font-semibold hover:text-primary">
                      {contactsData.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Icon name="Mail" size={24} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Email</div>
                    <a href={`mailto:${contactsData.email}`} className="text-lg font-semibold hover:text-accent">
                      {contactsData.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Icon name="MapPin" size={24} className="text-secondary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Адрес</div>
                    <p className="text-lg font-semibold">
                      {contactsData.address}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button className="w-full" asChild>
                    <a href={`tel:${contactsData.phone}`}>
                      <Icon name="Phone" size={18} className="mr-2" />
                      Позвонить
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`mailto:${contactsData.email}`}>
                      <Icon name="Mail" size={18} className="mr-2" />
                      Написать
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-4 animate-fade-in">
            <Button variant="ghost" onClick={() => setActiveTab('home')} className="mb-2">
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            
            <Card className="p-4">
              <h2 className="text-2xl font-heading font-bold mb-4">Информация и новости</h2>
              <div className="space-y-3">
                {newsData.map((item) => (
                  <Card key={item.id} className={`p-4 ${item.pinned ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary' : 'bg-muted/30'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                        {item.pinned && <Icon name="Pin" size={16} className="text-primary" />}
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm mb-2">{item.text}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon name="Calendar" size={14} />
                      {new Date(item.date).toLocaleDateString('ru-RU')}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-md mx-auto grid grid-cols-6 gap-1 p-2">
          <Button
            variant={activeTab === 'home' ? 'default' : 'ghost'}
            className="flex-col h-16 gap-1"
            onClick={() => setActiveTab('home')}
          >
            <Icon name="Home" size={20} />
            <span className="text-xs">Главная</span>
          </Button>
          <Button
            variant={activeTab === 'schedule' ? 'default' : 'ghost'}
            className="flex-col h-16 gap-1"
            onClick={() => setActiveTab('schedule')}
          >
            <Icon name="Calendar" size={20} />
            <span className="text-xs">Уроки</span>
          </Button>
          <Button
            variant={activeTab === 'bells' ? 'default' : 'ghost'}
            className="flex-col h-16 gap-1"
            onClick={() => setActiveTab('bells')}
          >
            <Icon name="Bell" size={20} />
            <span className="text-xs">Звонки</span>
          </Button>
          <Button
            variant={activeTab === 'menu' ? 'default' : 'ghost'}
            className="flex-col h-16 gap-1"
            onClick={() => setActiveTab('menu')}
          >
            <Icon name="UtensilsCrossed" size={20} />
            <span className="text-xs">Еда</span>
          </Button>
          <Button
            variant={activeTab === 'teachers' ? 'default' : 'ghost'}
            className="flex-col h-16 gap-1"
            onClick={() => setActiveTab('teachers')}
          >
            <Icon name="Users" size={20} />
            <span className="text-xs">Учителя</span>
          </Button>
          <Button
            variant={activeTab === 'info' ? 'default' : 'ghost'}
            className="flex-col h-16 gap-1"
            onClick={() => setActiveTab('info')}
          >
            <Icon name="Info" size={20} />
            <span className="text-xs">Инфо</span>
          </Button>
        </div>
      </div>
    </div>
  );
}