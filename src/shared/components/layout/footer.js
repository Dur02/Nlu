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
        <div>
          Copyright&nbsp;
          <CopyrightOutlined />
          &nbsp;2020 NLU Editor All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

result.propTypes = {
  className: string,
};

result.displayName = __filename;

export default result;
