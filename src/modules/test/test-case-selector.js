import { getSkillsWithCodeKey } from 'shared/selectors';
import { getEntityArray } from 'relient/selectors';
import { flow, map } from 'lodash/fp';

export default (state) => ({
  skills: flow(
    getSkillsWithCodeKey,
    map(({ id, name, code }) => ({ value: code, label: name, skillCode: code, key: id })),
  )(state),
  intents: flow(
    getEntityArray('intent'),
    map(({ id, name, skillId }) => ({ value: id, label: name, skillId, key: id })),
  )(state),
});
