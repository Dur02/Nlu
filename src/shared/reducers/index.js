import { combineReducers } from 'redux';
import { createReducer } from 'relient/reducers';
import auth from './auth';
import product from './product';
import skill from './skill';
import words from './words';
import output from './output';
import user from './user';
import intent from './intent';
import builtinIntent from './builtin-intent';
import productVersion from './product-version';
import skillVersion from './skill-version';
import rule from './rule';

export default combineReducers({
  ...createReducer([
    auth,
    product,
    skill,
    words,
    output,
    user,
    intent,
    builtinIntent,
    productVersion,
    skillVersion,
    rule,
  ]),
});
