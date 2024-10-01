import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { M3MenuItemConfig } from '../data/menu';
import type { M3NavVariant } from './m3-nav';
import type { URLParams } from '../data/routing';
import type { Route } from '../controllers/m3-router';

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

export interface M3PageConfig {
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

export interface M3PageElement {
  params?: URLParams;
  meta?: M3PageConfig;
}


@customElement('m3-page')
export class M3Page extends LitElement implements M3PageElement {
  _unload?: CallableFunction | CallableFunction[];

  @property({ type: Object })
  params?: URLParams;

  @property({ type: Object })
  meta?: M3PageConfig;

  createRenderRoot() {
    return this;
  }

  load(): CallableFunction | CallableFunction[] | void {

  }

  unload(): void {
    if (Array.isArray(this._unload)) {
      this._unload.forEach((fn) => fn());
    } else if (this._unload) {
      this._unload();
    }
  }

  reload() {
    this.unload();
    this._unload = this.load() || undefined;
  }

  updated(props: Map<string | number | symbol, unknown>): void {
    super.updated(props);
    if (props.has('params')) {
      this.reload();
    }
  }

  connectedCallback(): void {
    this._unload = this.load() || undefined;
    this.classList.add('m3-page');
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    this.unload();
    super.disconnectedCallback();
  }
}


declare global {
  interface HTMLElementTagNameMap {
    "m3-page": M3Page;
  }
}
