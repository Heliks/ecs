Data oriented [Entity Component System](https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system)

## Installation

Create build:

```
$ npm run build
```

Run unit tests:

```
$ npm test
```

## Example 

#### Setup

```typescript
import { World } from '@tiles/entity-system';

const world = new World();

/** Game Loop */
function update(delta: number): void {
    // move the entity world forward in time
    world.update(delta);
    
    // request next animation frame
    window.requestAnimationFrame(update);
}

// start the game loop
update();
```

#### Creating entities

```typescript
const entity = world.create();
```

#### Adding components

```typescript
class PositionComponent {
    public x: number = 0;
    public y: number = 0;
}

class DirectionComponent {
    direction: 'left' | 'right' | 'top' | 'bottom' = 'top';
}

world.addComponent(entity, PositionComponent);
world.addComponent(entity, DirectionComponent);

console.log(world.getComponent(entity, PositionComponent).x) // 0
console.log(world.getComponent(entity, DirectionComponent).direction) // left
```

If you have a component that requires constructor parameters you can spread them on ``addComponent()``:

```
class NameComponent {
    constructor(public first: string, public last: string) {}
}

const name = world.addComponent(entity, NameComponent, 'foo', 'bar');

console.log(name.first) // 'foo'
console.log(name.last) // 'bar'
```


#### Adding a system

Systems can be added at any point during runtime. If a system is ``Bootable`` it will also be booted. 

```typescript
class TestSystem extends EntitySystem {
    ...
}

world.addSystem(new TestSystem());
```

Note: Systems that pool entities are empty until they were booted and synchronized at least once.


##### EntitySystem

Pools entities. This serves mostly as a base system for systems like ``ProcessingSystem`` that deal with entities. EntitySystems and all sub systems must provide an ``EntityQuery`` for pooling their entities. This can either be done with the ``@EntityPool`` decorator or as constructor parameter for the ``EntitySystem`` itself.

Decorated system:

```typescript
@EntityQuery({
    contains: [ TestComp1, TestComp2 ],
    excludes: [ TestComp3 ]
})
class TestSystem extends EntitySystem {
    
    run() {
        const pool = this.getPool();
    }
    
}
```

Constructor parameter

```typescript
const system = new EntitySystem({
    contains: [ FooComponent ]
});

console.log(system.getPool());
```



##### ProcessingSystem

Pools entities and iterates over all of them on each frame. This is a sub-System of ``EntitySystem`` and must therefore specify an ``EntityQuery``.

```typescript
@EntityQuery({
    contains: [ TestComp1, TestComp2 ],
    excludes: [ TestComp3 ]
})
class TestSystem extends EntitySystem {
    
    // iterates over all entities that are contained in this systems entity pool
    process(entity: Entity): void {
        console.log(entity);
    }
    
}
```

##### ComponentSystem

Iterates over all instances of a ``ComponentType``

```
class TestSystem extends ComponentSystem {

    constructor() {
        super(TestComp1);
    }
    
    process(component: TestComp1): void {
        // called for every instance of TestComp1
    }
    
}
```