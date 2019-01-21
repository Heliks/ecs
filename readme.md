Data oriented [Entity Component System](https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system)

## Installation

Create build:

```
$ npm build
```

Run integration tests:

```
$ npm test
```

## Example 

#### Setup

```
import { World } from '@tiles/entity-system';

const world = new World();

function update(delta: number): void {
    world.update(delta);
    window.requestAnimationFrame(update);
}

// start the game loop
update();
```

#### Creating entities

```
const entity = world.create();
```

#### Adding components

```
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


#### Adding a system

Systems can be added at any point during runtime. If a system is ``Bootable`` it will also be booted. 

```
class TestSystem extends EntitySystem {
    ...
}

world.addSystem(new TestSystem());
```

Note: Systems that pool entities are empty until they were booted and synchronized at least once.


##### EntitySystem
Pools entities matching the ``EntityQuery`` provided in the constructor. 

Example:

```
class TestSystem extends EntitySystem {

    constructor() {
        super({
            contains: [ TestComp1, TestComp2 ],
            excludes: [ TestComp3 ]
        });
    }
    
    run() {
        const pool = this.getPool();
    }
    
}
```

##### ProcessingSystem

Iterates over all entities matching the ``EntityQuery`` provided in the constructor.

```
class TestSystem extends EntitySystem {

    constructor() {
        super({
            contains: [ TestComp1, TestComp2 ],
            excludes: [ TestComp3 ]
        });
    }
    
    process(entity: Entity): void {
        // called for every entity that matches the query
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