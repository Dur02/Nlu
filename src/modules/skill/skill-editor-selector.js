import { getEntity, getEntityArray } from 'relient/selectors';
import { flow, find, filter, propEq, map, orderBy } from 'lodash/fp';

export default (skillId) => (state) => ({
  builtinIntents: flow(
    getEntityArray('builtinIntent'),
    orderBy(['id'], ['desc']),
  )(state),
  skill: getEntity(`skill.${skillId}`)(state),
  intents: flow(
    getEntityArray('intent'),
    filter(propEq('skillId', skillId)),
    orderBy(['id'], ['desc']),
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
      slots: JSON.parse(intent.slots),
    })),
  )(state),
  words: flow(
    getEntityArray('words'),
    orderBy(['id'], ['desc']),
    filter((words) => words.skillId === 0 || words.skillId === skillId),
    map((words) => ({
      ...words,
      content: map(([word, synonym]) => ({ word, synonym }))(JSON.parse(words.content)),
    })),
  )(state),
  rules: flow(
    getEntityArray('rule'),
    orderBy(['id'], ['desc']),
  )(state),
});
