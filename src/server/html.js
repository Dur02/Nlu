import React from 'react';
import { string, arrayOf, shape } from 'prop-types';
import clientConfig from 'relient/config/client-config';
import { getWithBaseUrl } from 'relient/url';
import getConfig from 'relient/config';

/* eslint-disable react/no-danger */

const result = ({
  title = 'NLU Editor',
  description = 'NLU Editor',
  styles = [],
  scripts = [],
  version,
  messages,
  children,
  initialState,
}) => (
  <html className="no-js" lang="zh-CN" translate="no">
    <head>
      <meta charSet="utf-8" />
      <meta name="google" content="notranslate" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link type="image/png" sizes="16x16" rel="icon" href={`${getWithBaseUrl('/images.png', getConfig('baseUrl'))}`} />
      {scripts.map((script) => (
        <link key={script} rel="preload" href={script} as="script" />
      ))}
      {styles.map((style) => (
        <style
          key={style.id}
          id={style.id}
          dangerouslySetInnerHTML={{ __html: style.cssText }}
        />
      ))}
    </head>
    <body>
      <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
      <script dangerouslySetInnerHTML={{ __html: clientConfig(['cdnDomain', 'baseUrl']) }} />
      <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__=${initialState}` }} />
      <script dangerouslySetInnerHTML={{ __html: `window.messages=${messages}` }} />
      <script dangerouslySetInnerHTML={{ __html: `window.version=${version}` }} />
      <script src="/leader-line.min.js" />
      {scripts.map((script) => <script key={script} src={script} />)}
    </body>
  </html>
);

result.propTypes = {
  title: string,
  description: string,
  styles: arrayOf(
    shape({
      id: string.isRequired,
      cssText: string.isRequired,
    }).isRequired,
  ),
  scripts: arrayOf(string.isRequired),
  children: string.isRequired,
  initialState: string,
  messages: string,
};

result.displayName = __filename;

export default result;
