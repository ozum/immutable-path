import { Source, Key, SetFunction } from "./types";
import _has from "./has";
import _get from "./get";
import { doesLookLikeArrayIndex } from "./helper";

/**
 * If value is a function, executes it and returns it's result. Otherwise returns value.
 *
 * @ignore
 * @param root is the root object. Root is provided to given function.
 * @param source is the object index/key is in. Source is provided to given function.
 * @param key is the index/key to be set. Key is provided to given function.
 * @param oldValue is current value of index/key. Old value is provided to given function.
 * @param newValue is the new value or function to be executed.
 * @returns value to be set.
 */
function getValue<S extends Source, K extends Key<S>>(
  root: any,
  source: S,
  key: K,
  oldValue: S[K],
  newValue: S[K] | SetFunction<S, K>
): S[K] {
  return typeof newValue === "function" ? newValue(oldValue, key, source, root) : newValue;
}

/**
 * (Immutable) Sets value of given key/index of object/array/Map. Does not change original object/array/Map.
 * Returns new value.
 *
 * @ignore
 * @param source is the array/object/Map to update.
 * @param key is the key/index to change value of.
 * @param value is the value to set.
 * @returns new object/array/Map.
 */
export default function _set<S extends Source, K extends Key<S>>(source: S, key: K, value: S[K], root?: any): S {
  const currentValue = _get(source, key);
  if (_has(source, key) && currentValue === value) return source;
  if (source instanceof Map) return new Map(source).set(key, getValue(root, source, key, currentValue, value)) as S;
  if (Array.isArray(source) && !doesLookLikeArrayIndex(key) && typeof key !== "function") return source;
  const newSource = Object.assign(Array.isArray(source) ? [] : {}, source);
  newSource[key] = getValue(root, source, key, currentValue, value);
  return newSource;
}
