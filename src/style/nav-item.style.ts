import { css } from "lit";
import { largeFont, mediumFont, smallFont } from "./type.style.ts";

export const navItemStyles = css`
  .item {
    color: var(--md-sys-color-on-surface);
    border-radius: var(--md-sys-shape-corner-none);
    display: flex;

    align-items: center;
    gap: var(--m3-nav-item-padding);
    text-decoration: none;
    border: none;
    cursor: pointer;
    position: relative;
    z-index: 1;
    background-color: transparent;
    transition: none 150ms ease-in-out;
    
    flex-direction: row;
    justify-content: flex-start;
    height: 50px;
    padding: 0 var(--m3-nav-item-padding);

    ${largeFont}
  }

  .item m3-icon {
    box-sizing: content-box;
    height: var(--m3-nav-icon-size);
    width: var(--m3-nav-icon-size);
    display: flex;
  }

  .item[active] .indicator, .item:hover .indicator {
    background-color: var(--md-sys-color-secondary-container);
  }
  
  .item:hover:after, .item[active]:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    background-color: var(--md-sys-color-secondary-container);
    z-index: -1;

    height: auto;
    bottom: 0;
    border-radius: var(--md-sys-shape-corner-large);
  }
  
  /* Rail */
  :host([mode=rail]) .item {
    flex-direction: column;
    justify-content: center;
    height: auto;
    padding: var(--m3-nav-item-padding-rail);
    gap: var(--m3-nav-item-padding-rail);

    ${mediumFont}
  }

  :host([mode=rail]) .item[priority="low"] {
    display: none;
  }
  
  :host([mode=rail]) .item:hover:after, :host([mode=rail]) .item[active]:after {
    height: var(--m3-nav-rail-indicator-size);
    bottom: auto;
    border-radius: var(--md-sys-shape-corner-medium);
  }

  /* Bar */
  :host([mode=bar]) .item {
    flex-direction: column;
    justify-content: center;
    height: auto;
    padding: var(--m3-nav-item-padding-rail);
    gap: var(--m3-nav-item-padding-rail);

    ${smallFont}
  }

  :host([mode=bar]) .item[priority="low"],
  :host([mode=bar]) .item[priority="normal"] {
    display: none;
  }
  
  :host([mode=bar]) .item:hover:after, :host([mode=rail]) .item[active]:after {
    height: var(--m3-nav-rail-indicator-size);
    bottom: auto;
    border-radius: var(--md-sys-shape-corner-medium);
  }
`;