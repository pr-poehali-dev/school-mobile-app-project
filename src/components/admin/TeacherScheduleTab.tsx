import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { DAYS, ClassItem, TeacherScheduleItem } from './AdminTypes';

interface TeacherScheduleTabProps {
  userId: number;
  subject: string;
  classCodes: ClassItem[];
  scheduleData: TeacherScheduleItem[];
  onScheduleChange: (data: TeacherScheduleItem[]) => void;
  onSave: () => void;
}

export default function TeacherScheduleTab({
  userId,
  subject,
  classCodes,
  scheduleData,
  onScheduleChange,
  onSave
}: TeacherScheduleTabProps) {
  const updateScheduleItem = (day: string, lessonNum: number, classId: number | null) => {
    const existing = scheduleData.find(
      s => s.day_of_week === day && s.lesson_number === lessonNum
    );

    if (existing) {
      const updated = scheduleData.map(s =>
        s.day_of_week === day && s.lesson_number === lessonNum
          ? { ...s, class_id: classId }
          : s
      );
      onScheduleChange(updated);
    } else {
      onScheduleChange([
        ...scheduleData,
        {
          day_of_week: day,
          lesson_number: lessonNum,
          subject,
          class_id: classId
        }
      ]);
    }
  };

  const getClassForLesson = (day: string, lessonNum: number): number | null => {
    const item = scheduleData.find(
      s => s.day_of_week === day && s.lesson_number === lessonNum
    );
    return item?.class_id ?? null;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-heading font-bold">Мое расписание</h3>
          <p className="text-sm text-muted-foreground">Предмет: {subject}</p>
        </div>
        <Button onClick={onSave}>
          <Icon name="Save" size={18} className="mr-2" />
          Сохранить
        </Button>
      </div>

      <div className="space-y-6">
        {DAYS.map(day => (
          <div key={day} className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">{day}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map(lessonNum => (
                <div key={lessonNum} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-16">{lessonNum} урок:</span>
                  <Select
                    value={getClassForLesson(day, lessonNum)?.toString() || 'none'}
                    onValueChange={value => 
                      updateScheduleItem(day, lessonNum, value === 'none' ? null : parseInt(value))
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите класс" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Окно (нет урока)</SelectItem>
                      {classCodes.map(cls => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
