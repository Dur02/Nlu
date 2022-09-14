import React from 'react';
import { string } from 'prop-types';
import useStyles from 'isomorphic-style-loader/useStyles';
import classNames from 'classnames';
import { CopyrightOutlined } from '@ant-design/icons';

import s from './footer.less';

const result = ({ className }) => {
  useStyles(s);

  return (
    <div className={classNames(className, s.Root)}>
      <div className={s.Copyright}>
        Copyright&nbsp;
        <CopyrightOutlined />
        &nbsp;2022 NLU Editor All Rights Reserved.
      </div>
      <div className={s.Version}>Version: {global.version}</div>
    </div>
  );
};

result.propTypes = {
  className: string,
};

result.displayName = __filename;

export default result;
