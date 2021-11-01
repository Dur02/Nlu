import { readAll as readAllProduct } from 'shared/actions/product';
import { readAll as readAllBuiltinIntent } from 'shared/actions/builtin-intent';
import { readAll as readAllIntent } from 'shared/actions/intent';
import { readAll as readAllOutput } from 'shared/actions/output';
import { readAll as readAllSkill } from 'shared/actions/skill';
import { readAll as readAllWords } from 'shared/actions/words';
import { readMine as readMyUser } from 'shared/actions/user';
import { readAll as readAllSkillVersion } from 'shared/actions/skill-version';
import { readAll as readAllProductVersion } from 'shared/actions/product-version';
import { readAll as readAllRule } from 'shared/actions/rule';

export default (dispatch) => [
  dispatch(readAllProduct()),
  dispatch(readAllBuiltinIntent()),
  dispatch(readAllIntent()),
  dispatch(readAllOutput()),
  dispatch(readAllSkill()),
  dispatch(readAllWords({ skillId: 0 })),
  dispatch(readMyUser()),
  dispatch(readAllSkillVersion()),
  dispatch(readAllProductVersion()),
  dispatch(readAllRule()),
];
