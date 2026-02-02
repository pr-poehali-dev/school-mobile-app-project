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
  [day: string]: {
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
  class_id: number;
  class_name: string;
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
