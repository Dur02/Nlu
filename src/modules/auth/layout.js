import React from 'react';
import { node, string } from 'prop-types';
import useStyles from 'isomorphic-style-loader/useStyles';
import Footer from 'shared/components/layout/footer';
// eslint-disable-next-line css-modules/no-unused-class
import globalStyle from 'shared/components/layout/global_.less';
import s from './layout.less';

const result = ({
  children,
  className,
}) => {
  useStyles(globalStyle, s);

  return (
    <div className={s.Root}>
      <div className={s.Top}>
        <div className={s.Header}>
          <span className={s.Title}>NLU Editor</span>
        </div>
      </div>
      <div className={className}>
        {children}
      </div>
      <Footer className={s.Footer} />
    </div>
  );
};

result.propTypes = {
  children: node,
  className: string,
};

result.displayName = __filename;

export default result;
