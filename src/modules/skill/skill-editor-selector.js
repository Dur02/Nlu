import { getEntity, getEntityArray } from 'relient/selectors';
import { flow, find, filter, propEq, map } from 'lodash/fp';

export default (skillId) => (state) => ({
  builtinIntents: getEntityArray('builtinIntent')(state),
  skill: getEntity(`skill.${skillId}`)(state),
  intents: flow(
    getEntityArray('intent'),
    filter(propEq('skillId', skillId)),
    map((intent) => ({
      ...intent,
      output: flow(
        getEntityArray('output'),
        find(propEq('intentId', intent.id)),
      )(state),
      rules: flow(
        getEntityArray('rule'),
        filter(propEq('intentId', intent.id)),
      )(state),
    })),
  )(state),
  words: flow(
    getEntityArray('words'),
    filter((words) => words.skillId === 0 || words.skillId === skillId),
  )(state),
});
