import { combineReducers } from 'redux';
import { createReducer } from 'relient/reducers';
import auth from './auth';
import product from './product';
import skill from './skill';
import words from './words';
import output from './output';
import user from './user';

export default combineReducers({
  ...createReducer([
    auth,
    product,
    skill,
    words,
    output,
    user,
  ]),
});
