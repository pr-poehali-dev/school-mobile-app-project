import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Schedule, Bell, Menu, Teacher, TeacherAccount, NewsItem, ClassItem, DAYS } from './AdminTypes';

interface AdminTabsProps {
  isAdmin: boolean;
  isTeacher: boolean;
  scheduleData: Schedule;
  bellsData: { [day: string]: Bell[] };
  menuData: Menu;
  teachersData: Teacher[];
  teacherAccounts: TeacherAccount[];
  newsData: NewsItem[];
  contactsData: { phone: string; email: string; address: string };
  classCodes: ClassItem[];
  isLoadingClasses: boolean;
  selectedClass: string;
  selectedDay: string;
  newClassName: string;
  newClassCode: string;
  newTeacher: { username: string; password: string; full_name: string; subject: string; class_id: number };
  onScheduleChange: (data: Schedule) => void;
  onBellsChange: (data: { [day: string]: Bell[] }) => void;
  onMenuChange: (data: Menu) => void;
  onTeachersChange: (data: Teacher[]) => void;
  onNewsChange: (data: NewsItem[]) => void;
  onContactsChange: (data: { phone: string; email: string; address: string }) => void;
  onSelectedClassChange: (className: string) => void;
  onSelectedDayChange: (day: string) => void;
  onNewClassNameChange: (name: string) => void;
  onNewClassCodeChange: (code: string) => void;
  onNewTeacherChange: (teacher: { username: string; password: string; full_name: string; subject: string; class_id: number }) => void;
  onSaveSchedule: () => void;
  onSaveBells: () => void;
  onSaveMenu: () => void;
  onSaveTeachers: () => void;
  onSaveNews: () => void;
  onSaveContacts: () => void;
  onAddLesson: () => void;
  onRemoveLesson: (idx: number) => void;
  onUpdateLesson: (idx: number, value: string) => void;
  onAddBell: () => void;
  onRemoveBell: (idx: number) => void;
  onUpdateBell: (idx: number, field: 'start' | 'end', value: string) => void;
  onAddTeacher: () => void;
  onRemoveTeacher: (idx: number) => void;
  onUpdateTeacher: (idx: number, field: keyof Teacher, value: string) => void;
  onAddNews: () => void;
  onRemoveNews: (id: number) => void;
  onUpdateNews: (id: number, field: keyof NewsItem, value: string | boolean) => void;
  onAddNewClass: () => void;
  onUpdateClassCode: (classId: number, newCode: string) => void;
  onCreateTeacherAccount: () => void;
  onDeleteTeacherAccount: (teacherId: number) => void;
}

