import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getMenuSize, organizeMenuItems, queryNavItems, type M3MenuItemConfig, type M3MenuSize } from '../data/menu';
import { navItemStyles } from '../style/nav-item.style';
import { largeFont, mediumFont } from '../style/type.style';
import { M3BreakpointController } from '../controllers/m3-breakpoint-controller';
import { applyRules } from '../rules';
import { compareBreakpoints, type M3MediaBreakpoint } from '../data/breakpoints';

export type M3NavVariant = 'auto' | 'modal' | 'rail' | 'drawer';
export type M3NavMode = 'hidden' | 'bar' | 'rail' | 'drawer' | 'overlay';

@customElement('m3-nav')
export class M3Nav extends LitElement {
  _breaks = new M3BreakpointController(this, (bp: M3MediaBreakpoint) => {
    this.breakpoint = bp;
  });

  @property({ type: String, reflect: true }) variant: M3NavVariant = 'drawer';

  @property({ type: Array }) items?: M3MenuItemConfig[];

  @property({ type: String, reflect: true }) headline?: string;

  @property({ type: String, reflect: true }) size?: M3MenuSize;

  @property({ type: String, reflect: true }) limit?: M3MenuSize | string = '5';

  @property({ type: String, reflect: true }) mode: M3NavMode = 'drawer';

  @property({ type: String, reflect: true }) breakpoint: M3MediaBreakpoint = 'medium';

  @property({ type: String, reflect: true, attribute: 'breakpoint-drawer' }) breakpointDrawer: M3MediaBreakpoint = 'expanded';

  @property({ type: Boolean, reflect: true }) open = false;

  @state() _drawerOpen = false;
  @state() _filteredItems?: M3MenuItemConfig[];

