import { ComponentRegistry } from '../component-registry';


describe('ComponentRegistry', () => {
  describe('when registering components', () => {
    let registry: ComponentRegistry;

    beforeEach(() => {
      registry = new ComponentRegistry();
    });

    it('should generate a bit as component ID', () => {
      const ids = [
        registry.register(class A {}),
        registry.register(class B {}),
        registry.register(class C {}),
        registry.register(class D {})
      ];

      expect(ids).toEqual([ 0, 1, 2, 3 ]);
    });

    it('should re-use IDs for already registered types', () => {
      class A {}

      registry.register(A);

      const id = registry.register(A);

      expect(id).toBe(1);
    });
  });
});
