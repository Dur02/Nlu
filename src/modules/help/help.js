/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Layout from 'shared/components/layout';
import { Typography, Anchor, Row, Col, Table, BackTop, Space } from 'antd';
import { sysIntentTableData, sysIntentTableColumns } from './sys-intent-data';

const { Title, Paragraph, Text } = Typography;
const { Link } = Anchor;

const result = () => (
  <Layout>
    <Row>
      <Col span={21}>
        <Space direction="vertical">

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

          <Typography>
            <Title id="system-intent">对话回复API地址</Title>
            <Title level={2}>Joypods天气appV2.0.0</Title>
            <Paragraph>
              <Space direction="vertical">
                <Text>
                  API地址：
                  <Typography.Link href="http://apis.dui.ai/webhook/weather/base" target="_blank">
                    http://apis.dui.ai/webhook/weather/base
                  </Typography.Link>
                </Text>
                <Text>
                  API地址：
                  <Typography.Link href="http://skill-webhooks:8093/webhooks/weather/dm" target="_blank">
                    http://skill-webhooks:8093/webhooks/weather/dm
                  </Typography.Link>
                </Text>
              </Space>
            </Paragraph>
            {/* <Divider /> */}
          </Typography>

        </Space>
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
