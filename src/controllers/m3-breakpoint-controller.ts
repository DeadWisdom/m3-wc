import type { ReactiveController, ReactiveControllerHost } from "lit";
import { getMediaBreakpoint, type M3MediaBreakpoint } from "../data/breakpoints";

export class M3BreakpointController implements ReactiveController {
  host: ReactiveControllerHost;
  value?: M3MediaBreakpoint;
  _callback?: (value: M3MediaBreakpoint) => void;

  constructor(host: ReactiveControllerHost, callback?: (value: M3MediaBreakpoint) => void) {
    (this.host = host).addController(this);
    this._callback = callback;
  }

  hostConnected(): void {
    window.addEventListener('resize', this.refreshBreakpoint);
    this.refreshBreakpoint();
  }

  hostDisconnected(): void {
    window.removeEventListener('resize', this.refreshBreakpoint);
  }

  refreshBreakpoint = () => {
    let breakpoint = getMediaBreakpoint(window.innerWidth);
    if (breakpoint !== this.value) {
      this.value = breakpoint;
      if (this._callback) {
        this._callback(breakpoint);
      } else {
        this.host.requestUpdate();
      }
    }
  }

}
