import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import FUNC_URLS from '../../backend/func2url.json';
import AdminAuth from '@/components/admin/AdminAuth';
import AdminTabs from '@/components/admin/AdminTabs';
import { Schedule, Bell, Menu, Teacher, TeacherAccount, NewsItem, ClassItem, TeacherScheduleItem } from '@/components/admin/AdminTypes';
import TeacherScheduleTab from '@/components/admin/TeacherScheduleTab';

export default function Admin() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<{id?: number, username: string, role: string, subject?: string, class_id?: number | null, class_name?: string | null} | null>(() => {
    const saved = localStorage.getItem('teacherUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('adminPassword') || !!localStorage.getItem('teacherUser'));
  const [isSettingPassword, setIsSettingPassword] = useState(() => !localStorage.getItem('adminPassword') && !localStorage.getItem('teacherUser'));
  
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
  const [newTeacher, setNewTeacher] = useState({ username: '', password: '', full_name: '', subject: '', class_id: null as number | null });
  
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

  const [classCodes, setClassCodes] = useState<ClassItem[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [selectedClass, setSelectedClass] = useState('5А');
  const [selectedDay, setSelectedDay] = useState('Понедельник');
  const [newClassName, setNewClassName] = useState('');
  const [newClassCode, setNewClassCode] = useState('');
  const [teacherSchedule, setTeacherSchedule] = useState<TeacherScheduleItem[]>([]);
  const [isLoadingTeacherSchedule, setIsLoadingTeacherSchedule] = useState(false);

  const handleSetPassword = (password: string, confirmPassword: string) => {
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
    toast({ title: 'Пароль установлен', description: 'Теперь вы в админ-панели!' });
  };

  const handleLogin = (password: string) => {
    const savedPassword = localStorage.getItem('adminPassword');
    if (password === savedPassword) {
      setIsLoggedIn(true);
      toast({ title: 'Успешный вход', description: 'Добро пожаловать в админ-панель!' });
    } else {
      toast({ title: 'Ошибка входа', description: 'Неверный пароль', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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
    if (!newTeacher.username || !newTeacher.password || !newTeacher.full_name) {
      toast({ title: 'Ошибка', description: 'Заполните обязательные поля', variant: 'destructive' });
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

  useEffect(() => {
    if (isLoggedIn && isTeacher && currentUser?.id) {
      loadTeacherSchedule();
    }
  }, [isLoggedIn, isTeacher, currentUser?.id]);

  const loadTeacherSchedule = async () => {
    if (!currentUser?.id) return;
    setIsLoadingTeacherSchedule(true);
    try {
      const response = await fetch(`${FUNC_URLS['teacher-schedule']}?user_id=${currentUser.id}`);
      const data = await response.json();
      if (data.schedule) {
        setTeacherSchedule(data.schedule);
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить расписание', variant: 'destructive' });
    } finally {
      setIsLoadingTeacherSchedule(false);
    }
  };

  const saveTeacherSchedule = async () => {
    if (!currentUser?.id || !currentUser?.subject) return;
    
    try {
      for (const item of teacherSchedule) {
        await fetch(FUNC_URLS['teacher-schedule'], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: currentUser.id,
            day_of_week: item.day_of_week,
            lesson_number: item.lesson_number,
            subject: currentUser.subject,
            class_id: item.class_id
          })
        });
      }
      toast({ title: 'Сохранено', description: 'Расписание обновлено' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось сохранить расписание', variant: 'destructive' });
    }
  };

  if (!isLoggedIn || isSettingPassword) {
    return (
      <AdminAuth
        isSettingPassword={isSettingPassword}
        onSetPassword={handleSetPassword}
        onLogin={handleLogin}
      />
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

        {isTeacher && currentUser?.subject ? (
          <TeacherScheduleTab
            userId={currentUser.id!}
            subject={currentUser.subject}
            classCodes={classCodes}
            scheduleData={teacherSchedule}
            onScheduleChange={setTeacherSchedule}
            onSave={saveTeacherSchedule}
          />
        ) : (
          <AdminTabs
            isAdmin={isAdmin}
            isTeacher={isTeacher}
            scheduleData={scheduleData}
            bellsData={bellsData}
            menuData={menuData}
            teachersData={teachersData}
            teacherAccounts={teacherAccounts}
            newsData={newsData}
            contactsData={contactsData}
            classCodes={classCodes}
            isLoadingClasses={isLoadingClasses}
            selectedClass={selectedClass}
            selectedDay={selectedDay}
            newClassName={newClassName}
            newClassCode={newClassCode}
            newTeacher={newTeacher}
            onScheduleChange={setScheduleData}
            onBellsChange={setBellsData}
            onMenuChange={setMenuData}
            onTeachersChange={setTeachersData}
            onNewsChange={setNewsData}
            onContactsChange={setContactsData}
            onSelectedClassChange={setSelectedClass}
            onSelectedDayChange={setSelectedDay}
            onNewClassNameChange={setNewClassName}
            onNewClassCodeChange={setNewClassCode}
            onNewTeacherChange={setNewTeacher}
            onSaveSchedule={saveSchedule}
            onSaveBells={saveBells}
            onSaveMenu={saveMenu}
            onSaveTeachers={saveTeachers}
            onSaveNews={saveNews}
            onSaveContacts={saveContacts}
            onAddLesson={addLesson}
            onRemoveLesson={removeLesson}
            onUpdateLesson={updateLesson}
            onAddBell={addBell}
            onRemoveBell={removeBell}
            onUpdateBell={updateBell}
            onAddTeacher={addTeacher}
            onRemoveTeacher={removeTeacher}
            onUpdateTeacher={updateTeacher}
            onAddNews={addNews}
            onRemoveNews={removeNews}
            onUpdateNews={updateNews}
            onAddNewClass={addNewClass}
            onUpdateClassCode={updateClassCode}
            onCreateTeacherAccount={createTeacherAccount}
            onDeleteTeacherAccount={deleteTeacherAccount}
          />
        )}
      </div>
    </div>
  );
}