import { ClassType, DefferedComponent, Entity, Struct } from '../types';
import { World } from '../world';


describe('Builder', () => {

    class A {
        test?: string;
    }

    class B {
        test?: string;
    }

    interface Builder {
        add<T>(component: ClassType<T>, data?: Partial<T>): this;

        build(): Entity;
    }

    class EntityBuilder {

        protected components: DefferedComponent[] = [];

        constructor(protected world: World) {}

        add<T>(component: ClassType<T>, data?: Partial<T>): this {
            this.components.push({
                component,
                data
            });

            return this;
        }

        build(): Entity {
            const entity = Symbol();
            const world = this.world;

            for (const item of this.components) {
                world.storage(item.component).add(entity, item.data);
            }

            world.addEntity(entity);

            return entity;
        }

    }

    it('', () => {
        const world = new World();

        const build = new Builder(world)
            .add(A, { test: 'foo' })
            .add(B, { test: 'bar' });


    });



});
