import 'reflect-metadata';
import { injectComponentMapperDecorator } from './decorators';

export { default as ComponentManager } from './component-manager';
export { default as EntityManager } from './entity-manager';
export { default as EntityPool } from './entity-pool';
export { default as Filter } from './filter';
export { default as World } from './world';
export * from './systems';
export * from './types';

export const InjectComponentMapper = injectComponentMapperDecorator;
