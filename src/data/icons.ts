import { html, css, LitElement, svg } from 'lit';
import type { HTMLTemplateResult } from 'lit';

/*
All this icon stuff was stolen from Shoelace, those glorious bastards.
*/

export type SVGResult = HTMLTemplateResult | SVGElement | null;
export type IconLibraryResolver = (name: string) => string;
export type IconLibraryMutator = (svg: SVGElement) => void;
export interface IconLibrary {
  name: string;
  resolver: IconLibraryResolver;
  mutator?: IconLibraryMutator;
}
export class IconFetchError extends Error { }

export const MaterialIcons: IconLibrary = {
  name: 'Material Icons',
  resolver: name => {
    const match = name.match(/^(.*?)(_(round|sharp))?$/)!;
    return `https://cdn.jsdelivr.net/npm/@material-icons/svg@1.0.5/svg/${match[1]}/${match[3] || 'outline'}.svg`;
  },
  mutator: svg => svg.setAttribute('fill', 'currentColor')
}

let domParser: DOMParser;
let cache = new Map<string, Promise<SVGResult>>();

/**
 * Loads the icon reliably
 * 
 * Will keep trying in case of network issues
 */
export async function loadIcon(name: string, library: IconLibrary = MaterialIcons): Promise<SVGResult> {
  if (!name) return null;

  return await loadSVG(library.resolver(name), library.mutator);
}

/**
 * Loads the SVG from the url and applies the mutator if provided
 * 
 * Will keep trying forever until it resolves with an exponential backoff max 10 seconds
 */
function loadSVG(url: string, mutator: IconLibraryMutator | undefined): Promise<SVGResult> {
  if (cache.has(url))
    return cache.get(url)!;

  let promise = new Promise<SVGResult>((resolve, reject) => {
    let backoff = 1000;
    function retry() {
      fetchSVG(url).then(svg => {
        if (svg && mutator) mutator(svg);
        resolve(svg);
      }).catch(e => {
        if (e instanceof IconFetchError) {
          setTimeout(retry, backoff);
          backoff = Math.min(10000, backoff * 1.5);
        } else {
          reject(e);
        }
      });
    }
    retry();
  });

  cache.set(url, promise)
  return promise;
}

/**
 * Resolve the SVG by the url
 * 
 * @throws {FetchError} If the fetch fails, could be retried
 * @returns {Promise<SVGResult>} The SVG element or null if the icon is not found and should not be retried
 */
async function fetchSVG(url: string): Promise<SVGElement | null> {
  let fileData: Response;

  try {
    fileData = await fetch(url, { mode: 'cors' });
    if (!fileData.ok) {
      if (fileData.status === 410 || fileData.status === 404) return null;
      throw new IconFetchError(fileData.statusText);
    }
  } catch (e: any) {
    throw new IconFetchError(e.message || e.toString());
  }

  try {
    const div = document.createElement('div');
    div.innerHTML = await fileData.text();

    const svg = div.firstElementChild;
    if (svg?.tagName?.toLowerCase() !== 'svg') return null;

    if (!domParser) domParser = new DOMParser();
    const doc = domParser.parseFromString(svg.outerHTML, 'text/html');

    const svgEl = doc.body.querySelector('svg');
    if (!svgEl) return null;

    svgEl.part.add('svg');
    return document.adoptNode(svgEl);
  } catch {
    return null;
  }
}

