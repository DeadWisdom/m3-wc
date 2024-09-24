import { type ReactiveController, type ReactiveControllerHost } from 'lit';
import { matchUrlPattern, type URLParams } from '../data/routing';

export interface Route {
  name?: string;
  pattern: string | URLPatternInit | URLPattern;
  render: (params: URLParams) => any;
  load?: (params: URLParams) => Promise<() => void>;
}

export interface RouteMatch {
  route: Route;
  params: URLParams;
}

export type RouteConfig = Route[] | (() => Route[] | undefined);

export class Router implements ReactiveController {
  _host: ReactiveControllerHost & HTMLElement;

  _unload?: () => void;
  _loadCounter: number = 0;
  _routes?: RouteConfig;
  _active?: Route;
  _params?: URLParams;
  _loading: boolean = false;
  _error?: Error;

  callback?: (route: Route) => void;

  get activeRoute() {
    return this._active;
  }

  get activeParams() {
    return this._params;
  }

  get loading() {
    return this._loading;
  }

  get error() {
    return this._error;
  }

  get routes(): Route[] | undefined {
    if (typeof this._routes === 'function') {
      return this._routes();
    }
    return this._routes;
  }

  set routes(routes: RouteConfig) {
    this._routes = routes;
  }

  constructor(
    host: ReactiveControllerHost & HTMLElement,
    routes?: RouteConfig,
  ) {
    (this._host = host).addController(this);
    this._routes = routes || [];
  }

  hostConnected(): void { }
  hostDisconnected(): void { }

  activateURL(url: string | URL) {
    let match = this.findRoute(url);
    if (!match) return undefined;
    this.activateRoute(match.route, match.params);
    return match;
  }

  activateRoute(route: Route, params: URLParams) {
    this._active = route;
    this._params = params;
    this._load();
    this._host.requestUpdate();
  }

  render() {
    if (this._active) {
      return this._active.render(this._params!);
    }
  }

  findRoute(url: string | URL): RouteMatch | undefined {
    let routes = this.routes;
    if (!routes) return;
    url = new URL(url, window.location.origin);
    for (let route of routes) {
      let params = matchUrlPattern(url, route.pattern);
      if (params) {
        return { route, params };
      }
    }
  }

  _load() {
    let nonce = ++this._loadCounter;

    if (this._unload) this._unload();
    this._unload = undefined;

    if (this._active?.load) {
      this._loading = true;
      this._active
        .load(this._params!)
        .then(unload => {
          if (nonce !== this._loadCounter) return;
          this._unload = unload || undefined;
          this._loading = false;
          this._error = undefined;
        }).catch(e => {
          if (nonce !== this._loadCounter) return;
          this._loading = false;
          this._error = e;
          console.error(e);
        }).finally(() => {
          this._host.requestUpdate();
        });
    } else {
      this._loading = false;
      this._error = undefined;
    }
  }
}

export class WindowRouter extends Router {
  _listening: boolean = false;
  _activeURL: URL = new URL(window.location.href);
  _initialURL: URL = new URL(window.location.href);

  get url() {
    return this._activeURL;
  }

  set url(url: string | URL) {
    this.navigate(url);
  }

  get initialURL() {
    return this._initialURL;
  }

  hasChanged() {
    return this._activeURL.href !== this._initialURL.href;
  }

  hostConnected(): void {
    super.hostConnected();
    this.startListening();
  }

  hostDisconnected(): void {
    this.stopListening();
    super.hostDisconnected();
  }

  startListening() {
    if (this._listening) return;
    window.addEventListener('popstate', this._onPopState);
    window.addEventListener('click', this._onClick);
    this._listening = true;
  }

  stopListening() {
    if (!this._listening) return;
    window.removeEventListener('popstate', this._onPopState);
    window.removeEventListener('click', this._onClick);
    this._listening = false;
  }

  _update(url: string | URL) {
    url = makeURL(url);
    if (this.activateURL(url)) {
      this._activeURL = url;
      return true;
    } else {
      return false;
    }
  }

  navigate(url: string | URL, state?: any) {
    if (this._update(url)) {
      window.history.pushState(state, '', this._activeURL.href);
      return true;
    }
    return false;
  }

  replace(url: string | URL, state?: any) {
    if (this._update(url)) {
      window.history.replaceState(state, '', this._activeURL.href);
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