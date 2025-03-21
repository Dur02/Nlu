import { getEntity, getEntityArray } from 'relient/selectors';
import { flow, find, filter, propEq, map, orderBy, every, prop, includes, any, compact, split } from 'lodash/fp';
import { SLOT, TEXT } from 'shared/constants/content-type';
import { getCName, getIsDefault } from 'shared/utils/helper';
import { getCheckboxValue } from 'shared/constants/config';
import { getCurrentUser, getSkillsWithVersions } from '../../shared/selectors';

const mapWithIndex = map.convert({ cap: false });

const getContent = (words) => {
  try {
    if (!words.content) {
      return words.content;
    }
    if (words.format === 0) {
      return flow(split(/\r?\n/), map((word) => ({ word })))(words.content);
    }
    return map(([word, synonym]) => ({ word, synonym }))(JSON.parse(words.content));
  } catch (e) {
    console.error(e);
    // eslint-disable-next-line no-console
    console.log('words', words);
    return [];
  }
};

export default (skillId, tempId) => (state) => {
  if (tempId !== -1 && tempId !== skillId) {
    // console.log(tempId);
    // console.log(skillId);
    // console.log('1111');
    return {};
  }
  // console.log(tempId);
  // console.log(skillId);
  // console.log('22222');
  const { skillCodes } = getCurrentUser(state);
  const intents = flow(
    getEntityArray('intent'),
    filter(propEq('skillId', skillId)),
    orderBy(['id'], ['asc']),
    map((intent) => {
      const rules = flow(
        getEntityArray('rule'),
        filter(propEq('intentId', intent.id)),
        map((rule) => {
          const slots = JSON.parse(rule.slots);
          return {
            ...rule,
            slots: mapWithIndex((slot, index) => ({
              ...slot,
              index,
              ruleId: rule.id,
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
        orderBy(['sentenceDisplay.length'], ['asc']),
      )(state);
      return {
        ...intent,
        output: flow(
          getEntityArray('output'),
          find(propEq('intentId', intent.id)),
        )(state),
        rules,
        slots: intent.slots ? map((slot) => ({
          ...slot,
          lexiconsNames: slot.lexiconsNames ? split(',')(slot.lexiconsNames) : [],
          lexiconsNamesJoint: slot.lexiconsNames,
          canDelete: every(flow(
            prop('slots'),
            every(({ name }) => slot.name !== name),
          ))(rules),
        }))(JSON.parse(intent.slots)) : [],
      };
    }),
  )(state);
  return {
    builtinIntents: flow(
      getEntityArray('builtinIntent'),
      orderBy(['id'], ['asc']),
    )(state),
    skillVersion: flow(
      getSkillsWithVersions,
      filter(({ code }) => includes(code)(skillCodes)),
    )(state),
    skill: getEntity(`skillVersion.${skillId}`)(state),
    intents,
    words: flow(
      getEntityArray('words'),
      orderBy(['id'], ['asc']),
      filter((words) => !words.skillId || words.skillId === skillId),
      map((words) => ({
        ...words,
        content: getContent(words),
        canDelete: words.skillId && every(flow(
          prop('slots'),
          every(({ lexiconsNames }) => !includes(words.name)(lexiconsNames)),
        ))(intents),
        // appGroundType: words.wordConfig
        //   ? getCheckboxValue(words.wordConfig.appGroundType, 'activated') : 0,
        duplexType: words.wordConfig
          ? getCheckboxValue(words.wordConfig.duplexType, 'duplexType') : 0,
      })),
    )(state),
    outputs: flow(
      getEntityArray('output'),
      map((output) => ({
        ...output,
        params: JSON.parse(output.params),
        responses: mapWithIndex((response, index) => {
          const { condition, cnames } = response;
          const isDefault = getIsDefault(condition);
          return {
            cId: index.toString(),
            cnames: cnames || getCName(condition),
            isDefault,
            ...response,
          };
        })(JSON.parse(output.responses)),
      })),
    )(state),
    token: getEntity('auth.authorization')(state),
  };
};
