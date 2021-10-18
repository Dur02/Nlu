import { getEntity, getEntityArray } from 'relient/selectors';
import { flow, find, filter, propEq, map, orderBy, every, prop, includes } from 'lodash/fp';

const mapWithIndex = map.convert({ cap: false });

export default (skillId) => (state) => {
  const intents = flow(
    getEntityArray('intent'),
    filter(propEq('skillId', skillId)),
    orderBy(['id'], ['desc']),
    map((intent) => {
      const rules = flow(
        getEntityArray('rule'),
        filter(propEq('intentId', intent.id)),
        orderBy(['id'], ['desc']),
        map((rule) => ({
          ...rule,
          slots: mapWithIndex((slot, index) => ({
            ...slot,
            index,
            ruleId: rule.id,
          }))(JSON.parse(rule.slots)),
        })),
      )(state);
      return {
        ...intent,
        output: flow(
          getEntityArray('output'),
          find(propEq('intentId', intent.id)),
        )(state),
        rules,
        slots: map((slot) => ({
          ...slot,
          canDelete: every(flow(
            prop('slots'),
            every(({ name }) => slot.name !== name),
          ))(rules),
        }))(JSON.parse(intent.slots)),
      };
    }),
  )(state);
  return {
    builtinIntents: flow(
      getEntityArray('builtinIntent'),
      orderBy(['id'], ['desc']),
    )(state),
    skill: getEntity(`skill.${skillId}`)(state),
    intents,
    words: flow(
      getEntityArray('words'),
      orderBy(['id'], ['desc']),
      filter((words) => words.skillId === 0 || words.skillId === skillId),
      map((words) => ({
        ...words,
        content: map(([word, synonym]) => ({ word, synonym }))(JSON.parse(words.content)),
        canDelete: skillId !== 0 && every(flow(
          prop('slots'),
          every(({ lexiconsNames }) => !includes(words.name)(lexiconsNames)),
        ))(intents),
      })),
    )(state),
  };
};
