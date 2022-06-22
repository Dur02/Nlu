import { schema } from 'relient/reducers';

export const user = new schema.Entity('user');
export const role = new schema.Entity('role');
export const resource = new schema.Entity('resource');
export const auditResourceType = new schema.Entity('auditResourceType', {}, { idAttribute: 'resourceType' });
export const auditLog = new schema.Entity('auditLog');
export const product = new schema.Entity('product');
export const output = new schema.Entity('output');
export const intent = new schema.Entity('intent');
export const rule = new schema.Entity('rule');
export const builtinIntent = new schema.Entity('builtinIntent');
export const words = new schema.Entity('words');
export const productVersion = new schema.Entity('productVersion');
export const skillVersion = new schema.Entity('skillVersion');
