import BaseSystem from '../base-system';
import Bootable from '../bootable';
import EntityManager from "../entity-manager";

export class TestComp1 {}
export class TestComp2 {}
export class TestComp3 {}
export class TestComp4 {}

export const em = new EntityManager();

export class TestSystem extends BaseSystem implements Bootable {

    public booted: boolean = false;
    public prop = 'test';

    constructor() {
        super();
    }

    boot() {
        this.booted = true;
    }

    run() {
        //#
    }

}


