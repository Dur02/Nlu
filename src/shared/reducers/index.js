import { combineReducers } from 'redux';
import { createReducer } from 'relient/reducers';
import auth from './auth';
import product from './product';
import words from './words';
import output from './output';
import user from './user';
import intent from './intent';
import builtinIntent from './builtin-intent';
import productVersion from './product-version';
import skillVersion from './skill-version';
import rule from './rule';
import role from './role';
import resource from './resource';
import auditResourceType from './audit-resource-type';
import auditLog from './audit-log';

export default combineReducers({
  ...createReducer([
    auth,
    product,
    words,
    output,
    user,
    intent,
    builtinIntent,
    productVersion,
    skillVersion,
    rule,
    role,
    resource,
    auditLog,
    auditResourceType,
  ]),
});
