export class Container {
  id: string;
  private data: {[key: string | symbol]: any};

  constructor(id: string) {
    this.id = id;
    this.data = {};
  }

  set<T>(name: string | symbol, value: T) {
    this.data[name] = value;
  }

  resolve<T>(name: string | symbol) {
    const value = this.data[name];

    return value ? (value as T) : undefined;
  }

  clear(name: string | symbol) {
    delete this.data[name];
  }

  clearAll() {
    this.data = {};
  }

  keys() {
    return Object.keys(this.data);
  }
}
