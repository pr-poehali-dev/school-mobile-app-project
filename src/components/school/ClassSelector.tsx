import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ClassSelectorProps {
  onClassSelect: (className: string) => void;
}

export default function ClassSelector({ onClassSelect }: ClassSelectorProps) {
  const { toast } = useToast();
  const [classCode, setClassCode] = useState('');

  const handleCodeSubmit = () => {
    const code = classCode.trim().toUpperCase();
    if (!code) {
      toast({ title: 'Ошибка', description: 'Введи код класса', variant: 'destructive' });
      return;
    }

    const classCodes = JSON.parse(localStorage.getItem('classCodes') || '{}');
    const className = Object.keys(classCodes).find(key => classCodes[key] === code);

    if (className) {
      onClassSelect(className);
      toast({ title: 'Успешно!', description: `Добро пожаловать в ${className}` });
    } else {
      toast({ title: 'Ошибка', description: 'Неверный код класса', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Вход в класс
          </h1>
          <p className="text-muted-foreground">Введи код своего класса</p>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="classCode">Код класса</Label>
            <Input
              id="classCode"
              placeholder="Например: ABC123"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
              className="text-center text-lg font-mono uppercase"
              autoFocus
            />
          </div>
          <Button className="w-full" onClick={handleCodeSubmit}>
            <Icon name="LogIn" size={18} className="mr-2" />
            Войти
          </Button>
          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>💡 Код класса можно узнать у классного руководителя</p>
          </div>
        </div>
      </Card>
    </div>
  );
}