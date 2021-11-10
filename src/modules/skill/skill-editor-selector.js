import { getEntity, getEntityArray } from 'relient/selectors';
import { flow, find, filter, propEq, map, orderBy, every, prop, includes, any, compact, split } from 'lodash/fp';
import { SLOT, TEXT } from 'shared/constants/content-type';

const mapWithIndex = map.convert({ cap: false });

const getContent = (words) => {
  if (!words.content) {
    return words.content;
  }
  if (words.format === 0) {
    return flow(split(/\r?\n/), map((word) => ({ word })))(words.content);
  }
  return map(([word, synonym]) => ({ word, synonym }))(JSON.parse(words.content));
};

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
        map((rule) => {
          const slots = JSON.parse(rule.slots);
          return {
            ...rule,
            slots: mapWithIndex((slot, index) => ({
              ...slot,
              index,
              ruleId: rule.id,
              lexiconsNames: split(',')(slot.lexiconsNames),
            }))(slots),
            sentenceDisplay: flow(
              mapWithIndex((char, index) => {
                const slot = find(({ pos: [start] }) => start === index)(slots);
                if (slot) {
                  return { type: SLOT, ...slot };
                }
                if (any(({ pos: [start, end] }) => index > start && index <= end)(slots)) {
                  return null;
                }
                return { type: TEXT, value: char, index };
              }),
              compact,
            )(rule.sentence),
          };
        }),
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
      filter((words) => !words.skillId || words.skillId === skillId),
      map((words) => ({
        ...words,
        content: getContent(words),
        canDelete: words.skillId && every(flow(
          prop('slots'),
          every(({ lexiconsNames }) => !includes(words.name)(lexiconsNames)),
        ))(intents),
      })),
    )(state),
    outputs: flow(
      getEntityArray('output'),
      map((output) => ({
        ...output,
        params: JSON.parse(output.params),
        responses: JSON.parse(output.responses),
      })),
    )(state),
  };
};
