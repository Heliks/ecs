import BaseSystem from './base-system';

type SystemType<T extends BaseSystem = BaseSystem> = new (...params: any[]) => T;

export default SystemType;

