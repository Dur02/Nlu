import { stringify } from 'query-string';
import {
  prop,
} from 'lodash/fp';

const commonFetch = (
  method,
  url,
  data,
  options,
) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    ...prop('headers')(options),
  };
  const body = [];
  if (data) {
    Object.keys(data).forEach((key) => {
      body.push(`${key}=${data[key]}`);
    });
  }

  return {
    ...options,
    url,
    isApi: true,
    method,
    headers,
    body: body.join('&'),
  };
};

export const read = (
  url,
  query,
  options,
) => commonFetch('GET', query ? `${url}?${stringify(query)}` : url, undefined, options);

export const post = (
  url,
  data,
  options,
) => commonFetch('POST', url, data, options);

export const put = (
  url,
  data,
  options,
) => commonFetch('PUT', url, data, options);

export const patch = (
  url,
  data,
  options,
) => commonFetch('PATCH', url, data, options);

export const del = (
  url,
  query,
  options,
) => commonFetch('DELETE', query ? `${url}?${stringify(query)}` : url, undefined, options);
