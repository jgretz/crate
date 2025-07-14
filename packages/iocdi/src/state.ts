import {AsyncLocalStorage} from 'async_hooks';
import {Container} from './container.js';

const DEFAULT_CONTAINER_ID = 'default';

export class State {
  private containers: {[key: string]: Container} = {};
  private asyncLocalStorage = new AsyncLocalStorage<string>();

  constructor() {
    this.containers[DEFAULT_CONTAINER_ID] = new Container(DEFAULT_CONTAINER_ID);
  }

  // Container Management
  private getContainer(id?: string): Container {
    if (!id) {
      return this.containers[DEFAULT_CONTAINER_ID]!;
    }

    if (!this.containers[id]) {
      this.containers[id] = new Container(id);
    }

    return this.containers[id];
  }

  clearContainer(id?: string) {
    if (!id || id === DEFAULT_CONTAINER_ID) {
      this.containers[DEFAULT_CONTAINER_ID]?.clearAll();
      return;
    }

    delete this.containers[id];
  }

  // Override Container Management
  setOverrideContainer(id: string) {
    this.asyncLocalStorage.enterWith(id);
  }

  getOverrideContainerId() {
    return this.asyncLocalStorage.getStore();
  }

  clearOverrideContainer() {
    this.asyncLocalStorage.disable();
  }

  // Dependency Management
  setDependency<T>(name: string | symbol, value: T, containerId?: string) {
    const container = this.getContainer(containerId);
    container.set(name, value);

    return this;
  }

  resolveDependency<T>(name: string | symbol, containerId?: string) {
    // direct ask
    if (containerId) {
      return this.getContainer(containerId).resolve<T>(name);
    }

    // if no containerId provided, check for overridden container in async context
    const asyncContainerId = this.getOverrideContainerId();
    if (asyncContainerId) {
      const value = this.getContainer(asyncContainerId).resolve<T>(name);
      if (value !== undefined) {
        return value;
      }
    }

    // fallback to default container
    return this.getContainer(DEFAULT_CONTAINER_ID).resolve<T>(name);
  }

  resolveAllDependencies<T>({
    containerIds,
    includeDefault,
  }: {containerIds?: string[]; includeDefault?: boolean} = {}) {
    // union all keys from specified containers
    const allKeys = Object.keys(this.containers).reduce((acc, containerId) => {
      if (
        containerIds &&
        !containerIds.includes(containerId) &&
        !(includeDefault && containerId === DEFAULT_CONTAINER_ID)
      ) {
        return acc;
      }

      return acc.union(new Set(this.getContainer(containerId).keys()));
    }, new Set<string>());

    // resolve all dependencies for each key
    const resolvedArgs: {[key: string]: any} = {};
    allKeys.forEach((key) => {
      resolvedArgs[key] = this.resolveDependency(key);
    });

    return resolvedArgs;
  }

  clearDependency(name: string | symbol, containerId?: string) {
    // if containerId provided, clear just that container
    if (containerId) {
      const container = this.getContainer(containerId);
      container.set(name, undefined);
      return;
    }

    // otherwise clear from all containers
    Object.values(this.containers).forEach((container) => {
      container.clear(name);
    });
  }
}
