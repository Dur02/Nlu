/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Layout from 'shared/components/layout';
import { Typography, Anchor, Row, Col, Table, BackTop } from 'antd';
import { sysIntentTableData, sysIntentTableColumns } from './sys-intent-data';

const { Title, Paragraph } = Typography;
const { Link } = Anchor;

const result = () => (
  <Layout>
    <Row>
      <Col span={21}>
        <Typography>
          <Title id="system-intent">系统词库解说</Title>
          <Paragraph>
            <Table
              columns={sysIntentTableColumns}
              dataSource={sysIntentTableData}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Paragraph>
          {/* <Divider /> */}
        </Typography>
      </Col>
      <Col span={2} offset={1}>
        <Anchor>
          <Link href="#system-intent" title="系统词库解说" />
        </Anchor>
      </Col>
    </Row>
    <BackTop visibilityHeight={50} />
  </Layout>
);

result.displayName = __filename;

export default result;
