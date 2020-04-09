import { Key, Source } from "./types";

/**
 * Returns value of given key index from object/array/Map.
 *
 * @ignore
 * @param source is the source to get value from.
 * @param key is the key/index to get value of.
 * @param defaultValue is the default value to return if result is undefined.
 * @returns value of key.
 */
export default function _get<S extends Source, K extends Key<S>>(source: S, key: K, defaultValue?: S[K]): S[K] {
  const result = source instanceof Map ? source.get(key) : source[key];
  return result === undefined ? defaultValue : result;
}
