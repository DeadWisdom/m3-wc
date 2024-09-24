import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { M3MenuItemConfig } from '../data/menu';
import type { M3MediaBreakpoint } from '../data/breakpoints';
import type { M3NavVariant } from './m3-nav';
import type { Route, RouterParams } from '../controllers/m3-router';
import type { URLParams } from '../data/routing';

export type M3PageUnloader = () => void;
export type M3PageLoader = () => Promise<M3PageUnloader | void>;
export type M3PageRender = (params: URLParams, page: M3PageConfig) => any;

export interface M3PageAlternate {
  media?: string;
  type?: string;
  href?: string;
  title?: string;
  hreflang?: string;
}

export interface M3PageImage {
  url: string;
  alt?: string;
  type?: string;
  width?: number;
  height?: number;
}

export interface M3PageSettings {
  title?: string;
  description?: string;
  image?: string | M3PageImage;
  author?: string;
  generator?: string;
  keywords?: string | string[];
  cannonicalURL?: string;
  alternate?: M3PageAlternate | M3PageAlternate[];
  lang?: string;
  prefetch?: string[];
  stylesheets?: string[];
  indexable?: boolean;

  meta?: Record<string, string | string[]>;
  og?: Record<string, string | string[]>;

  menuItem?: M3MenuItemConfig;
  contextMenu?: M3MenuItemConfig[];
  navVariant?: M3NavVariant;
}

export interface M3PageConfig extends M3PageSettings {
  name: string;
  route: string | URLPatternInit | URLPattern;
  render: M3PageRender;
  load?: M3PageLoader;
  settings?: M3PageSettings;
  params?: URLParams
}


@customElement('m3-page')
export class M3Page extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html``;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    "m3-page": M3Page;
  }
}
