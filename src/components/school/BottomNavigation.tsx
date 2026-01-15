import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-md mx-auto grid grid-cols-6 gap-1 p-2">
        <Button
          variant={activeTab === 'home' ? 'default' : 'ghost'}
          className="flex-col h-16 gap-1"
          onClick={() => onTabChange('home')}
        >
          <Icon name="Home" size={20} />
          <span className="text-xs">Главная</span>
        </Button>
        <Button
          variant={activeTab === 'schedule' ? 'default' : 'ghost'}
          className="flex-col h-16 gap-1"
          onClick={() => onTabChange('schedule')}
        >
          <Icon name="Calendar" size={20} />
          <span className="text-xs">Уроки</span>
        </Button>
        <Button
          variant={activeTab === 'bells' ? 'default' : 'ghost'}
          className="flex-col h-16 gap-1"
          onClick={() => onTabChange('bells')}
        >
          <Icon name="Bell" size={20} />
          <span className="text-xs">Звонки</span>
        </Button>
        <Button
          variant={activeTab === 'menu' ? 'default' : 'ghost'}
          className="flex-col h-16 gap-1"
          onClick={() => onTabChange('menu')}
        >
          <Icon name="UtensilsCrossed" size={20} />
          <span className="text-xs">Еда</span>
        </Button>
        <Button
          variant={activeTab === 'teachers' ? 'default' : 'ghost'}
          className="flex-col h-16 gap-1"
          onClick={() => onTabChange('teachers')}
        >
          <Icon name="Users" size={20} />
          <span className="text-xs">Учителя</span>
        </Button>
        <Button
          variant={activeTab === 'info' ? 'default' : 'ghost'}
          className="flex-col h-16 gap-1"
          onClick={() => onTabChange('info')}
        >
          <Icon name="Info" size={20} />
          <span className="text-xs">Инфо</span>
        </Button>
      </div>
    </div>
  );
}
