import React from 'react';
import Layout from 'shared/components/layout';
import { useSelector } from 'react-redux';
import selector from './intervention-selector';

const result = () => {
  const {
    intervention,
  } = useSelector(selector);
  // eslint-disable-next-line no-console
  console.log(intervention);

  return (
    <Layout>
      <p>111</p>
    </Layout>
  );
};

result.displayName = __filename;

export default result;
