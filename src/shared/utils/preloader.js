import { readByName as readProductByName } from 'shared/actions/product';

export default (dispatch) => [
  dispatch(readProductByName()),
];
