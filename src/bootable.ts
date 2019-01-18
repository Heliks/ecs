import EntityManager from "./entity-manager";

export default interface Bootable {

    /**
     * Called once when the bootable is booted
     *
     * @param {EntityManager} entityManager
     */
    boot(entityManager: EntityManager): void;

}