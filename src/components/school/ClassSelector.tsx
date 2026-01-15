import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CLASSES = ['1А', '1Б', '2А', '2Б', '3А', '3Б', '4А', '4Б', '5А', '5Б', '6А', '6Б', '7А', '7Б', '8А', '8Б', '9А', '9Б', '10А', '10Б', '11А', '11Б'];

interface ClassSelectorProps {
  onClassSelect: (className: string) => void;
}

export default function ClassSelector({ onClassSelect }: ClassSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎒</div>
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Выбери свой класс
          </h1>
          <p className="text-muted-foreground">Мы запомним его для тебя</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {CLASSES.map(cls => (
            <Button
              key={cls}
              variant="outline"
              className="h-16 text-lg font-semibold hover-scale"
              onClick={() => onClassSelect(cls)}
            >
              {cls}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
