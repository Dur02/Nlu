import React, { useCallback, useState } from 'react';
import { string, node, bool } from 'prop-types';
import { Layout, Card } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from 'shared/actions/auth';
import useStyles from 'isomorphic-style-loader/useStyles';
import { Link } from 'relient-admin/components';
import { last } from 'lodash/fp';
import { getFeatureBy } from 'relient/features';
import getConfig from 'relient/config';
import { getWithBaseUrl } from 'relient/url';
import relientAdminStyle from 'relient-admin/styles.css';
import Sider from './sider';
import globalStyle from './global_.less';
import s from './index.less';
import Footer from './footer';
import Header from './header';
import selector from './layout-selector';

const { Content } = Layout;

const result = ({
  children,
  className,
  title,
  subTitle,
  multipleCard = false,
}) => {
  useStyles(globalStyle, relientAdminStyle, s);
  const { features, currentAccount, selectedFeatureKeys } = useSelector(selector);
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutAction());
    global.document.location.replace(getWithBaseUrl('/auth/login', getConfig('baseUrl')));
  }, [logoutAction]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSider = useCallback(() => setIsCollapsed(!isCollapsed), [isCollapsed]);

  return (
    <Layout hasSider className={s.Root}>
      <Sider
        selectedFeatureKeys={selectedFeatureKeys}
        features={features}
        isCollapsed={isCollapsed}
      />
      <Content style={{ height: '100%' }}>
        {currentAccount && (
          <Header
            email={currentAccount.email}
            username={currentAccount.username}
            logout={logout}
            toggleSider={toggleSider}
            isCollapsed={isCollapsed}
          />
        )}

        <div className={s.Title}>
          <h1 className={s.TitleText}>
            {title || (subTitle
              ? <Link featureKey={last(selectedFeatureKeys)} />
              : getFeatureBy('text')(last(selectedFeatureKeys)))}
          </h1>
          {subTitle && <div className={s.Separator}>/</div>}
          <div className={s.SubTitle}>{subTitle}</div>
        </div>

        <div className={className} style={{ margin: '24px 24px 0' }}>
          {multipleCard ? children : (
            <Card bordered={false}>
              {children}
            </Card>
          )}
        </div>
        <Footer />
      </Content>
    </Layout>
  );
};

result.propTypes = {
  children: node,
  className: string,
  title: node,
  subTitle: string,
  multipleCard: bool,
};

result.displayName = __filename;

export default result;
