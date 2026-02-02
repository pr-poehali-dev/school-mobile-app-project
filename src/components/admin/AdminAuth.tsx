import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface AdminAuthProps {
  isSettingPassword: boolean;
  onSetPassword: (password: string, confirmPassword: string) => void;
  onLogin: (password: string) => void;
}

export default function AdminAuth({ isSettingPassword, onSetPassword, onLogin }: AdminAuthProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSetPassword = () => {
    onSetPassword(password, confirmPassword);
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogin = () => {
    onLogin(password);
    setPassword('');
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
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Минимум 4 символа"
              />
            </div>
            <div>
              <Label htmlFor="confirm">Подтверди пароль</Label>
              <Input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повтори пароль"
                onKeyPress={(e) => e.key === 'Enter' && handleSetPassword()}
              />
            </div>
            <Button onClick={handleSetPassword} className="w-full">
              <Icon name="Check" size={18} className="mr-2" />
              Установить пароль
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔑</div>
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Вход в админ-панель
          </h1>
          <p className="text-muted-foreground">Введи пароль для доступа</p>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введи пароль"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <Button onClick={handleLogin} className="w-full">
            <Icon name="LogIn" size={18} className="mr-2" />
            Войти
          </Button>
        </div>
      </Card>
    </div>
  );
}
