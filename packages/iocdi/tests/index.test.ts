import {describe, it, expect, beforeEach} from 'bun:test';
import {
  setDependency,
  resolveDependency,
  clearDependency,
  clearContainer,
  setDefaultContainer,
  getDefaultContainerId,
  clearOverrideContainer,
  resolveAllDependencies,
  InjectIn,
} from '../src/index';

describe('iocdi - API', function () {
  beforeEach(function () {
    clearContainer('default');
    clearOverrideContainer();
  });

  it('should set and resolve a dependency in default container', function () {
    setDependency('dep', 42);

    expect(resolveDependency<number>('dep')).toBe(42);
  });

  it('should set and resolve a dependency in a named container', function () {
    setDependency('dep', 'bar', 'foo');

    expect(resolveDependency<string>('dep', 'foo')).toBe('bar');
  });

  it('should clear a dependency from a specific container', function () {
    setDependency('x', 1, 'foo');
    clearDependency('x', 'foo');

    expect(resolveDependency('x', 'foo')).toBeUndefined();
  });

  it('should clear a dependency from all containers', function () {
    setDependency('y', 2);
    setDependency('y', 3, 'foo');
    clearDependency('y');

    expect(resolveDependency('y')).toBeUndefined();
    expect(resolveDependency('y', 'foo')).toBeUndefined();
  });

  it('should clear the default container', function () {
    setDependency('a', 1);
    clearContainer('default');

    expect(resolveDependency('a')).toBeUndefined();
  });

  it('should set and get override container id', function () {
    setDefaultContainer('foo');
    expect(getDefaultContainerId()).toBe('foo');
  });

  it('should resolve all dependencies from all containers', function () {
    setDependency('a', 1);
    setDependency('b', 2, 'foo');

    setDefaultContainer('foo');

    const all = resolveAllDependencies(['default', 'foo']);
    expect(all['a']).toBe(1);
    expect(all['b']).toBe(2);
  });

  it('should allow setDependency to be used in a fluent manner', function () {
    setDependency('z', 99).setDependency('a', 100, 'foo');

    expect(resolveDependency<number>('z')).toBe(99);
    expect(resolveDependency<number>('a', 'foo')).toBe(100);
  });

  it('should wrap a callback with InjectIn and inject dependencies', function () {
    setDependency('foo', 123);
    const cb = function (deps: {foo: number}) {
      return deps.foo;
    };

    const wrapped = InjectIn(cb);
    expect(wrapped()).toBe(123);
  });

  it('should wrap a callback with InjectIn and allow custom callbackName', function () {
    const cb = function () {
      return 1;
    };

    const wrapped = InjectIn(cb, {callbackName: 'customName'});
    expect(wrapped.name).toBe('customName');
  });
});
