import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('m3-layout')
export class M3Layout extends LitElement {
  static styles = css`
    :host {
      display: flex;
      height: 100vh;
      align-items: stretch;
      padding-left: 0;
    }

    .nav-container, .supporting-container, .main-container {
      display: flex;
      align-items: stretch;
    }

    .main-container {
      margin: var(--m3-gap);
      display: flex;
      flex-direction: row;
      align-items: stretch;
      gap: var(--m3-gap);
      flex-grow: 1;
      flex-wrap: wrap;
    }

    .supporting-container::slotted(*) {
      margin: var(--m3-gap);
    }

    /* Ugly Hack -- Gets at the root of a fundemental issue -- Ugh */
    .nav-container::slotted([mode="rail"]),
    .nav-container::slotted([mode="drawer"]) {
      margin-right: var(--m3-gap-negative);
    }
  `;

  render() {
    return html`
      <slot name="nav" class="nav-container"></slot>
      <slot class="main-container"></slot>
      <slot class="supporting-container" name="supporting"></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3-layout": M3Layout;
  }
}

/*

[ panel ] [ panel ]

top app bar
bottom app bar
nav rail + drawer + bar

top panel bar

*/