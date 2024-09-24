import { css } from "lit";


export const buttonStyles = css`
  .m3-icon-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 6px;
    height: 32px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    color: var(--md-sys-color-on-surface-variant);
  }

  .m3-icon-button:hover {
    background-color: var(--m3-widget-hover-surface);
  }
`