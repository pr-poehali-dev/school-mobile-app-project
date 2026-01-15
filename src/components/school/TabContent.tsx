import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

interface TabContentComponentProps {
  activeTab: string;
  selectedClass: string;
  scheduleData: any;
  bellsData: any;
  menuData: any;
  teachersData: any;
  newsData: any;
  contactsData: any;
  onBack: () => void;
}

export default function TabContentComponent({
  activeTab,
  selectedClass,
  scheduleData,
  bellsData,
  menuData,
  teachersData,
  newsData,
  contactsData,
  onBack
}: TabContentComponentProps) {
  if (activeTab === 'schedule') {
    return (
      <div className="space-y-4 animate-fade-in">
        <Button variant="ghost" onClick={onBack} className="mb-2">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-heading font-bold">Расписание уроков</h2>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Мой класс</div>
              <div className="text-lg font-heading font-bold text-primary">{selectedClass}</div>
            </div>
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
                  scheduleData['5А']?.[day] || []).map((subject: string, idx: number) => (
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
    );
  }

  if (activeTab === 'bells') {
    return (
      <div className="space-y-4 animate-fade-in">
        <Button variant="ghost" onClick={onBack} className="mb-2">
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
                {(bellsData[day] || bellsData['Понедельник'] || []).map((bell: any) => (
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
    );
  }

  if (activeTab === 'menu') {
    return (
      <div className="space-y-4 animate-fade-in">
        <Button variant="ghost" onClick={onBack} className="mb-2">
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
                    {(menuData[day]?.breakfast || menuData['Понедельник']?.breakfast || []).map((item: string, idx: number) => (
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
                    {(menuData[day]?.lunch || menuData['Понедельник']?.lunch || []).map((item: string, idx: number) => (
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
    );
  }

  if (activeTab === 'teachers') {
    return (
      <div className="space-y-4 animate-fade-in">
        <Button variant="ghost" onClick={onBack} className="mb-2">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        
        <Card className="p-4">
          <h2 className="text-2xl font-heading font-bold mb-4">Учителя</h2>
          <div className="space-y-3">
            {teachersData.map((teacher: any, idx: number) => (
              <Card key={idx} className="p-4 bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-heading font-bold text-lg">
                    {teacher.name.split(' ').map((n: string) => n[0]).join('')}
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
    );
  }

  if (activeTab === 'contacts') {
    return (
      <div className="space-y-4 animate-fade-in">
        <Button variant="ghost" onClick={onBack} className="mb-2">
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
    );
  }

  if (activeTab === 'info') {
    return (
      <div className="space-y-4 animate-fade-in">
        <Button variant="ghost" onClick={onBack} className="mb-2">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        
        <Card className="p-4">
          <h2 className="text-2xl font-heading font-bold mb-4">Информация и новости</h2>
          <div className="space-y-3">
            {newsData.map((item: any) => (
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
    );
  }

  return null;
}
