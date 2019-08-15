import 'reflect-metadata';
import { EntityManager } from '../entity-manager';

export class TestComp1 { a?: number; }
export class TestComp2 { b?: number; }
export class TestComp3 { c?: number; }
export class TestComp4 { d?: number; }

export class FooBar {
    public readonly foo: string = 'foo';
    public readonly bar: string = 'bar';
}

export const em = new EntityManager();

export function createEntityManager(): EntityManager {
    const entityManager = new EntityManager();

    for (let i = 0; i < 10; i++) {
        entityManager.create([ TestComp1 ]);
        entityManager.create([ TestComp2 ]);
    }

    return entityManager;
}