import { combineReducers } from 'redux';
import { createReducer } from 'relient/reducers';
import auth from './auth';
import product from './product';

export default combineReducers({
  ...createReducer([
    auth,
    product,
  ]),
});
