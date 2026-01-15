import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface LessonInfo {
  status: 'lesson' | 'break' | 'before' | 'after';
  lesson?: number;
  nextLesson?: number;
  minutesLeft?: number;
}

interface HomeTabProps {
  currentTime: Date;
  currentDay: string;
  lessonInfo: LessonInfo;
  onTabChange: (tab: string) => void;
}

export default function HomeTab({ currentTime, currentDay, lessonInfo, onTabChange }: HomeTabProps) {
  return (
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
          onClick={() => onTabChange('schedule')}
        >
          <Icon name="Calendar" size={28} className="text-primary" />
          <span className="font-semibold">Расписание</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-col gap-2 hover-scale"
          onClick={() => onTabChange('bells')}
        >
          <Icon name="Bell" size={28} className="text-accent" />
          <span className="font-semibold">Звонки</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-col gap-2 hover-scale"
          onClick={() => onTabChange('menu')}
        >
          <Icon name="UtensilsCrossed" size={28} className="text-secondary" />
          <span className="font-semibold">Столовая</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-col gap-2 hover-scale"
          onClick={() => onTabChange('teachers')}
        >
          <Icon name="Users" size={28} className="text-primary" />
          <span className="font-semibold">Учителя</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-col gap-2 hover-scale"
          onClick={() => onTabChange('contacts')}
        >
          <Icon name="Phone" size={28} className="text-accent" />
          <span className="font-semibold">Контакты</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-col gap-2 hover-scale"
          onClick={() => onTabChange('info')}
        >
          <Icon name="Info" size={28} className="text-secondary" />
          <span className="font-semibold">Информация</span>
        </Button>
      </div>
    </div>
  );
}
