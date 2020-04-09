export type Class = new (...args: any[]) => any;

export type Source = Array<any> | Map<any, any> | Record<any, any>;

export type Path = string | number | Array<string | number>;

export type KeyOfMap<M> = M extends Map<infer K, unknown> ? K : never;

/** @ignore */
export type ValueOfMap<M> = M extends Map<unknown, infer V> ? V : never;

/** Object key or arrau index. */
export type Key<S> = keyof S | KeyOfMap<S>;

/** @ignore */
export type Value<S, K extends Key<S>> = K extends keyof S ? S[K] : ValueOfMap<S>;

/** Options */
export interface Options {
  /**
   * If an attribute for a non-existing object should be created, whether to create a `Map` instead of `object`.
   */
  preferMap?: boolean;

  /**
   * Atomic classes are treated like a scalar, because MOST PROBABLY user did not intend to update a property of it. Instead they want to replace it.
   * @example
   * set([new Date()], "0.a", "x"); // => [{ a: "x" }] NOT [a Date with an attribute "x"]
   */
  atomicClasses?: Class[];
}

/** Unset options. */
export interface UnsetOptions extends Options {
  /** After unsetting a key/index if object/array/Map becomes empty, it is also unset in parent. */
  unsetEmpty?: boolean;
}

/**
 * Returned value from this function is used as new value to be set.
 */
export type SetFunction<S extends Source, K extends Key<S>> =
  /**
   * qefjewoıh
   * @param value is the current value of given key/index.
   * @param key is the current key/index of value to be replaced.
   * @param source is the object/array/Map which has the key/index.
   * @param root is the root object/array/Map.
   * @returns new value to be set.
   */
  (value: S[K], key: K, source: S, root: any) => S[K];
