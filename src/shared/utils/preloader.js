import { readAll as readAllProduct } from 'shared/actions/product';
import { readAll as readAllBuiltinIntent } from 'shared/actions/builtin-intent';
import { readAll as readAllIntent } from 'shared/actions/intent';
import { readAll as readAllOutput } from 'shared/actions/output';
import { readAll as readAllSkill } from 'shared/actions/skill';
import { readAll as readAllWords } from 'shared/actions/words';
import { readMine as readMyUser, readAll as readAllUser } from 'shared/actions/user';
import { readAll as readAllSkillVersion } from 'shared/actions/skill-version';
import { readAll as readAllProductVersion } from 'shared/actions/product-version';
import { readAll as readAllRole } from 'shared/actions/role';
import { readAll as readAllResource } from 'shared/actions/resource';

export default (dispatch) => [
  dispatch(readAllProduct()),
  dispatch(readAllBuiltinIntent()),
  dispatch(readAllIntent()),
  dispatch(readAllOutput()),
  dispatch(readAllSkill()),
  dispatch(readAllWords({ type: 'SYSTEM' })),
  dispatch(readMyUser()),
  dispatch(readAllSkillVersion()),
  dispatch(readAllProductVersion()),
  dispatch(readAllUser()),
  dispatch(readAllRole()),
  dispatch(readAllResource()),
];
