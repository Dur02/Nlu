import React from 'react';
import { string } from 'prop-types';
import Layout from 'shared/components/layout';
import useStyles from 'isomorphic-style-loader/useStyles';
import { Card } from 'antd';

import s from './not-found.css';

const result = ({ title }) => {
  useStyles(s);

  return (
    <Layout title={title}>
      <Card className={s.Container}>
        <p>Sorry, the page you were trying to view does not exist.</p>
      </Card>
    </Layout>
  );
};

result.propTypes = {
  title: string,
};

result.displayName = __filename;

export default result;
