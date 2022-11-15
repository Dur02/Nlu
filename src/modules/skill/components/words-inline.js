import React from 'react';
import { Collapse, Modal } from 'antd';
import { array, bool, func, number, object } from 'prop-types';
import { compact, find, flow, map, propEq } from 'lodash/fp';

const { Panel } = Collapse;

const result = ({
  isModalOpen,
  setIsModalOpen,
  selectedSlots,
  setSelectedSlots,
  words,
  createWords,
  updateWords,
  removeWords,
  skillId,
}) => {
  // eslint-disable-next-line no-console
  console.log(createWords);
  // eslint-disable-next-line no-console
  console.log(updateWords);
  // eslint-disable-next-line no-console
  console.log(removeWords);
  // eslint-disable-next-line no-console
  console.log(skillId);

  const selectedWords = flow(
    map((name) => find(propEq('name', name))(words)),
    compact,
  )(selectedSlots.lexiconsNames);

  // eslint-disable-next-line no-console
  console.log(selectedWords);

  return (
    <>
      <Modal
        title={selectedSlots.name}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedSlots({});
        }}
      >
        <Collapse>
          {
            map((item) => (
              <Panel header={item.name} key={item.code}>
                <p>test1</p>
              </Panel>
            ))(selectedWords)
          }
        </Collapse>
      </Modal>
    </>
  );
};

result.displayName = __filename;

result.propTypes = {
  isModalOpen: bool.isRequired,
  setIsModalOpen: func.isRequired,
  selectedSlots: object.isRequired,
  setSelectedSlots: func.isRequired,
  words: array.isRequired,
  createWords: func.isRequired,
  updateWords: func.isRequired,
  removeWords: func.isRequired,
  skillId: number.isRequired,
};

export default result;
