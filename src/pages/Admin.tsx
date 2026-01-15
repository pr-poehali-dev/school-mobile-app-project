import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Schedule {
  [className: string]: {
    [day: string]: string[];
  };
}

interface Bell {
  lesson: number;
  start: string;
  end: string;
}

interface Menu {
  [day: string]: {
    breakfast: string[];
    lunch: string[];
  };
}

interface Teacher {
  name: string;
  subject: string;
  category: string;
  phone: string;
}

interface NewsItem {
  id: number;
  title: string;
  text: string;
  date: string;
  pinned: boolean;
}

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];

export default function Admin() {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(() => !localStorage.getItem('adminPassword'));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [scheduleData, setScheduleData] = useState<Schedule>(() => {
    const saved = localStorage.getItem('scheduleData');
    return saved ? JSON.parse(saved) : {
      '5А': {
        'Понедельник': ['Математика', 'Русский язык', 'История', 'Физкультура', 'Английский язык'],
        'Вторник': ['Литература', 'Математика', 'Биология', 'География', 'ИЗО'],
        'Среда': ['Русский язык', 'Английский язык', 'Математика', 'Технология', 'Технология'],
        'Четверг': ['История', 'Физика', 'Математика', 'Русский язык', 'Музыка'],
        'Пятница': ['Английский язык', 'Литература', 'Обществознание', 'Биология', 'Физкультура'],
      }
    };
  });

  const [bellsData, setBellsData] = useState<{ [day: string]: Bell[] }>(() => {
    const saved = localStorage.getItem('bellsData');
    return saved ? JSON.parse(saved) : {
      'Понедельник': [
        { lesson: 1, start: '08:30', end: '09:15' },
        { lesson: 2, start: '09:25', end: '10:10' },
        { lesson: 3, start: '10:30', end: '11:15' },
        { lesson: 4, start: '11:35', end: '12:20' },
        { lesson: 5, start: '12:30', end: '13:15' },
        { lesson: 6, start: '13:25', end: '14:10' },
      ]
    };
  });

  const [menuData, setMenuData] = useState<Menu>(() => {
    const saved = localStorage.getItem('menuData');
    return saved ? JSON.parse(saved) : {
      'Понедельник': {
        breakfast: ['Каша овсяная', 'Масло сливочное', 'Чай с сахаром', 'Булочка'],
        lunch: ['Борщ', 'Котлета куриная', 'Пюре картофельное', 'Салат из капусты', 'Компот', 'Хлеб'],
      }
    };
  });

  const [teachersData, setTeachersData] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('teachersData');
    return saved ? JSON.parse(saved) : [
      { name: 'Иванова Мария Петровна', subject: 'Математика', category: 'Точные науки', phone: '+7 (999) 123-45-67' },
    ];
  });

  const [newsData, setNewsData] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('newsData');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Родительское собрание', text: 'Уважаемые родители! 20 января в 18:00 состоится общешкольное родительское собрание.', date: '2026-01-10', pinned: true },
    ];
  });

  const [contactsData, setContactsData] = useState(() => {
    const saved = localStorage.getItem('contactsData');
    return saved ? JSON.parse(saved) : {
      phone: '+7 (495) 123-45-67',
      email: 'school@example.ru',
      address: 'г. Москва, ул. Школьная, д. 1'
    };
  });

  const [selectedClass, setSelectedClass] = useState('5А');
  const [selectedDay, setSelectedDay] = useState('Понедельник');

  const handleSetPassword = () => {
    if (password.length < 4) {
      toast({ title: 'Ошибка', description: 'Пароль должен быть минимум 4 символа', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Ошибка', description: 'Пароли не совпадают', variant: 'destructive' });
      return;
    }
    localStorage.setItem('adminPassword', password);
    setIsSettingPassword(false);
    setIsLoggedIn(true);
    setPassword('');
    setConfirmPassword('');
    toast({ title: 'Пароль установлен', description: 'Теперь вы в админ-панели!' });
  };

  const handleLogin = () => {
    const savedPassword = localStorage.getItem('adminPassword');
    if (password === savedPassword) {
      setIsLoggedIn(true);
      setPassword('');
      toast({ title: 'Успешный вход', description: 'Добро пожаловать в админ-панель!' });
    } else {
      toast({ title: 'Ошибка входа', description: 'Неверный пароль', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
  };

  const saveSchedule = () => {
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
    toast({ title: 'Сохранено', description: 'Расписание уроков обновлено' });
  };

  const saveBells = () => {
    localStorage.setItem('bellsData', JSON.stringify(bellsData));
    toast({ title: 'Сохранено', description: 'Расписание звонков обновлено' });
  };

  const saveMenu = () => {
    localStorage.setItem('menuData', JSON.stringify(menuData));
    toast({ title: 'Сохранено', description: 'Меню столовой обновлено' });
  };

  const saveTeachers = () => {
    localStorage.setItem('teachersData', JSON.stringify(teachersData));
    toast({ title: 'Сохранено', description: 'Список учителей обновлен' });
  };

  const saveNews = () => {
    localStorage.setItem('newsData', JSON.stringify(newsData));
    toast({ title: 'Сохранено', description: 'Информация обновлена' });
  };

  const saveContacts = () => {
    localStorage.setItem('contactsData', JSON.stringify(contactsData));
    toast({ title: 'Сохранено', description: 'Контакты обновлены' });
  };

  const addLesson = () => {
    if (!scheduleData[selectedClass]) {
      scheduleData[selectedClass] = {};
    }
    if (!scheduleData[selectedClass][selectedDay]) {
      scheduleData[selectedClass][selectedDay] = [];
    }
    scheduleData[selectedClass][selectedDay].push('Новый урок');
    setScheduleData({ ...scheduleData });
  };

  const removeLesson = (idx: number) => {
    scheduleData[selectedClass][selectedDay].splice(idx, 1);
    setScheduleData({ ...scheduleData });
  };

  const updateLesson = (idx: number, value: string) => {
    scheduleData[selectedClass][selectedDay][idx] = value;
    setScheduleData({ ...scheduleData });
  };

  const addBell = () => {
    if (!bellsData[selectedDay]) {
      bellsData[selectedDay] = [];
    }
    const newLesson = bellsData[selectedDay].length + 1;
    bellsData[selectedDay].push({ lesson: newLesson, start: '08:00', end: '08:45' });
    setBellsData({ ...bellsData });
  };

  const removeBell = (idx: number) => {
    bellsData[selectedDay].splice(idx, 1);
    setBellsData({ ...bellsData });
  };

  const updateBell = (idx: number, field: 'start' | 'end', value: string) => {
    bellsData[selectedDay][idx][field] = value;
    setBellsData({ ...bellsData });
  };

  const addTeacher = () => {
    setTeachersData([...teachersData, { name: '', subject: '', category: '', phone: '' }]);
  };

  const removeTeacher = (idx: number) => {
    const updated = teachersData.filter((_, i) => i !== idx);
    setTeachersData(updated);
  };

  const updateTeacher = (idx: number, field: keyof Teacher, value: string) => {
    teachersData[idx][field] = value;
    setTeachersData([...teachersData]);
  };

  const addNews = () => {
    const newId = Math.max(...newsData.map(n => n.id), 0) + 1;
    setNewsData([...newsData, { id: newId, title: '', text: '', date: new Date().toISOString().split('T')[0], pinned: false }]);
  };

  const removeNews = (id: number) => {
    setNewsData(newsData.filter(n => n.id !== id));
  };

  const updateNews = (id: number, field: keyof NewsItem, value: string | boolean) => {
    const updated = newsData.map(n => n.id === id ? { ...n, [field]: value } : n);
    setNewsData(updated);
  };

  if (isSettingPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Придумай пароль
            </h1>
            <p className="text-muted-foreground">Для входа в админ-панель</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword">Пароль (минимум 4 символа)</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Повтори пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetPassword()}
              />
            </div>
            <Button className="w-full" onClick={handleSetPassword}>
              <Icon name="Check" size={18} className="mr-2" />
              Установить пароль
            </Button>
            <div className="text-center">
              <Button variant="link" asChild>
                <a href="/">← Вернуться на главную</a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔑</div>
            <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Вход в админ-панель
            </h1>
            <p className="text-muted-foreground">Введи свой пароль</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                autoFocus
              />
            </div>
            <Button className="w-full" onClick={handleLogin}>
              <Icon name="LogIn" size={18} className="mr-2" />
              Войти
            </Button>
            <div className="text-center">
              <Button variant="link" asChild>
                <a href="/">← Вернуться на главную</a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Панель администратора
            </h1>
            <p className="text-muted-foreground text-sm">Управление школьным приложением</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/">
                <Icon name="Home" size={18} className="mr-2" />
                На главную
              </a>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full mb-6">
            <TabsTrigger value="schedule">Расписание</TabsTrigger>
            <TabsTrigger value="bells">Звонки</TabsTrigger>
            <TabsTrigger value="menu">Столовая</TabsTrigger>
            <TabsTrigger value="teachers">Учителя</TabsTrigger>
            <TabsTrigger value="contacts">Контакты</TabsTrigger>
            <TabsTrigger value="news">Новости</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-heading font-bold mb-4">Редактирование расписания</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Класс</Label>
                  <Input
                    placeholder="5А"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  />
                </div>
                <div>
                  <Label>День недели</Label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {scheduleData[selectedClass]?.[selectedDay]?.map((lesson, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={lesson}
                      onChange={(e) => updateLesson(idx, e.target.value)}
                      placeholder={`Урок ${idx + 1}`}
                    />
                    <Button variant="destructive" size="icon" onClick={() => removeLesson(idx)}>
                      <Icon name="Trash2" size={18} />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={addLesson} variant="outline" className="flex-1">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить урок
                </Button>
                <Button onClick={saveSchedule} className="flex-1">
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="bells" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-heading font-bold mb-4">Редактирование звонков</h2>
              <div className="mb-4">
                <Label>День недели</Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 mb-4">
                {bellsData[selectedDay]?.map((bell, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="w-12 font-semibold">{bell.lesson} урок</span>
                    <Input
                      type="time"
                      value={bell.start}
                      onChange={(e) => updateBell(idx, 'start', e.target.value)}
                    />
                    <span>—</span>
                    <Input
                      type="time"
                      value={bell.end}
                      onChange={(e) => updateBell(idx, 'end', e.target.value)}
                    />
                    <Button variant="destructive" size="icon" onClick={() => removeBell(idx)}>
                      <Icon name="Trash2" size={18} />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={addBell} variant="outline" className="flex-1">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить урок
                </Button>
                <Button onClick={saveBells} className="flex-1">
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-heading font-bold mb-4">Редактирование меню столовой</h2>
              <div className="mb-4">
                <Label>День недели</Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-lg font-semibold">Завтрак</Label>
                  <Textarea
                    value={menuData[selectedDay]?.breakfast?.join('\n') || ''}
                    onChange={(e) => {
                      if (!menuData[selectedDay]) menuData[selectedDay] = { breakfast: [], lunch: [] };
                      menuData[selectedDay].breakfast = e.target.value.split('\n').filter(Boolean);
                      setMenuData({ ...menuData });
                    }}
                    placeholder="Каждое блюдо с новой строки"
                    rows={4}
                  />
                </div>
                <div>
                  <Label className="text-lg font-semibold">Обед</Label>
                  <Textarea
                    value={menuData[selectedDay]?.lunch?.join('\n') || ''}
                    onChange={(e) => {
                      if (!menuData[selectedDay]) menuData[selectedDay] = { breakfast: [], lunch: [] };
                      menuData[selectedDay].lunch = e.target.value.split('\n').filter(Boolean);
                      setMenuData({ ...menuData });
                    }}
                    placeholder="Каждое блюдо с новой строки"
                    rows={6}
                  />
                </div>
              </div>
              <Button onClick={saveMenu} className="w-full mt-4">
                <Icon name="Save" size={18} className="mr-2" />
                Сохранить
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-heading font-bold mb-4">Редактирование учителей</h2>
              <div className="space-y-4 mb-4">
                {teachersData.map((teacher, idx) => (
                  <Card key={idx} className="p-4 bg-muted/30">
                    <div className="space-y-2">
                      <Input
                        placeholder="ФИО"
                        value={teacher.name}
                        onChange={(e) => updateTeacher(idx, 'name', e.target.value)}
                      />
                      <Input
                        placeholder="Предмет"
                        value={teacher.subject}
                        onChange={(e) => updateTeacher(idx, 'subject', e.target.value)}
                      />
                      <Input
                        placeholder="Категория"
                        value={teacher.category}
                        onChange={(e) => updateTeacher(idx, 'category', e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Телефон"
                          value={teacher.phone}
                          onChange={(e) => updateTeacher(idx, 'phone', e.target.value)}
                        />
                        <Button variant="destructive" size="icon" onClick={() => removeTeacher(idx)}>
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={addTeacher} variant="outline" className="flex-1">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить учителя
                </Button>
                <Button onClick={saveTeachers} className="flex-1">
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-heading font-bold mb-4">Редактирование контактов</h2>
              <div className="space-y-4">
                <div>
                  <Label>Телефон</Label>
                  <Input
                    value={contactsData.phone}
                    onChange={(e) => setContactsData({ ...contactsData, phone: e.target.value })}
                    placeholder="+7 (495) 123-45-67"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={contactsData.email}
                    onChange={(e) => setContactsData({ ...contactsData, email: e.target.value })}
                    placeholder="school@example.ru"
                  />
                </div>
                <div>
                  <Label>Адрес</Label>
                  <Input
                    value={contactsData.address}
                    onChange={(e) => setContactsData({ ...contactsData, address: e.target.value })}
                    placeholder="г. Москва, ул. Школьная, д. 1"
                  />
                </div>
              </div>
              <Button onClick={saveContacts} className="w-full mt-4">
                <Icon name="Save" size={18} className="mr-2" />
                Сохранить
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-heading font-bold mb-4">Редактирование новостей</h2>
              <div className="space-y-4 mb-4">
                {newsData.map((item) => (
                  <Card key={item.id} className="p-4 bg-muted/30">
                    <div className="space-y-2">
                      <Input
                        placeholder="Заголовок"
                        value={item.title}
                        onChange={(e) => updateNews(item.id, 'title', e.target.value)}
                      />
                      <Textarea
                        placeholder="Текст новости"
                        value={item.text}
                        onChange={(e) => updateNews(item.id, 'text', e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2 items-center">
                        <Input
                          type="date"
                          value={item.date}
                          onChange={(e) => updateNews(item.id, 'date', e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={item.pinned}
                            onCheckedChange={(checked) => updateNews(item.id, 'pinned', checked)}
                          />
                          <Label>Закрепить</Label>
                        </div>
                        <Button variant="destructive" size="icon" onClick={() => removeNews(item.id)}>
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={addNews} variant="outline" className="flex-1">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить новость
                </Button>
                <Button onClick={saveNews} className="flex-1">
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}