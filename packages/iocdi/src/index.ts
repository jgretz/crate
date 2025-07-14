import {State} from './state';
import type {Callback, IsFunction, IsFunctionForReturnType} from './Types';

declare global {
  var STATE: State | undefined;
}

function getState() {
  if (global.STATE) {
    return global.STATE;
  }
  global.STATE = new State();

  return global.STATE;
}

// these exported functions are the public API to provide access to the global instance
export function getDefaultContainerId() {
  return getState().getOverrideContainerId();
}

export function setDefaultContainer(containerId: string) {
  getState().setOverrideContainer(containerId);
}

export function clearOverrideContainer() {
  getState().clearOverrideContainer();
}

export function resolveAllDependencies(containerIds?: string[]) {
  return getState().resolveAllDependencies({containerIds, includeDefault: true});
}

export function resolveDependency<T>(name: string | symbol, containerId?: string) {
  return getState().resolveDependency<T>(name, containerId);
}

export function setDependency(name: string | symbol, value: any, containerId?: string) {
  return getState().setDependency(name, value, containerId);
}

export function clearDependency(name: string | symbol, containerId?: string) {
  return getState().clearDependency(name, containerId);
}

export function clearContainer(containerId: string) {
  return getState().clearContainer(containerId);
}

export function InjectIn<T extends Callback<any>>(
  callback: T,
  options?: {
    containers?: string[];
    callbackName?: string;
  },
): (...args: IsFunction<T>) => IsFunctionForReturnType<T> {
  const wrappedCallback = (...args: IsFunction<T>): IsFunctionForReturnType<T> => {
    const resolvedArgs = getState().resolveAllDependencies({
      containerIds: options?.containers,
      includeDefault: true,
    });

    const result = callback(...[resolvedArgs]);
    if (typeof result === 'function') {
      return result(...args);
    }

    return result;
  };

  // debuggable name
  const callbackName = options?.callbackName ?? `${callback.name}_iocdi`;
  Object.defineProperty(wrappedCallback, 'name', {
    value: callbackName,
    writable: false,
  });

  return wrappedCallback;
}
