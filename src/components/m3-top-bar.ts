import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

//import './action-group';
import type { M3MenuItemConfig } from '../data/menu';
import { mediumHeadline } from '../style/type.style';
import { buttonStyles } from '../style/widgets.style';

export type M3TopBarVariant = 'center' | 'small' | 'medium' | 'large';

//import { auth } from '../data/auth';
const auth = undefined as any;

interface ScrollInfo {
  last: number;
  line: number;
}

@customElement('m3-top-bar')
export class M3TopBar extends LitElement {
  @property({ type: String, attribute: true }) variant: M3TopBarVariant = 'center';
  @property({ type: String, attribute: true }) title: string = '';
  @property({ type: String, attribute: true }) back?: string;
  @property({ type: Boolean, reflect: true }) fixed: boolean = false;
  @property({ type: Boolean, reflect: true }) scrolling: boolean = false;
  @property({ type: Boolean, reflect: true }) avatar: boolean = false;
  @property({ type: Number, attribute: 'menu-size' }) menuSize: number = 3;
  @property({ type: Array }) menu!: M3MenuItemConfig[];

  _scrollInfo?: ScrollInfo;
  _standIn?: HTMLElement;

  static styles = [
    buttonStyles,
    css`
      :host {
        display: block;
      }

      :host([fixed][scrolling]) {
        z-index: 10;
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        box-shadow: var(--md-sys-elevation-level1);
      }

      .container {
        background-color: var(--md-sys-color-surface, #f0f0f0);
        color: var(--md-sys-color-on-surface, black);
        box-shadow: var(--md-sys-elevation-level0, none);
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        height: 64px;
        gap: 24px;
        padding: var(--m3-gap);
        transition: all 0.6s ease-out;
      }

      .container.medium,
      .container.large {
        display: grid;
        grid-auto-rows: 1fr;
        grid-template:
          'leading trailing' auto
          'title title' 1fr / 1fr 1fr;
        gap: 0px 12px;
        justify-content: center;
        place-items: stretch;
        height: 110px;
        padding: var(--m3-gap) var(--m3-gap) 24px var(--m3-gap);
        align-items: end;
        justify-items: start;
      }

      .container.large {
        padding: var(--m3-gap) var(--m3-gap) 28px;
        height: 138px;
      }

      .container[scrolling] {
        background-color: var(--md-sys-color-surface-container);
      }

      .container.medium[scrolling] {
      }

      .title {
        grid-area: title;
        flex-grow: 1;
        text-align: center;
        text-align: left;

        font-size: var(--md-sys-title-large-size);
        font-family: var(--md-sys-title-large-font);
        line-height: var(--md-sys-title-large-line-height);
        font-weight: var(--md-sys-title-large-weight);
      }

      .medium .title {
        font-size: var(--md-sys-headline-small-size);
        font-family: var(--md-sys-headline-small-font);
        line-height: var(--md-sys-headline-small-line-height);
        font-weight: var(--md-sys-headline-small-weight);
      }

      .large .title {
        ${mediumHeadline}
      }

      .center .title {
        text-align: center;
      }

      .small .title {
        text-align: left;
        margin-left: -8px;
      }

      .medium .title {
      }

      .leading {
        grid-area: leading;
        align-self: center;

        --sl-spacing-x-small: 10px;
        margin-left: -10px;

        font-size: var(--md-sys-headline-medium-size);
        font-family: var(--md-sys-headline-medium-font);
        line-height: var(--md-sys-headline-medium-line-height);
        font-weight: var(--md-sys-headline-medium-weight);
      }

      .trailing {
        align-self: center;
        grid-area: trailing;
        display: flex;
        color: var(--md-sys-color-on-surface-variant);
        justify-self: end;
        display: flex;
        align-items: center;

        --sl-spacing-x-small: 10px;
        margin-right: -10px;

        font-size: var(--md-sys-headline-medium-size);
        font-family: var(--md-sys-headline-medium-font);
        line-height: var(--md-sys-headline-medium-line-height);
        font-weight: var(--md-sys-headline-medium-weight);
      }

      .icon {
        display: block;
        line-height: 0;
        text-decoration: none;
        color: inherit;
        font-size: 0.8em;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .back.icon {
      }

      .avatar {
        padding: 4px;
      }

      .avatar img {
        width: 32px;
        height: 32px;
        object-fit: cover;
        border-radius: 100%;
      }

      sl-icon-button[name='pencil-fill'] {
        font-size: 0.8em;
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('scroll', this.onScroll);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = (e: Event) => {
    if (!this.fixed) return;

    if (window.scrollY > 0) {
      this.scrolling = true;
    } else {
      this.scrolling = false;
    }
  };

  renderBack() {
    return html`
      <a class="m3-icon-button" href=${this.back as string} aria-label="Back">
        <m3-icon name="arrow_back"></m3-icon>
      </a>
    `;
    //<sl-icon-button name="arrow-left" href= label="Back"></sl-icon-button>
  }

  renderLeading() {
    if (this.back) return this.renderBack();
    return html`
      <md-icon-button
        href="/"
        aria-label="Home">
        <md-icon>menu</md-icon>
      </md-icon-button>
    `;
  }

  renderAvatar() {
    if (!this.avatar || !auth || !auth.user) return;

    return html`
      <a href="/account" class="avatar">
        <img
          src=${auth.user.photoURL || ''}
          aria-label=${auth.user.displayName || 'Anonymous'}>
      </a>
    `;
  }

  renderTrailing() {
    return [html`<action-group .items=${this.menu} max=${this.menuSize}></action-group>`, this.renderAvatar()];
  }

  render() {
    return html`
      <div
        class="container ${this.variant}"
        part="container"
        ?fixed=${this.fixed}
        ?scrolling=${this.scrolling}>
        <div class="leading" part="leading">
          <slot name="leading">${this.renderLeading()}</slot>
        </div>
        <div class="title" part="title"><slot>${this.title}</slot></div>
        <div class="trailing" part="trailing">
          <slot name="trailing">${this.renderTrailing()}</slot>
        </div>
      </div>
    `;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    "m3-top-bar": M3TopBar;
  }
}
