export type M3MediaBreakpoint = 'compact' | 'medium' | 'expanded' | 'large' | 'extra';

export const mediaBreakpoints: Record<M3MediaBreakpoint, number> = {
  compact: 480,
  medium: 768,
  expanded: 1350,
  large: 1800,
  extra: Infinity
}

export function getMediaBreakpoint(width: number): M3MediaBreakpoint {
  if (width <= mediaBreakpoints.compact) return 'compact';
  if (width <= mediaBreakpoints.medium) return 'medium';
  if (width <= mediaBreakpoints.expanded) return 'expanded';
  if (width <= mediaBreakpoints.large) return 'large';
  return 'extra';
}

export function compareBreakpoints(a: M3MediaBreakpoint, b: M3MediaBreakpoint): number {
  return mediaBreakpoints[a] - mediaBreakpoints[b];
}
