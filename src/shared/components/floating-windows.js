import React, { useCallback } from 'react';
import { message, Select, Table } from 'antd';
import { useSelector } from 'react-redux';
import { push as pushAction } from 'relient/actions/history';
import { filter, find, flow, includes, map, propEq } from 'lodash/fp';
import { readMine } from 'shared/actions/user';
import { useAction } from 'relient/actions';
import { useLocalTable } from 'relient-admin/hooks';
import { getCurrentUser, getSkillsWithVersions } from '../selectors';

const hasPermission = async (readProfile, code) => {
  try {
    const { data: { skillCodes } } = await readProfile();
    if (includes(code)(skillCodes)) {
      return true;
    }
    message.error('该账号没有这个技能的权限');
    return false;
  } catch (e) {
    message.error('出错了，请重试，或联系管理员');
    return false;
  }
};

const result = ({
  // visible,
  setTempId,
}) => {
  const {
    skills,
  } = useSelector((state) => {
    const { skillCodes } = getCurrentUser(state);
    return ({
      skills: flow(
        getSkillsWithVersions,
        filter(({ code }) => includes(code)(skillCodes)),
      )(state),
    });
  });

  const readProfile = useAction(readMine);
  const push = useAction(pushAction);
  // const [loading, setLoading] = useState(false);

  const onEditHistory = useCallback(async (skillVersions, value) => {
    const temp = find(propEq('id', value))(skillVersions);
    // setLoading(true);
    setTempId(value);
    if (await hasPermission(readProfile, temp.code)) {
      push(`/skill/${temp.id}`);
      message.success('跳转中，请稍候');
    }
  }, [setTempId, readProfile]);

  const columns = [
    {
      title: '技能名',
      dataIndex: 'name',
      // width: 200,
    },
    {
      title: '版本',
      dataIndex: 'skillVersions',
      render: (skillVersions) => (
        <Select
          size="small"
          style={{ width: '100px' }}
          // open={open}
          value={-1}
          onChange={(value) => onEditHistory(skillVersions, value)}
        >
          <Select.Option value={-1}>历史版本</Select.Option>
          {map((item) => (
            <Select.Option value={item.id} key={item.id}>
              {item.version}
            </Select.Option>
          ))(skillVersions)}
        </Select>
      ),
      // width: 200,
    },
  ];

  const {
    tableHeader,
    getDataSource,
  } = useLocalTable({
    query: {
      fields: [{
        dataKey: 'name',
        label: '名称',
      }],
      width: '300px',
      fussy: true,
    },
  });

  return (
    <>
      {tableHeader}
      <Table
        style={{
          width: '300px',
        }}
        rowKey="id"
        size="small"
        dataSource={getDataSource(skills)}
        columns={columns}
        pagination={false}
        scroll={{
          y: 400,
        }}
      />
    </>
  );
};

result.displayName = __filename;

export default result;
