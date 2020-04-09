import { Source, Key } from "./types";

/**
 * Returns whether given key/index exists in given object/array/Map exists.
 * Returns true even for `undefined` values if key/index exists.
 *
 * @ignore
 * @param source is the source get value from.
 * @param key is the key/index get value of.
 * @returns value of given index/key.
 */
export default function _has<S extends Source, K extends Key<S>>(source: S, key: K): boolean {
  return source instanceof Map ? source.has(key) : Object.prototype.hasOwnProperty.call(source, key);
}
