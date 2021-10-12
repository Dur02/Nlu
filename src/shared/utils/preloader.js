import { readAll as readAllProduct } from 'shared/actions/product';
import { readAll as readAllBuiltinIntent } from 'shared/actions/builtin-intent';
import { readAll as readAllOutput } from 'shared/actions/output';
import { readAll as readAllSkill } from 'shared/actions/skill';
import { readAll as readAllWords } from 'shared/actions/words';
import { readMine as readMyUser } from 'shared/actions/user';

export default (dispatch) => [
  dispatch(readAllProduct()),
  dispatch(readAllBuiltinIntent()),
  dispatch(readAllOutput()),
  dispatch(readAllSkill()),
  dispatch(readAllWords()),
  dispatch(readMyUser()),
];
