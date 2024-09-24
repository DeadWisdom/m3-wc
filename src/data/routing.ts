
export interface URLPatternInput {
  baseURL?: string;
  username?: string;
  password?: string;
  protocol?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  search?: string;
  hash?: string;
}

export interface URLParams {
  [key: string]: string | undefined;
  _match: any;
}

export function matchUrlPattern(url: URL, patternInput: URLPattern | URLPatternInput | string) {
  let params: { [key: string]: string | undefined };
  let pattern = getPattern(patternInput);
  let match = pattern.exec(url);
  if (match) {
    return getParams(match);
  }
}

export function expandUrlPattern(patternInput: URLPattern | URLPatternInput | string, params: URLParams) {
  let pattern = getPattern(patternInput);
  return
}

const _patternCache = new Map();
const getPattern = (input: URLPattern | URLPatternInput | string) => {
  if (input instanceof URLPattern) {
    return input;
  } else if (typeof input === 'object') {
    return new URLPattern(input);
  }
  let pattern = _patternCache.get(input);
  if (pattern === undefined) {
    if (typeof input === 'string' && !input.match(/^[a-z]+:\/\//)) {
      pattern = new URLPattern({ pathname: input });
    } else {
      pattern = new URLPattern(input);
    }
    _patternCache.set(input, pattern);
  }
  return pattern;
};

const getParams = (patternMatch: any) => {
  let params: Record<string, any> = {};
  let index = 0;
  for (let urlPart of Object.keys(patternMatch)) {
    if (urlPart === 'inputs') continue;
    let groups = patternMatch[urlPart].groups || {};
    let keys = Object.keys(groups);

    keys.sort();
    keys.forEach(key => {
      if (urlPart !== 'pathname' && key === '0') return;
      if (/\d+/.test(key)) {
        params[index++] = groups[key];
      } else {
        params[key] = groups[key];
      }
    });
  }
  params._match = patternMatch;
  return params as URLParams;
}
