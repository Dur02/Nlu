import { readMine as readMyUser } from 'shared/actions/user';

export default (dispatch) => [
  dispatch(readMyUser()),
];
