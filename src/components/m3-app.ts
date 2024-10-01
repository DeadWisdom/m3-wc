import { LitElement, html, css, render } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type M3MenuItemConfig } from '../data/menu';
import { WindowRouter, type Route } from '../controllers/m3-router';


export interface AppSetupOptions {
  routes: Route[];
  menu?: M3MenuItemConfig[];
  header?: string;
}


@customElement('m3-app')
export class M3App extends LitElement {
  static styles = css`
    :host {
      opacity: 1;
      transition: opacity var(--m3-time-quick, 150ms);
      display: flex;
      height: 100vh;
      align-items: stretch;
      padding-left: 0;
      background-color: var(--md-sys-color-surface);
    }

    .nav {
      flex-shrink: 0;
    }
    
    .nav, .body {
      display: flex;
      align-items: stretch;
      min-width: var(--m3-gap);
    }

    .body {
      margin: 0 var(--m3-gap) var(--m3-gap) 0;
      display: flex;
      flex-direction: row;
      align-items: stretch;
      gap: var(--m3-gap);
      flex-grow: 1;
      flex-wrap: wrap;
    }
  `;

  router = new WindowRouter(this, () => this.routes);

  @property({ type: Array })
  routes?: Route[];

  @property({ type: Array })
  menu?: M3MenuItemConfig[];

  @property({ type: String })
  header?: string;

  setup(options: AppSetupOptions) {
    this.routes ??= options.routes;
    this.menu ??= options.menu;
    this.header ??= options.header;
    if (!hasContent(this)) {
      this.router.reload();
    }
  }

  load(url: string | URL) {
    this.router.navigate(url);
    this.updateMenu();
  }

  replace(url: string | URL) {
    this.router.replace(url);
    this.updateMenu();
  }

  reload() {
    this.router.reload();
    this.updateMenu();
  }

  updated() {
    if (this.router.activeRoute) {
      render(this.router.render(), this);
    }
  }

  updateMenu(menu?: M3MenuItemConfig[]) {
    this.menu = menu || this.menu;
    if (this.menu) {
      this.menu = [...this.menu];
    }
    this.requestUpdate('menu');
  }

  render() {
    return [
      this._renderNav(),
      this._renderBody()
    ];
  }

  _renderBody() {
    return html`<div class="body"><slot></slot></body>`;
  }

  _renderNav() {
    if (this.menu) {
      return html`
        <div class="nav">
          <m3-nav .items=${this.menu}><div slot="header"><slot name="header">${this.header}</slot></div></m3-nav>
        </div>
      `;
    } else {
      return html`
        <div class="nav">
          <slot name="nav"></slot>
        </div>
      `;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3-app": M3App;
  }
}

// Returns true if the node has child nodes that aren't in a named slot
function hasContent(node: Node) {
  for (let child of node.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE && !(child as Element).hasAttribute('slot')) {
      return true;
    }
    if (child.nodeType === Node.TEXT_NODE && child.textContent!.trim()) {
      return true;
    }
  }
  return false;
}