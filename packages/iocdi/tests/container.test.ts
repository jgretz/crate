import {describe, it, expect, beforeAll} from 'bun:test';
import {Container} from '../src/container';

describe('iocdi - Container', function () {
  let c: Container;
  beforeAll(function () {
    c = new Container('test');
  });

  it('should instantiate with an id', function () {
    expect(c).toBeInstanceOf(Container);
    expect(c.id).toBe('test');
  });

  it('should set and resolve a value by string key', function () {
    c.set('foo', 123);
    expect(c.resolve<number>('foo')).toBe(123);
  });

  it('should set and resolve a value by symbol key', function () {
    const sym = Symbol('bar');
    c.set(sym, 'baz');
    expect(c.resolve<string>(sym)).toBe('baz');
  });

  it('should return undefined for missing key', function () {
    expect(c.resolve('missing')).toBeUndefined();
  });

  it('should return all string keys with keys()', function () {
    c.set('a', 1);
    c.set('b', 2);

    const keys = c.keys();

    expect(keys).toContain('a');
    expect(keys).toContain('b');
  });

  it('should not include symbol keys in keys()', function () {
    const sym = Symbol('s');
    c.set(sym, 42);

    expect(c.keys()).not.toContain(sym.toString());
  });

  it('should clear a specific key', function () {
    c.set('clearMe', 99);
    c.clear('clearMe');

    expect(c.resolve('clearMe')).toBeUndefined();
  });

  it('should clear all keys', function () {
    c.set('x', 1);
    c.set('y', 2);
    c.clearAll();

    expect(c.keys().length).toBe(0);
    expect(c.resolve('x')).toBeUndefined();
    expect(c.resolve('y')).toBeUndefined();
  });
});
