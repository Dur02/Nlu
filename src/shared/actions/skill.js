import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post, del, put } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/skill');

export const READ_ALL = actionType('READ_ALL');
export const READ_ONE = actionType('READ_ONE');
export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');
export const UPDATE = actionType('UPDATE');
export const READ_WORD_GRAPH = actionType('READ_WORD_GRAPH');
export const SKILL_YAML_EXPORT = actionType('SKILL_YAML_EXPORT');
export const OUTPUT_YAML_EXPORT = actionType('OUTPUT_YAML_EXPORT');
export const INTENT_MIGRATE = actionType('INTENT_MIGRATE');

export const readAll = createAction(
  READ_ALL,
  ({
    page = DEFAULT_CURRENT,
    size = DEFAULT_SIZE,
  } = {}) => read('/skill/edit/skill/all', {
    current: page,
    size,
  }),
);

export const readOne = createAction(
  READ_ONE,
  ({ id }) => read(`/skill/edit/skill/${id}`),
);

export const create = createAction(
  CREATE,
  ({
    name,
    category,
    iconPath,
    productId,
  }) => post('/skill/edit/skill', {
    name,
    category,
    iconPath,
    productId,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    name,
    category,
    iconPath,
  }) => put(`/skill/edit/skill/${id}`, {
    name,
    category,
    iconPath,
  }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/skill/edit/skill/${id}`),
);

export const readWordGraph = createAction(
  READ_WORD_GRAPH,
  ({ input, skillId }) => read('/skill/edit/word-map/index/search', { refText: input, skillId }),
);

export const skillYamlExport = createAction(
  SKILL_YAML_EXPORT,
  ({ id }) => read('/skill/edit/skill/skill-yaml-export', { skillId: id }),
);

export const outputYamlExport = createAction(
  OUTPUT_YAML_EXPORT,
  ({ skillId }) => read('/skill/edit/skill/output-yaml-export', { skillId }),
);

export const intentMigrate = createAction(
  INTENT_MIGRATE,
  ({
    intentIds,
    skillWordIds,
    sourceSkillId,
    targetSkillCode,
    targetSkillId,
  }) => post('/skill/edit/skill//skill/edit/skill/data-migrate', {
    intentIds,
    skillWordIds,
    sourceSkillId,
    targetSkillCode,
    targetSkillId,
  }),
);

export const ruleMigrate = createAction(
  INTENT_MIGRATE,
  ({
    skillRuleIds,
    sourceIntentId,
    sourceIntentName,
    sourceSkillId,
    targetIntentId,
    targetIntentName,
    targetSkillId,
  }) => post('/skill/edit/skill/rule-data-migrate', {
    skillRuleIds,
    sourceIntentId,
    sourceIntentName,
    sourceSkillId,
    targetIntentId,
    targetIntentName,
    targetSkillId,
  }),
);
