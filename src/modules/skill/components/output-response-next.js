import React, { useCallback, useEffect, useState } from 'react';
import { Select, Checkbox } from 'antd';
import { array, bool, func, string } from 'prop-types';
import { map } from 'lodash/fp';

const options = [{
  label: '结束对话',
  value: 'end',
}, {
  label: '跳转至意图',
  value: 'intents',
}];

const result = ({
  next,
  nextAny,
  onUpdateResponse,
  intents,
  cId,
}) => {
  const [intentsVisible, setIntentsVisible] = useState();
  useEffect(() => {
    setIntentsVisible((next && next.length > 0) || nextAny);
  }, [setIntentsVisible, cId]);
  const onSelectChange = useCallback(async (value) => {
    if (value === 'end') {
      await onUpdateResponse({ cId, next: [], nextAny: false });
      setIntentsVisible(false);
    } else {
      await onUpdateResponse({ cId, nextAny: true, next: [] });
      setIntentsVisible(true);
    }
  }, [onUpdateResponse, cId]);
  const onNextChange = useCallback(async (selectedIntentNames) => {
    if (selectedIntentNames.length > 0) {
      await onUpdateResponse({ cId, nextAny: false, next: selectedIntentNames });
    } else {
      await onUpdateResponse({ cId, nextAny: true, next: [] });
    }
  }, [onUpdateResponse, cId]);
  const onNextAnyChange = useCallback(async (checked) => {
    if (checked) {
      await onUpdateResponse({ cId, nextAny: true, next: [] });
    } else if (next && next.length > 0) {
      await onUpdateResponse({ cId, nextAny: false });
    }
  }, [onUpdateResponse, cId]);

  return (
    <div>
      <div>
        <Select
          options={options}
          onChange={onSelectChange}
          value={nextAny === true || (next && next.length > 0) ? 'intents' : 'end'}
        />
      </div>
      {intentsVisible && (
        <div style={{ marginTop: 10 }}>
          <Checkbox checked={nextAny} onChange={onNextAnyChange}>任意意图</Checkbox>
          <Checkbox.Group
            options={map(({ name }) => ({ label: name, value: name }))(intents)}
            value={next}
            onChange={onNextChange}
          />
        </div>
      )}
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  next: array,
  nextAny: bool,
  onUpdateResponse: func.isRequired,
  intents: array,
  cId: string,
};

export default result;
