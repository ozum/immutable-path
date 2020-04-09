import { Source, Key } from "./types";
import _has from "./has";

/**
 * Deletes immutably given key/index from object/array/Map. Original value is not changed.
 *
 * @ignore
 * @param source is the source object/array/Map.
 * @param key is the key to delete.
 * @returns new object/array/Map.
 */
export default function _unset<S extends Source, K extends Key<S>>(source: S, key: K): S | Partial<S> {
  if (!_has(source, key)) return source;
  if (source instanceof Map) {
    const newSource = new Map(source);
    newSource.delete(key);
    return newSource as S;
  }
  if (Array.isArray(source)) {
    const index = Number(key);
    return [...source.slice(0, index), ...source.slice(index + 1)] as S;
  }
  const { [key]: deleted, ...newSource } = source; // eslint-disable-line @typescript-eslint/no-unused-vars
  return newSource as Partial<S>;
}