  static styles = [css`
    :host {
      --m3-drawer-width: 240px;
      --m3-nav-rail-width: 80px;
      --m3-nav-item-width: 56px;
      --m3-nav-icon-size: 24px;
      --m3-nav-item-padding: var(--m3-gap);
      --m3-nav-item-padding-rail: 4px;
      --m3-nav-rail-indicator-size: 31px;

      display: flex;
      flex-direction: column;
      max-width: 90vw;
      align-items: stretch;
      transition: width var(--m3-time);
      width: var(--m3-drawer-width);
    }

    .container {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      padding: var(--m3-gap-half) 0;
      background-color: var(--md-sys-color-surface);
      z-index: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }
    
    .item-container {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 0;
      padding: 0 var(--m3-gap);
      transition: background-color, gap var(--m3-time-quick);
    }

    .header-container {
      flex-shrink: 0;
      flex-grow: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--m3-gap);
      transition: none;
      min-height: var(--m3-nav-item-width, 56px);
    }

    .header {
      padding: 0 var(--m3-gap);
      margin: 0 var(--m3-gap);

      ${mediumFont}
    }

    .button {
      align-self: flex-start;
      color: var(--md-sys-color-on-surface);
      border-radius: var(--md-sys-shape-corner-none);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--m3-item-gap, 2px);
      text-decoration: none;
      border: none;
      cursor: pointer;
      position: relative;
      z-index: 1;
      background-color: transparent;
      transition: none 150ms ease-in-out;
      padding: var(--m3-nav-button-padding, 12px);
      width: var(--m3-nav-item-width, 56px);
      justify-content: center;
      margin: 0 var(--m3-gap);
      flex-shrink: 0; 
      aspect-ratio: 1;
    }
  
    .button:hover:after, .button[active]:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: var(--md-sys-color-secondary-container, #EADDFF);
      z-index: -1;
      border-radius: var(--md-sys-shape-corner-full);
    }

    .button[placement="end"] {
      align-self: flex-end;
    }

    .fab {
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--md-sys-shape-corner-large, 16px);
      background-color: var(--md-sys-color-primary-container, #EADDFF);
      max-height: var(--m3-item-width, 56px);
      gap: var(--m3-gap);
      aspect-ratio: 1;
      text-decoration: none;
      color: var(--md-sys-color-on-primary-container, #4F378B);
      margin: var(--m3-gap);
      flex-shrink: 0;
      
      ${largeFont}
    }

    .fab m3-icon {
      flex-shrink: 0;
    }
    
    .spacer {
      flex-grow: 0;
      max-height: 0;
      transition: all var(--m3-time);
    }

    /* Hidden */
    :host([mode=hidden]) {
      display: none;
      width: 0;
    }

    /* Overlay */
    :host([mode=overlay]) {
      width: 0;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 1000;
    }

    :host([mode=overlay]) .scrim {
      content: '';
      z-index: -1;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(0, 0, 0, .5);
    }
    
    :host([mode=overlay]) .container {
      gap: 0;
      background-color: var(--md-sys-color-surface-container-low);
      border-top-right-radius: var(--md-sys-shape-corner-medium);
      border-bottom-right-radius: var(--md-sys-shape-corner-medium);
      padding: var(--m3-gap) 0;
    }

    :host([open]) {
      width: var(--m3-drawer-width);
    }

    :host([open]) .toggle {
      display: none;
    }

    /* Drawer */
    :host([open][variant=drawer][mode=drawer]) .toggle {
      display: flex;
    }

    /* Rail */
    :host([mode=rail]) {
      width: var(--m3-nav-rail-width, 80px);
      transition: none;
    }
    
    :host([mode=rail]) .item-container {
      gap: var(--m3-gap);
      align-items: stretch;
    }

    :host([mode=rail]) .fab {
      aspect-ratio: 1;
    } 

    :host([mode=rail]) .fab span {
      display: none;
    }

    :host([mode=rail]) .spacer {
      flex-shrink: 1;
      flex-grow: 1; 
      max-height: 5vh;
      transition: all var(--m3-time-quick);
    }

    /* Bar */
    :host([mode=bar]) {
      position: fixed;
      bottom: 0;
      left: 0;
      top: auto;
      right: 0;
      flex-direction: column;
      align-items: stretch;
      max-width: none;
      width: auto;
    }

    :host([mode=bar]) .container {
      overflow: hidden;
      padding: 0;
    }
    
    :host([mode=bar]) .item-container {
      flex-direction: row;
      justify-content: space-around;
      padding: var(--m3-gap);
      background-color: var(--md-sys-color-surface-container);
    }
    
    :host([mode=bar]) .toggle {
      display: none;
    }
    
    :host([mode=bar]) .header-container {
      display: none;
    }

    :host([mode=bar]) .spacer {
      display: none;
    }
    
    :host([mode=bar]) .fab {
      aspect-ratio: 1;
      width: var(--m3-nav-item-width, 56px);
      align-self: flex-end;
      box-shadow: var(--md-sys-elevation-level3);
    } 

    :host([mode=bar]) .fab span {
      display: none;
    }

    /* Auto */
    :host([variant=auto][mode=drawer]) .toggle {
      display: none;
    }

    /* Misc */
    m3-badge {
      display: none;
    }

    /* Breakpoints */
    :host([mode=rail][breakpoint=medium]) .spacer {
      max-height: 40vh;
    }

    :host([mode=rail][breakpoint=medium]) .scrim {
      max-height: 40vh;
    }

    /* Size */
    :host([variant=rail][size=empty]) .toggle,
    :host([variant=rail][size=small]) .toggle,
    :host([variant=rail][size=medium]) .toggle {
      display: none;
    }
  `,
    navItemStyles];

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.items) {
      this.items = queryNavItems(this);
    }
  }

  filterItems() {
    if (!this.items) return [];

    return organizeMenuItems(this.items, { max: this.limit });
  }

  filterFabs() {
    if (!this.items) return [];

    return this.items.filter(item => item.variant === 'fab');
  }

  update(changes: Map<string, any>) {
    applyRules(M3NavRuleSet, this, changes); super.update(changes);
  }

  x_updated(changes: Map<string, any>) {
    if (changes.has('mode')) {
      requestAnimationFrame(() => {
        this.open = (this.mode == 'overlay');
      });
    }
  }

  toggle = () => {
    this.open = !this.open;
    this._drawerOpen = this.open;
    return;

    if (this.mode === 'hidden' || (this.variant === 'rail' && this.mode === 'rail')) {
      this.mode = 'overlay';
    }
    else if (this.mode === 'overlay') {
      if (this.variant === 'rail') {
        this.mode = 'rail';
      } else
        this.mode = 'hidden'; {
      }
    }
    else if (this.mode === 'rail') {
      this.mode = 'drawer';
    }
    else if (this.mode === 'drawer') {
      this.mode = 'rail';
    }
  }

  render() {
    if (this.items === undefined) {
      return html`<slot></slot>`;
    }

    let fabs = this.items.filter(item => item.variant === 'fab');
    let items = this._filteredItems || this.items.filter(item => item.variant !== 'fab');

    return html`
      ${this.renderScrim()}
      <div class="container">
        <div class="header-container">
          ${this.renderHeader()}
          ${this.renderVeggieBurger()}
        </div>
        ${fabs.map(item => this.renderFab(item))}
        <div class="spacer"></div>
        <div class="item-container">
          ${items.map(item => this.renderItem(item))}
        </div>
      </div>
    `;
  }

  renderHeader() {
    if (this.mode == 'rail') return;
    return html`
      <div class="header">
        <slot name="header">${this.headline}</slot>
      </div>`;
  }

  renderScrim() {
    if (this.mode !== 'overlay') return;
    return html`<div class="scrim" @click=${this.toggle}></div>`;
  }

  renderVeggieBurger() {
    let icon = this.mode == 'drawer' ? 'menu_open_round' : 'menu_round';
    return html`
      <button class="toggle button" @click=${this.toggle}>
        <m3-icon name=${icon}></m3-icon>
      </button>
    `;
  }

  renderItem(item: M3MenuItemConfig) {
    let badge = item.badge as any;
    return html`
      <a href="${item.href}" class="item" ?active=${item.active} priority=${item.priority || 'normal'}>
        <m3-icon name="${item.icon || 'default'}"></m3-icon>
        <span>${item.label}</span>
        ${badge ? html`<m3-badge variant=${badge.variant || ''}>${badge.value || badge}</m3-badge>` : ''}
      </a>
    `;
  }

  renderFab(item: M3MenuItemConfig) {
    if (this.mode === 'overlay') return;
    return html`
      <a href="${item.href}" class="fab" ?active=${item.active}>
        <m3-icon name="${item.icon || 'default'}"></m3-icon>
        <span>${item.label}</span>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3-nav": M3Nav;
  }
}

function isRoomy(nav: M3Nav) {
  return compareBreakpoints(nav.breakpoint, nav.breakpointDrawer) >= 0;
}

const M3NavRuleSet = {
  itemsArePrioritized(nav: M3Nav, changes: Map<string, any>) {
    if (changes.has('items') || changes.has('limit')) {
      nav._filteredItems = nav.filterItems();
      nav.size = getMenuSize(nav.items?.filter(item => item.variant !== 'fab'));
    }
  },

  railDefault(nav: M3Nav, changes: Map<string, any>) {
    if (nav.variant !== 'rail') return;

    nav.mode = nav.open ? 'overlay' : 'rail';
  },

  drawerDefault(nav: M3Nav, changes: Map<string, any>) {
    if (nav.variant !== 'drawer') return;

    nav.mode = nav.open ? 'drawer' : 'rail';
  },

  autoDefault(nav: M3Nav, changes: Map<string, any>) {
    if (nav.variant !== 'auto') return;

    nav.mode = 'drawer';
  },

  modalAutoModal(nav: M3Nav, changes: Map<string, any>) {
    if (nav.variant !== 'modal') return;

    nav.mode = nav.open ? 'overlay' : 'hidden';
  },

  expandDrawerIfRoomAndOpen(nav: M3Nav, changes: Map<string, any>) {
    if (!changes.has('breakpoint')) return;
    if (nav.variant !== 'drawer') return;
    if (!nav._drawerOpen) return;
    if (!isRoomy(nav)) return;

    nav.open = true;
    nav.mode = 'drawer';
  },

  collapseDrawerIfNoRoomAndOpen(nav: M3Nav, changes: Map<string, any>) {
    if (!changes.has('breakpoint')) return;
    if (nav.variant !== 'drawer') return;
    if (nav.mode !== 'drawer') return;
    if (!nav.open) return;
    if (isRoomy(nav)) return;

    nav.open = false;
    nav.mode = 'rail';
  },

  scaleDrawer(nav: M3Nav, changes: Map<string, any>) {
    if (nav.mode !== 'drawer') return;
    if (isRoomy(nav)) return;

    nav.mode = 'rail';
  },

  scaleRail(nav: M3Nav, changes: Map<string, any>) {
    if (nav.mode !== 'rail') return;
    if (nav.breakpoint !== 'compact') return;

    nav.mode = 'bar';
  },

  overlayIfNoRoom(nav: M3Nav, changes: Map<string, any>) {
    if (nav.open && !isRoomy(nav)) {
      nav.mode = 'overlay';
    }
  }
}
