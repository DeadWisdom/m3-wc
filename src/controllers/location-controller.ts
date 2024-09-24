import { type ReactiveController, type ReactiveControllerHost } from 'lit';

export class LocationController implements ReactiveController {
  _host: ReactiveControllerHost & HTMLElement;

  url: URL;
  callback?: (url: URL) => boolean | void;
  listening: boolean = false;

  constructor(
    host: ReactiveControllerHost & HTMLElement,
    callback?: (url: URL) => boolean | void,
  ) {
    (this._host = host).addController(this);
    this.url = new URL(window.location.href);
    this.callback = callback;
  }

  hostConnected(): void {
    this.startListening();
  }

  hostDisconnected(): void {
    this.stopListening();
  }

  startListening() {
    if (this.listening) return;
    window.addEventListener('popstate', this._onPopState);
    window.addEventListener('click', this._onClick);
    this.listening = true;
  }

  stopListening() {
    if (!this.listening) return;
    window.removeEventListener('popstate', this._onPopState);
    window.removeEventListener('click', this._onClick);
    this.listening = false;
  }

  _update(url: string | URL) {
    url = makeURL(url);
    if (this.callback) {
      if (this.callback(url) === false)
        return false;
      this.url = url;
    } else {
      this.url = url;
      this._host.requestUpdate();
    }
    return true;
  }

  navigate(url: string | URL, state?: any) {
    if (this._update(url)) {
      window.history.pushState(state, '', this.url.href);
      return true;
    }
    return false;
  }

  replace(url: string, state?: any) {
    if (this._update(url)) {
      window.history.replaceState(state, '', this.url.href);
      return true;
    }
    return false;
  }

  reload() {
    this._update(this.url);
  }

  _onPopState = (_e: PopStateEvent) => {
    this._update(window.location.href);
  }

  _onClick = (e: MouseEvent) => {
    const isNonNavigationClick = e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey;
    if (e.defaultPrevented || isNonNavigationClick) return;

    const composedPath = e.composedPath() as HTMLElement[];
    const anchor = composedPath.find((el) => el.hasAttribute && el.hasAttribute('href'));

    if (!anchor || anchor.getAttribute('target')) return;

    const href = anchor.getAttribute('href');
    if (!href || href === location.href) return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;

    if (this.navigate(url)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
}

function makeURL(url: string | URL, baseURL?: string): URL {
  if (url instanceof URL) return url;
  return new URL(url, baseURL || window.location.origin);
};