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
import skillPermission from './skill-permission';
import intervention from './intervention';
import testCase from './test-case';
import testSuite from './test-suite';
import testJob from './test-job';
import testJobResult from './test-job-result';
import intentMap from './intent-map';
import intentMapInfo from './intent-map-info';
import information from './information';

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
    skillPermission,
    intervention,
    testCase,
    testSuite,
    testJob,
    testJobResult,
    intentMap,
    intentMapInfo,
    information,
  ]),
});
