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
import FUNC_URLS from '../../backend/func2url.json';

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
  id?: number;
  name: string;
  subject: string;
  category: string;
  phone: string;
}

interface TeacherAccount {
  id?: number;
  username: string;
  full_name: string;
  subject: string;
  class_id: number;
  class_name: string;
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
  const [currentUser, setCurrentUser] = useState<{username: string, role: string, class_id?: number, class_name?: string} | null>(() => {
    const saved = localStorage.getItem('teacherUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('adminPassword') || !!localStorage.getItem('teacherUser'));
  const [isSettingPassword, setIsSettingPassword] = useState(() => !localStorage.getItem('adminPassword') && !localStorage.getItem('teacherUser'));
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

  const [teacherAccounts, setTeacherAccounts] = useState<TeacherAccount[]>([]);
  const [newTeacher, setNewTeacher] = useState({ username: '', password: '', full_name: '', subject: '', class_id: 0 });
  
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

  const [classCodes, setClassCodes] = useState<{id: number, name: string, access_code: string}[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [selectedClass, setSelectedClass] = useState('5А');
  const [selectedDay, setSelectedDay] = useState('Понедельник');
  const [newClassName, setNewClassName] = useState('');
  const [newClassCode, setNewClassCode] = useState('');

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
    setCurrentUser(null);
    localStorage.removeItem('teacherUser');
  };

  const isAdmin = !currentUser || currentUser.role === 'admin';
  const isTeacher = currentUser && currentUser.role === 'teacher';

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

  useEffect(() => {
    if (isLoggedIn) {
      loadClasses();
    }
  }, [isLoggedIn]);

  const loadClasses = async () => {
    try {
      const response = await fetch(FUNC_URLS.classes);
      const data = await response.json();
      if (data.classes) {
        setClassCodes(data.classes);
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить классы', variant: 'destructive' });
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const addNewClass = async () => {
    if (!newClassName.trim()) {
      toast({ title: 'Ошибка', description: 'Заполните название класса', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(FUNC_URLS.classes, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newClassName.trim(),
          access_code: newClassCode.trim() || undefined
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        await loadClasses();
        setNewClassName('');
        setNewClassCode('');
        toast({ title: 'Успешно', description: `Класс ${data.class.name} добавлен с кодом ${data.class.access_code}` });
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось добавить класс', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось добавить класс', variant: 'destructive' });
    }
  };

  const updateClassCode = async (classId: number, newCode: string) => {
    try {
      const response = await fetch(FUNC_URLS.classes, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: classId, access_code: newCode })
      });

      if (response.ok) {
        await loadClasses();
        toast({ title: 'Успешно', description: 'Код обновлен' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить код', variant: 'destructive' });
    }
  };

  const loadTeacherAccounts = async () => {
    try {
      const response = await fetch(`${FUNC_URLS.auth}?action=list_teachers`);
      const data = await response.json();
      if (data.teachers) {
        setTeacherAccounts(data.teachers);
      }
    } catch (error) {
      console.error('Ошибка загрузки учителей:', error);
    }
  };

  const createTeacherAccount = async () => {
    if (!newTeacher.username || !newTeacher.password || !newTeacher.full_name || !newTeacher.class_id) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(FUNC_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_teacher',
          username: newTeacher.username,
          password: newTeacher.password,
          full_name: newTeacher.full_name,
          subject: newTeacher.subject,
          class_id: newTeacher.class_id
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        await loadTeacherAccounts();
        setNewTeacher({ username: '', password: '', full_name: '', subject: '', class_id: 0 });
        toast({ title: 'Успешно', description: 'Учитель добавлен' });
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось создать учителя', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось создать учителя', variant: 'destructive' });
    }
  };

  const deleteTeacherAccount = async (teacherId: number) => {
    try {
      const response = await fetch(FUNC_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_teacher',
          teacher_id: teacherId
        })
      });

      if (response.ok) {
        await loadTeacherAccounts();
        toast({ title: 'Успешно', description: 'Учитель удален' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось удалить учителя', variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      loadTeacherAccounts();
    }
  }, [isLoggedIn, isAdmin]);

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
              {isTeacher ? `Панель учителя ${currentUser?.class_name || ''}` : 'Панель администратора'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isTeacher ? `Управление классом ${currentUser?.class_name}` : 'Управление школьным приложением'}
            </p>
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

        <Tabs defaultValue={isTeacher ? "schedule" : "classes"} className="w-full">
          <TabsList className={`grid ${isAdmin ? 'grid-cols-4 lg:grid-cols-8' : 'grid-cols-2 lg:grid-cols-4'} w-full mb-6`}>
            {isAdmin && <TabsTrigger value="classes">Классы</TabsTrigger>}
            <TabsTrigger value="schedule">Расписание</TabsTrigger>
            {isAdmin && <TabsTrigger value="bells">Звонки</TabsTrigger>}
            {isAdmin && <TabsTrigger value="menu">Столовая</TabsTrigger>}
            {isAdmin && <TabsTrigger value="teacher-accounts">Учителя</TabsTrigger>}
            {isAdmin && <TabsTrigger value="teachers">Справочник</TabsTrigger>}
            {isAdmin && <TabsTrigger value="contacts">Контакты</TabsTrigger>}
            <TabsTrigger value="news">Новости</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-heading font-bold mb-4">Управление классами и кодами доступа</h2>
              <p className="text-muted-foreground mb-6">
                Каждый класс имеет уникальный код для входа учеников в приложение
              </p>
              
              {isLoadingClasses ? (
                <div className="text-center py-8">
                  <Icon name="Loader2" size={32} className="animate-spin mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground mt-2">Загрузка классов...</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <div className="grid gap-4">
                    {classCodes.map((classItem) => (
                      <div key={classItem.id} className="flex gap-2 items-center p-4 border rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{classItem.name}</div>
                          <div className="text-sm text-muted-foreground">Код класса</div>
                        </div>
                        <Input
                          value={classItem.access_code}
                          onBlur={(e) => {
                            if (e.target.value !== classItem.access_code) {
                              updateClassCode(classItem.id, e.target.value);
                            }
                          }}
                          className="w-40 font-mono text-center uppercase"
                          placeholder="КОД"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Добавить новый класс</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Название класса (например: 9В)"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                  />
                  <Input
                    placeholder="Код (оставь пустым для автогенерации)"
                    value={newClassCode}
                    onChange={(e) => setNewClassCode(e.target.value)}
                    className="flex-1 font-mono uppercase"
                  />
                  <Button onClick={addNewClass}>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  💡 Если не указать код, он будет сгенерирован автоматически
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="teacher-accounts" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-heading font-bold mb-4">Управление учителями</h2>
              <p className="text-muted-foreground mb-6">
                Создавайте аккаунты для учителей с привязкой к классу
              </p>

              <div className="space-y-4 mb-6">
                {teacherAccounts.map((teacher) => (
                  <div key={teacher.id} className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{teacher.full_name}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          <span className="font-mono bg-background px-2 py-0.5 rounded">@{teacher.username}</span>
                          {teacher.subject && <span className="ml-2">• {teacher.subject}</span>}
                        </div>
                        <div className="text-sm mt-1">
                          Класс: <span className="font-semibold">{teacher.class_name}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => teacher.id && deleteTeacherAccount(teacher.id)}
                      >
                        <Icon name="Trash2" size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Добавить нового учителя</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Логин</Label>
                      <Input
                        placeholder="ivanov"
                        value={newTeacher.username}
                        onChange={(e) => setNewTeacher({...newTeacher, username: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Пароль</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={newTeacher.password}
                        onChange={(e) => setNewTeacher({...newTeacher, password: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>ФИО учителя</Label>
                    <Input
                      placeholder="Иванов Иван Иванович"
                      value={newTeacher.full_name}
                      onChange={(e) => setNewTeacher({...newTeacher, full_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Предмет</Label>
                    <Input
                      placeholder="Математика"
                      value={newTeacher.subject}
                      onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Класс</Label>
                    <Select
                      value={newTeacher.class_id.toString()}
                      onValueChange={(val) => setNewTeacher({...newTeacher, class_id: parseInt(val)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите класс" />
                      </SelectTrigger>
                      <SelectContent>
                        {classCodes.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={createTeacherAccount} className="w-full">
                    <Icon name="UserPlus" size={18} className="mr-2" />
                    Создать учителя
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

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