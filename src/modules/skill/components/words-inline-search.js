import React, { useCallback, useEffect, useState } from 'react';
import { array, string, func } from 'prop-types';
import { flow, map, flatten, filter, includes, reject, prop, eq, propEq } from 'lodash/fp';
import { Table } from 'antd';
import columns from './words-inline-search-columns';

const result = ({
  searchValue,
  selectedWord,
  // skillId,
  updateWords,
}) => {
  const [dataSource, setDataSource] = useState(() => (
    flow(
      map(({ id, name, content }) => map((item) => ({ ...item, id, name }))(content)),
      flatten,
      filter(({ word, synonym, name }) => (
        includes(searchValue)(word) || includes(searchValue)(synonym) || includes(searchValue)(name)
      )),
    )(selectedWord)
  ));

  const onRemove = useCallback(async ({ word, id, name }) => {
    await updateWords({
      id,
      name,
      content: reject(flow(prop('word'), eq(word)))(
        filter(propEq('id', id))(
          flow(
            map(({ id: contentId, name: contentName, content }) => (
              map((item) => ({
                ...item,
                id: contentId,
                name: contentName,
              }))(content)
            ),
            ),
            flatten,
          )(selectedWord),
        ),
      ),
    });
  }, [selectedWord]);

  useEffect(() => {
    setDataSource(() => (
      flow(
        map(({ id, name, content }) => map((item) => ({ ...item, id, name }))(content)),
        flatten,
        filter(({ word, synonym, name }) => (
          includes(searchValue)(word)
          || includes(searchValue)(synonym)
          || includes(searchValue)(name)
        )),
      )(selectedWord)
    ));
    return () => {
      setDataSource([]);
    };
  }, [searchValue, selectedWord]);

  return (
    <>
      <Table
        size="small"
        dataSource={dataSource}
        columns={columns({
          onRemove,
          updateWords,
          selectedWord,
        })}
        rowKey={(record) => `${record.word}${record.id}`}
        // pagination={false}
        scroll={{
          y: 150,
        }}
      />
    </>
  );
};

result.displayName = __filename;

result.propTypes = {
  searchValue: string.isRequired,
  selectedWord: array.isRequired,
  // skillId: number.isRequired,
  updateWords: func.isRequired,
};

export default result;
