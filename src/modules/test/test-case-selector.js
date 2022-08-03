import { getSkillsWithCodeKey } from 'shared/selectors';
import { getEntityArray } from 'relient/selectors';
import { flow, map } from 'lodash/fp';

export default (state) => ({
  skills: flow(
    getSkillsWithCodeKey,
    map(({ id, name, code }) => ({ value: id, label: name, skillCode: code })),
  )(state),
  intents: flow(
    getEntityArray('intent'),
    map(({ id, name, skillId }) => ({ value: id, label: name, skillId })),
  )(state),
  rules: flow(
    getEntityArray('rule'),
    map(({ id, sentence, intentId }) => ({ value: id, label: sentence, intentId })),
  )(state),
});
