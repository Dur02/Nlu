import React, { createElement } from 'react';
import { array, elementType, string, bool } from 'prop-types';
import useStyles from 'isomorphic-style-loader/useStyles';
import { Layout, Menu } from 'antd';
import { Link } from 'relient-admin/components';
import { map } from 'lodash/fp';

import s from './sider.less';

const { Sider } = Layout;
const { Item, SubMenu } = Menu;

const MenuItem = ({
  icon,
  items,
  text,
  key,
}) => (items ? (
  <SubMenu
    title={(
      <span>
        {icon && createElement(icon)}
        <span>{text}</span>
      </span>
    )}
    key={key}
  >
    {map(MenuItem)(items)}
  </SubMenu>
) : (
  <Item key={key}>
    <Link showIcon featureKey={key} />
  </Item>
));

MenuItem.propTypes = {
  icon: elementType,
  items: array,
  text: string,
  key: string.isRequired,
};

const result = ({ selectedFeatureKeys, features, isCollapsed }) => {
  useStyles(s);

  return (
    <Sider
      trigger={null}
      width={256}
      collapsible
      collapsed={isCollapsed}
      className={s.Root}
    >
      <div className={s.Title}>
        {!isCollapsed && <h1>NLU</h1>}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedFeatureKeys}
        defaultOpenKeys={selectedFeatureKeys}
      >
        {map(MenuItem)(features)}
      </Menu>
    </Sider>
  );
};

result.propTypes = {
  selectedFeatureKeys: array.isRequired,
  features: array.isRequired,
  isCollapsed: bool.isRequired,
};

result.displayName = __filename;

export default result;
