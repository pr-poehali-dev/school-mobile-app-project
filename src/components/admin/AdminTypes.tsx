export interface Schedule {
  [className: string]: {
    [day: string]: string[];
  };
}

export interface Bell {
  lesson: number;
  start: string;
  end: string;
}

export interface Menu {
  [dayNumber: string]: {
    breakfast: string[];
    lunch: string[];
  };
}

export interface Teacher {
  id?: number;
  name: string;
  subject: string;
  category: string;
  phone: string;
}

export interface TeacherAccount {
  id?: number;
  username: string;
  full_name: string;
  subject: string;
  class_id: number | null;
  class_name: string | null;
}

export interface TeacherScheduleItem {
  id?: number;
  day_of_week: string;
  lesson_number: number;
  subject: string;
  class_id: number | null;
  class_name?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  text: string;
  date: string;
  pinned: boolean;
}

export interface ClassItem {
  id: number;
  name: string;
  access_code: string;
}

export const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];

export const MENU_DAYS = [
  'День 1', 'День 2', 'День 3', 'День 4', 'День 5',
  'День 6', 'День 7', 'День 8', 'День 9', 'День 10'
];