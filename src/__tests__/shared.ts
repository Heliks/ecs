import BaseSystem from '../base-system';
import Bootable from '../bootable';
import EntityManager from "../entity-manager";

export class TestComp1 { a?: number; }
export class TestComp2 { b?: number; }
export class TestComp3 { c?: number; }
export class TestComp4 { d?: number; }

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


