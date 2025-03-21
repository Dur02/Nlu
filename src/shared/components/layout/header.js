import React, { createElement } from 'react';
import { string, func, bool } from 'prop-types';
import useStyles from 'isomorphic-style-loader/useStyles';
import { Layout, Dropdown, Menu } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons';

import s from './header.less';

const { Header } = Layout;
const { Item } = Menu;

const result = ({
  nickName,
  logout,
  isCollapsed,
  toggleSider,
}) => {
  useStyles(s);

  return (
    <Header className={s.Header}>
      {createElement(isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        onClick: toggleSider,
        style: { fontSize: 20 },
      })}

      <Dropdown
        overlay={(
          <Menu className={s.Menu} selectedKeys={[]}>
            <Item onClick={logout} key="logout">
              <LogoutOutlined />
              登出
            </Item>
          </Menu>
        )}
      >
        <div className={s.Action}>
          <span>{nickName}</span>
        </div>
      </Dropdown>
    </Header>
  );
};

result.propTypes = {
  nickName: string,
  logout: func.isRequired,
  isCollapsed: bool.isRequired,
  toggleSider: func.isRequired,
};

result.displayName = __filename;

export default result;