export default function AdminTabs(props: AdminTabsProps) {
  const {
    isAdmin,
    scheduleData,
    bellsData,
    menuData,
    teachersData,
    teacherAccounts,
    newsData,
    contactsData,
    classCodes,
    isLoadingClasses,
    selectedClass,
    selectedDay,
    newClassName,
    newClassCode,
    newTeacher,
    onScheduleChange,
    onBellsChange,
    onMenuChange,
    onTeachersChange,
    onNewsChange,
    onContactsChange,
    onSelectedClassChange,
    onSelectedDayChange,
    onNewClassNameChange,
    onNewClassCodeChange,
    onNewTeacherChange,
    onSaveSchedule,
    onSaveBells,
    onSaveMenu,
    onSaveTeachers,
    onSaveNews,
    onSaveContacts,
    onAddLesson,
    onRemoveLesson,
    onUpdateLesson,
    onAddBell,
    onRemoveBell,
    onUpdateBell,
    onAddTeacher,
    onRemoveTeacher,
    onUpdateTeacher,
    onAddNews,
    onRemoveNews,
    onUpdateNews,
    onAddNewClass,
    onUpdateClassCode,
    onCreateTeacherAccount,
    onDeleteTeacherAccount,
  } = props;

  return (
    <Tabs defaultValue={isAdmin ? "classes" : "schedule"} className="w-full">
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
                          onUpdateClassCode(classItem.id, e.target.value);
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
                onChange={(e) => onNewClassNameChange(e.target.value)}
              />
              <Input
                placeholder="Код (оставь пустым для автогенерации)"
                value={newClassCode}
                onChange={(e) => onNewClassCodeChange(e.target.value)}
                className="flex-1 font-mono uppercase"
              />
              <Button onClick={onAddNewClass}>
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
                    onClick={() => teacher.id && onDeleteTeacherAccount(teacher.id)}
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
                    onChange={(e) => onNewTeacherChange({...newTeacher, username: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Пароль</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={newTeacher.password}
                    onChange={(e) => onNewTeacherChange({...newTeacher, password: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>ФИО учителя</Label>
                <Input
                  placeholder="Иванов Иван Иванович"
                  value={newTeacher.full_name}
                  onChange={(e) => onNewTeacherChange({...newTeacher, full_name: e.target.value})}
                />
              </div>
              <div>
                <Label>Предмет</Label>
                <Input
                  placeholder="Математика"
                  value={newTeacher.subject}
                  onChange={(e) => onNewTeacherChange({...newTeacher, subject: e.target.value})}
                />
              </div>
              <div>
                <Label>Класс</Label>
                <Select
                  value={newTeacher.class_id.toString()}
                  onValueChange={(val) => onNewTeacherChange({...newTeacher, class_id: parseInt(val)})}
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
              <Button onClick={onCreateTeacherAccount} className="w-full">
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
              <Select value={selectedClass} onValueChange={onSelectedClassChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(scheduleData).map(className => (
                    <SelectItem key={className} value={className}>{className}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>День недели</Label>
              <Select value={selectedDay} onValueChange={onSelectedDayChange}>
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
                <div className="w-12 flex items-center justify-center font-semibold text-muted-foreground">
                  {idx + 1}
                </div>
                <Input
                  value={lesson}
                  onChange={(e) => onUpdateLesson(idx, e.target.value)}
                  placeholder="Название урока"
                />
                <Button variant="destructive" size="icon" onClick={() => onRemoveLesson(idx)}>
                  <Icon name="Trash2" size={18} />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={onAddLesson} variant="outline" className="flex-1">
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить урок
            </Button>
            <Button onClick={onSaveSchedule} className="flex-1">
              <Icon name="Save" size={18} className="mr-2" />
              Сохранить
            </Button>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="bells" className="space-y-4">
        <Card className="p-6">
          <h2 className="text-2xl font-heading font-bold mb-4">Редактирование расписания звонков</h2>
          <div className="mb-4">
            <Label>День недели</Label>
            <Select value={selectedDay} onValueChange={onSelectedDayChange}>
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
                <div className="w-16 text-center font-semibold text-muted-foreground">
                  {bell.lesson} урок
                </div>
                <Input
                  type="time"
                  value={bell.start}
                  onChange={(e) => onUpdateBell(idx, 'start', e.target.value)}
                  className="flex-1"
                />
                <span className="text-muted-foreground">—</span>
                <Input
                  type="time"
                  value={bell.end}
                  onChange={(e) => onUpdateBell(idx, 'end', e.target.value)}
                  className="flex-1"
                />
                <Button variant="destructive" size="icon" onClick={() => onRemoveBell(idx)}>
                  <Icon name="Trash2" size={18} />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={onAddBell} variant="outline" className="flex-1">
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить звонок
            </Button>
            <Button onClick={onSaveBells} className="flex-1">
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
            <Select value={selectedDay} onValueChange={onSelectedDayChange}>
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
                  const updated = { ...menuData };
                  if (!updated[selectedDay]) updated[selectedDay] = { breakfast: [], lunch: [] };
                  updated[selectedDay].breakfast = e.target.value.split('\n').filter(Boolean);
                  onMenuChange(updated);
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
                  const updated = { ...menuData };
                  if (!updated[selectedDay]) updated[selectedDay] = { breakfast: [], lunch: [] };
                  updated[selectedDay].lunch = e.target.value.split('\n').filter(Boolean);
                  onMenuChange(updated);
                }}
                placeholder="Каждое блюдо с новой строки"
                rows={6}
              />
            </div>
          </div>
          <Button onClick={onSaveMenu} className="w-full mt-4">
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
                    onChange={(e) => onUpdateTeacher(idx, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Предмет"
                    value={teacher.subject}
                    onChange={(e) => onUpdateTeacher(idx, 'subject', e.target.value)}
                  />
                  <Input
                    placeholder="Категория"
                    value={teacher.category}
                    onChange={(e) => onUpdateTeacher(idx, 'category', e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Телефон"
                      value={teacher.phone}
                      onChange={(e) => onUpdateTeacher(idx, 'phone', e.target.value)}
                    />
                    <Button variant="destructive" size="icon" onClick={() => onRemoveTeacher(idx)}>
                      <Icon name="Trash2" size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={onAddTeacher} variant="outline" className="flex-1">
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить учителя
            </Button>
            <Button onClick={onSaveTeachers} className="flex-1">
              <Icon name="Save" size={18} className="mr-2" />
              Сохранить
            </Button>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="contacts" className="space-y-4">
        <Card className="p-6">
          <h2 className="text-2xl font-heading font-bold mb-4">Контактная информация</h2>
          <div className="space-y-4">
            <div>
              <Label>Телефон</Label>
              <Input
                value={contactsData.phone}
                onChange={(e) => onContactsChange({ ...contactsData, phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={contactsData.email}
                onChange={(e) => onContactsChange({ ...contactsData, email: e.target.value })}
                placeholder="school@example.ru"
              />
            </div>
            <div>
              <Label>Адрес</Label>
              <Textarea
                value={contactsData.address}
                onChange={(e) => onContactsChange({ ...contactsData, address: e.target.value })}
                placeholder="г. Москва, ул. Школьная, д. 1"
                rows={3}
              />
            </div>
          </div>
          <Button onClick={onSaveContacts} className="w-full mt-4">
            <Icon name="Save" size={18} className="mr-2" />
            Сохранить
          </Button>
        </Card>
      </TabsContent>

      <TabsContent value="news" className="space-y-4">
        <Card className="p-6">
          <h2 className="text-2xl font-heading font-bold mb-4">Управление новостями</h2>
          <div className="space-y-4 mb-4">
            {newsData.map((news) => (
              <Card key={news.id} className="p-4 bg-muted/30">
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Заголовок"
                      value={news.title}
                      onChange={(e) => onUpdateNews(news.id, 'title', e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={news.pinned}
                        onCheckedChange={(checked) => onUpdateNews(news.id, 'pinned', checked)}
                      />
                      <Label className="text-sm">Закреплено</Label>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Текст новости"
                    value={news.text}
                    onChange={(e) => onUpdateNews(news.id, 'text', e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={news.date}
                      onChange={(e) => onUpdateNews(news.id, 'date', e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="destructive" size="icon" onClick={() => onRemoveNews(news.id)}>
                      <Icon name="Trash2" size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={onAddNews} variant="outline" className="flex-1">
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить новость
            </Button>
            <Button onClick={onSaveNews} className="flex-1">
              <Icon name="Save" size={18} className="mr-2" />
              Сохранить
            </Button>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
