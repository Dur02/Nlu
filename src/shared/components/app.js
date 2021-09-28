import React from 'react';
import { object, func, node, string } from 'prop-types';
import { Provider as ReactReduxProvider } from 'react-redux';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { DomainContext, BaseUrlContext } from 'relient-admin/contexts';
import { ConfigProvider } from 'antd';
import { I18NContext } from 'relient/i18n';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment/moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const result = ({
  children,
  store,
  domainContext,
  i18nContext,
  insertCss,
  baseUrlContext,
}) => (
  <StyleContext.Provider value={{ insertCss }}>
    <ReactReduxProvider store={store}>
      <DomainContext.Provider value={domainContext}>
        <I18NContext.Provider value={i18nContext}>
          <BaseUrlContext.Provider value={baseUrlContext}>
            <ConfigProvider locale={zhCN}>
              {children}
            </ConfigProvider>
          </BaseUrlContext.Provider>
        </I18NContext.Provider>
      </DomainContext.Provider>
    </ReactReduxProvider>
  </StyleContext.Provider>
);

result.propTypes = {
  children: node,
  store: object.isRequired,
  domainContext: object.isRequired,
  i18nContext: func.isRequired,
  insertCss: func.isRequired,
  baseUrlContext: string,
};

result.displayName = __filename;

export default result;
