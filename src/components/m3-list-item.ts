import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type M3ListItemVariant = 'one' | 'two' | 'three';

@customElement('m3-list-item')
export class M3ListItem extends LitElement {
  @property({ type: String }) variant?: M3ListItemVariant;
  @property({ type: String }) headline?: string;
  @property({ type: String }) text?: string;
  @property({ type: String, attribute: 'trailing-text' }) trailingText?: string;
  @property({ type: String }) icon?: string;
  @property({ type: String }) image?: string;
  @property({ type: String, attribute: 'trailing-icon' }) trailingIcon?: string;
  @property({ type: Object }) avatar?: any;
  @property({ type: String }) href?: string;
  @property({ type: Boolean }) caret?: boolean;

  static styles = [
    css`
      :host {
        display: block;
        background-color: var(--md-sys-color-surface);
        color: var(--md-sys-color-on-surface);
      }

      .container {
        position: relative;

        font-size: var(--md-sys-body-medium-size);
        font-family: var(--md-sys-body-medium-font);
        line-height: var(--md-sys-body-medium-line-height);
        font-weight: var(--md-sys-body-medium-weight);

        display: flex;
        justify-content: flex-start;
        box-sizing: border-box;
        height: 56px;
        gap: 16px;
        padding: 8px 16px 8px 16px;
        align-items: center;
        text-decoration: none;
      }

      .container.two {
        height: 72px;
      }

      .container.three {
        height: 88px;
      }

      .headline {
        font-size: var(--md-sys-body-large-size);
        font-family: var(--md-sys-body-large-font);
        line-height: var(--md-sys-body-large-line-height);
        font-weight: var(--md-sys-body-large-weight);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .text {
        text-overflow: ellipsis;
        overflow: hidden;
        color: var(--md-sys-color-on-surface-variant);
      }

      .one .text {
        display: none;
      }

      .two .text {
        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 1;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        max-height: 2rem;
      }

      .three .text {
        display: -webkit-box;
        line-clamp: 1;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        max-height: 3rem;
      }

      .three .leading {
        align-self: flex-start;
        padding-top: 8px;
      }

      .body {
        overflow: hidden;
        flex-grow: 1;
      }

      .leading {
        padding-top: 4px;
        flex-shrink: 0;
      }

      .leading m3-icon {
        font-size: 18px;
      }

      .trailing {
        font-size: var(--md-sys-label-small-size);
        font-family: var(--md-sys-label-small-font);
        line-height: var(--md-sys-label-small-line-height);
        font-weight: var(--md-sys-label-small-weight);
        text-overflow: clip;
        overflow: hidden;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .trailing:empty {
        display: none;
      }

      .leading:empty {
        display: none;
      }

      sl-avatar {
        --size: 40px;
      }

      .one sl-avatar {
        --size: 36px;
      }

      .leading img {
        height: 52px;
        max-width: 52px;
        object-fit: contain;
        border-radius: 4px;
      }
    `,
  ];

  renderLeading() {
    if (this.image) {
      return html`<img src=${this.image}></img>`;
    }
    if (this.avatar) {
      let u = this.avatar;
      return html`<sl-avatar image=${u.icon || ''} label=${u.name as string}></sl-avatar>`;
    }
    if (this.icon) {
      return html`<m3-icon name=${this.icon}></m3-icon>`;
    }
  }

  renderTrailing() {
    if (this.trailingIcon) {
      return html`<m3-icon name=${this.trailingIcon}></m3-icon>`;
    }
    if (this.trailingText) {
      return this.trailingText;
    }
    if (this.caret) {
      return html`<m3-icon name="chevron-right"></m3-icon>`;
    }
    return html`<slot name="trailing"></slot>`;
  }

  renderText() {
    if (this.text) {
      return html` <div class="text" part="text">${this.text}</div> `;
    }

    return html` <div class="text" part="text"><slot></slot></div> `;
  }

  renderContainer() {
    return html`
      <div class="leading" part="leading">${this.renderLeading()}</div>
      <div class="body">
        <slot name="body">
          <div class="headline" part="headline"><slot name="headline">${this.headline}</slot></div>
          ${this.renderText()}
        </slot>
      </div>
      <div class="trailing" part="trailing">${this.renderTrailing()}</div>
    `;
  }

  render() {
    if (!this.variant) {
      this.variant = this.text || this.innerHTML ? 'two' : 'one';
    }

    if (this.href) {
      return html`<a href=${this.href} class="container ${this.variant}" part="container">
        ${this.renderContainer()}
      </a>`;
    } else {
      return html`<div class="container ${this.variant}" part="container">
        ${this.renderContainer()}
      </div>`;
    }
  }
}

