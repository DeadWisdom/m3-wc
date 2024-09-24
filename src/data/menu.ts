
export type M3MenuSize = 'empty' | 'small' | 'medium' | 'large' | 'huge';
export type M3MenuItemPriority = 'low' | 'normal' | 'high';
export type M3MenuItemVariant = 'default' | 'fab' | 'action';

export interface M3BadgeConfig {
  value: string;
  variant?: string;
}

export interface M3MenuItemConfig {
  label: string;
  badge?: string | M3BadgeConfig;
  icon?: string;
  hotkey?: string;
  href?: string;
  active?: boolean;
  variant?: M3MenuItemVariant;
  children?: M3MenuItemConfig[];
  priority?: M3MenuItemPriority;
}

export interface Prioritized {
  priority: M3MenuItemPriority;
}

const menuSizes: Record<M3MenuSize, number> = {
  empty: 0,
  small: 5,
  medium: 7,
  large: 21,
  huge: Infinity
};

export function getMenuSize(items?: M3MenuItemConfig[]): M3MenuSize {
  if (!items) {
    return 'empty';
  }
  for (let size in menuSizes) {
    if (items.length <= menuSizes[size as M3MenuSize]) {
      return size as M3MenuSize;
    }
  }
  return 'large';
}

export interface M3MenuOrganizationPriorityGroup {
  min?: M3MenuSize | number | string;
  max?: M3MenuSize | number | string;
}

export function getMenuSizeNumber(sz: M3MenuSize | string | number | undefined, fallback = Infinity): number {
  if (typeof sz === 'number') return sz;
  if (typeof sz === 'string') {
    if (sz in menuSizes) {
      return menuSizes[sz as M3MenuSize];
    }
    try {
      return parseInt(sz);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

/**
 * Flattens and organizes a menu into a prioritized list
 */
export function organizeMenuItems(items: M3MenuItemConfig[], normal?: M3MenuOrganizationPriorityGroup, high?: M3MenuOrganizationPriorityGroup): (M3MenuItemConfig & Prioritized)[] {
  let counts = {
    high: 0,
    normal: 0
  }

  let min = {
    normal: getMenuSizeNumber(normal?.min, 3),
    high: getMenuSizeNumber(high?.min, 3)
  }

  let max = {
    normal: getMenuSizeNumber(normal?.max, Infinity),
    high: getMenuSizeNumber(high?.max, 4)
  }

  // Can never require less than high priority
  min.normal = Math.min(min.normal, min.high);

  // Can never require more than normal priority
  max.high = Math.min(max.normal, max.high);

  // Ensure the right number of normal items
  let results: (M3MenuItemConfig & Prioritized)[] = items.map(item => {
    if (counts.normal > max.normal) {
      return { ...item, priority: 'low' };
    }
    counts.normal++;
    if (item.priority === 'high' || item.priority === 'normal') {
      return item as M3MenuItemConfig & Prioritized;
    } else {
      return { ...item, priority: 'normal' };
    }
  });

  // Ensure the right number of high priority items
  results = results.map(item => {
    if (counts.high > max.high) {
      if (item.priority === 'high') {
        return { ...item, priority: 'normal' };
      } else {
        return item;
      }
    }
    counts.high++;
    if (item.priority === 'high') {
      return item;
    } else {
      return { ...item, priority: 'high' };
    }
  });

  return results;
}

/// Nav Query ///
export function queryNavItems(root?: Element | null): M3MenuItemConfig[] {
  let items: M3MenuItemConfig[] = [];
  if (!root) return [];

  root.querySelectorAll('a[href]').forEach(a => {
    let item: M3MenuItemConfig = {
      label: validAttribute(a, 'label') || a.textContent || (a as any).href,
      icon: validAttribute(a, 'icon'),
      hotkey: validAttribute(a, 'hotkey'),
      href: validAttribute(a, 'href'),
      active: a.hasAttribute('active') || undefined,
      variant: validAttribute(a, 'variant', undefined, ['group', 'fab']) as M3MenuItemVariant,
      priority: validAttribute(a, 'priority', undefined, ['low', 'high']) as M3MenuItemPriority
    };

    let badge = validAttribute(a, 'badge');
    let badgeVariant = validAttribute(a, 'badge-variant');
    if (badge && badgeVariant) {
      item.badge = { value: badge, variant: badgeVariant };
    } else if (badge) {
      item.badge = badge;
    }

    item = Object.fromEntries(Object.entries(item).filter(([_, v]) => v !== undefined)) as M3MenuItemConfig;
    items.push(item);
  });
  return items;
}

function validAttribute(element: Element, attribute: string, fallback?: string, allowed?: string[]): string | undefined {
  let value = element.getAttribute(attribute);
  if (value === null) return fallback;
  if (allowed && !allowed.includes(value)) return fallback;
  return value;
}
