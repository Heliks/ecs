export { default as ComponentManager } from './component-manager';
export { default as EntityManager } from './entity-manager';
export { default as EntitySystem } from './entity-system';
export { default as ProcessingSystem } from './processing-system';
export { default as World } from './world';


/*
class EntityManager {

    protected ids: symbol[] = [];



}


class EntityManager
{
    Array<unsigned char> _generation;
    Deque<unsigned> _free_indices;

    public:
        Entity create()
{
    unsigned idx;
    if (_free_indices.size() > MINIMUM_FREE_INDICES) {
        idx = _free_indices.front();
        _free_indices.pop_front();
    } else {
        _generation.push_back(0);
        idx = _generation.size() - 1;
        XENSURE(idx < (1 << ENTITY_INDEX_BITS));
    }
    return make_entity(idx, _generation[idx]);
}

    bool alive(Entity e) const
{
    return _generation[e.id()] == e.generation();
}

void destroy(Entity e)
{
    const unsigned idx = e.id();
    ++_generation[idx];
    _free_indices.push_back(idx);
}
};*/