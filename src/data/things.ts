
export type MenuSize = 'empty' | 'small' | 'medium' | 'large' | 'huge';
export type MenuItemPriority = 'low' | 'normal' | 'high';
export type MenuItemVariant = 'default' | 'fab' | 'action';

export interface Badge {
  value: string;
  variant?: string;
}

export interface MenuItem {
  label: string;
  badge?: string | Badge;
  icon?: string;
  hotkey?: string;
  href?: string;
  active?: boolean;
  variant?: MenuItemVariant;
  items?: MenuItem[];
  priority?: MenuItemPriority;
}