import {describe, it, expect, beforeEach} from 'bun:test';
import {State} from '../src/state';

describe('iocdi - State', function () {
  let state: State;
  beforeEach(function () {
    state = new State();
  });

  it('should clear the default container', function () {
    state.setDependency('a', 1);
    state.clearContainer();

    expect(state.resolveDependency('a')).toBeUndefined();
  });

  it('should set and resolve a dependency in default container', function () {
    state.setDependency('dep', 42);
    expect(state.resolveDependency<number>('dep')).toBe(42);
  });

  it('should set and resolve a dependency in a named container', function () {
    state.setDependency('dep', 'bar', 'foo');
    expect(state.resolveDependency<string>('dep', 'foo')).toBe('bar');
  });

  it('should use override container in async context', async function () {
    state.setDependency('dep', 'asyncValue', 'async');
    state.setOverrideContainer('async');

    const value = state.resolveDependency<string>('dep');
    expect(value).toBe('asyncValue');

    state.clearOverrideContainer();
  });

  it('should fallback to default container if override not found', function () {
    state.setDependency('dep', 123);
    state.setOverrideContainer('notfound');

    expect(state.resolveDependency<number>('dep')).toBe(123);

    state.clearOverrideContainer();
  });

  it('should resolve all dependencies from all containers', function () {
    state.setDependency('a', 1);
    state.setDependency('b', 2, 'foo');

    state.setOverrideContainer('foo');

    const all = state.resolveAllDependencies();

    expect(all['a']).toBe(1);
    expect(all['b']).toBe(2);
  });

  it('should clear a dependency from a specific container', function () {
    state.setDependency('x', 1, 'foo');
    state.clearDependency('x', 'foo');

    expect(state.resolveDependency('x', 'foo')).toBeUndefined();
  });

  it('should clear a dependency from all containers', function () {
    state.setDependency('y', 2);
    state.setDependency('y', 3, 'foo');
    state.clearDependency('y');

    expect(state.resolveDependency('y')).toBeUndefined();
    expect(state.resolveDependency('y', 'foo')).toBeUndefined();
  });

  it('should allow set to function in fluent manner', function () {
    state.setDependency('z', 99).setDependency('a', 100, 'foo');

    expect(state.resolveDependency<number>('z')).toBe(99);
    expect(state.resolveDependency<number>('a', 'foo')).toBe(100);
  });
});
