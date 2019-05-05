import EntityManager from "./entity-manager";

export default interface Bootable {

    /** Called once when a bootable system is added to the world. */
    boot(entityManager: EntityManager): void;

    /** Called right after ``boot()`` */
    onBoot?(): void;

}