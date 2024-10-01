import { css } from "lit";

export const smallFont = css`
  font-family: var(--md-sys-typescale-label-small-font-family);
  font-size: var(--md-sys-typescale-label-small-font-size, 10px);
  font-weight: var(--md-sys-typescale-label-small-font-weight, 400);
  line-height: var(--md-sys-typescale-label-small-line-height, 1);
  letter-spacing: var(--md-sys-typescale-label-small-tracking, .5pt);
`;

export const mediumFont = css`
  font-family: var(--md-sys-typescale-label-medium-font-family);
  font-size: var(--md-sys-typescale-label-medium-font-size, 12px);
  font-weight: var(--md-sys-typescale-label-medium-font-weight, 500);
  line-height: var(--md-sys-typescale-label-medium-line-height, 1);
  letter-spacing: var(--md-sys-typescale-label-medium-tracking, .5pt);
`;

export const largeFont = css`
  font-family: var(--md-sys-typescale-label-large-font-family);
  font-size: var(--md-sys-typescale-label-large-font-size, 14px);
  font-weight: var(--md-sys-typescale-label-large-font-weight, 500);
  line-height: var(--md-sys-typescale-label-large-line-height, 1);
  letter-spacing: var(--md-sys-typescale-label-large-tracking, .1pt);
`;

export const mediumHeadline = css`
  font-family: var(--md-sys-typescale-headline-medium-font-family);
  font-size: var(--md-sys-typescale-headline-medium-font-size, 28px);
  font-weight: var(--md-sys-typescale-headline-medium-font-weight, 400);
  line-height: var(--md-sys-typescale-headline-medium-line-height, 1.2);
  letter-spacing: var(--md-sys-typescale-headline-medium-tracking, 0);
`;