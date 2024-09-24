import { html, css, LitElement } from 'lit';
import type { HTMLTemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { loadIcon } from '../data/icons';

@customElement('m3-icon')
export class M3Icon extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  `;

  @state() svg: SVGElement | HTMLTemplateResult | null = null;

  @property({ reflect: true }) name?: string;

  @property() label = '';

  updated(changes: Map<string, any>) {
    if (changes.has('label')) {
      this.updateLabel(changes);
    }
    if (changes.has('name')) {
      this.updateIcon(changes);
    }
  }

  updateLabel(changes: Map<string, any>) {
    if (this.label) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', this.label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }
  }

  updateIcon(changes: Map<string, any>) {
    if (!this.name) return;
    if (changes.get('name') !== this.name) {
      this.loadIconByName(this.name);
    }
  }

  loadIconByName(name: string) {
    loadIcon(name).then(svg => {
      if (name != this.name) return;
      if (svg instanceof SVGElement) {
        this.svg = svg.cloneNode(true) as SVGElement;
      } else {
        this.svg = svg;
      }
      this.dispatchEvent(new Event('load'));
    });
  }

  render() {
    return this.svg || html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3-icon": M3Icon;
  }
}