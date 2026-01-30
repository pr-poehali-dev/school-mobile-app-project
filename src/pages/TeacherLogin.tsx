import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import FUNC_URLS from '../../backend/func2url.json';

export default function TeacherLogin() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(FUNC_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          username,
          password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('teacherUser', JSON.stringify(data.user));
        toast({ title: 'Успешно!', description: `Добро пожаловать, ${data.user.username}` });
        navigate('/admin');
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Неверный логин или пароль', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось войти', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">👨‍🏫</div>
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Вход для учителей
          </h1>
          <p className="text-muted-foreground">Управление своим классом</p>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Логин</Label>
            <Input
              id="username"
              placeholder="Ваш логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
            <Icon name={isLoading ? "Loader2" : "LogIn"} size={18} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Вход...' : 'Войти'}
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
