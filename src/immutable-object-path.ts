import { Source, Path, Options, UnsetOptions } from "./util/types";
import _get from "./util/get";
import _set from "./util/set";
import _unset from "./util/unset";
import _has from "./util/has";
import { getPath, getAddressableValue, isEmpty, defaultAtomicClasses } from "./util/helper";

/**
 * Sets the property value of path on object/array/Map immutably without changing input. If a portion of path does not exist it's created.
 * Provided `atomicClasses` is used to determine which type of objects are treated as atomic. Atomic classes are
 * treated like primitives pretending they don't have attributes. See example below. If `preferMap` is true,
 * when new objects are needed, they are created as `Map` instead of object.
 *
 * @param source is the object/array/map to set.
 * @param path is the path of the property to set.
 * @param value is the value to set.
 * @param __namedParameters are options.
 * @returns new object/array/Map.
 * @example
 * const a = set({ x: new Date() }, "x.y", 3); // 3 is not assigned to atomic class Date. Insted it is replaced: { x: { y: 3 } }
 * const b = set({ x: { z: 1 } }, "x.y", 3); // 3 is not assigned to `x.y`: { x: { y: 3, z: 1 } }
 * const c = set({ }, "x.y", 3); // 3 is not assigned to `x.y`: { x: { y: 3 } }
 * const c = set({ }, "x.y", 3, { preferMap: true }); // Map([[x, new Map([[y, 3]])]]);
 */
export function set<S extends Source>(
  source: S,
  path: Path,
  value: any,
  {
    /** Atomic classes are treated like a scalar, because MOST PROBABLY user did not intend to update a property of it. Instead they want to replace it. */
    atomicClasses = defaultAtomicClasses,
    /** If an attribute for a non-existing object should be created, whether to create a `Map` instead of `object`. */
    preferMap = false,
  }: Options = {},
  root: any = source
): any {
  const options = { atomicClasses, preferMap };
  const [key, ...remainingPath] = getPath<S>(path);
  const oldValueOfKey = getAddressableValue(source, key, options, remainingPath[0]);
  const newValueOfKey = remainingPath.length > 0 ? set(oldValueOfKey, remainingPath, value, options, root) : value;
  return _set(source, key, newValueOfKey, root);
}

/**
 * Removes the property at path of object and returns it. Does not change input value.
 *
 * @param source is the object/array/map to unset a value.
 * @param path is the path of the property to unset.
 * @param __namedParameters are options.
 * @returns new object/array/Map.
 */
export function unset<S extends Source>(
  source: S,
  path: Path,
  {
    /** Atomic classes are treated like a scalar, because MOST PROBABLY user did not intend to update a property of it. Instead they want to replace it. */
    atomicClasses = defaultAtomicClasses,
    /** After unsetting a key/index if object/array/Map becomes empty, it is also unset in parent. */
    unsetEmpty = true,
    /** If an attribute for a non-existing object should be created, whether to create a `Map` instead of `object`. */
    preferMap = false,
  }: UnsetOptions = {}
): any {
  const options = { atomicClasses, unsetEmpty, preferMap };
  const [key, ...remainingPath] = getPath<S>(path);
  const addressableValue = getAddressableValue(source, key, options);

  if (remainingPath.length > 0) {
    if (addressableValue) {
      const unsetValue = unset(addressableValue, remainingPath, options);
      const unsetFurther = unsetEmpty && isEmpty(unsetValue, atomicClasses);
      if (!unsetFurther) return _set(source, key, unsetValue);
    } else {
      return source;
    }
  }

  return _unset(source, key);
}

/**
 * Gets the property value at path of object/array/Map. If the resolved value is undefined the defaultValue is used in its place.
 *
 * @param source is the object/array/map to query.
 * @param path is the path of the property to get.
 * @param defaultValue is the value returned if the resolved value is `undefined`.
 * @returns the resolved value.
 */
export function get<S extends Source>(source: S, path: Path, defaultValue?: any): any {
  let result: any = source;
  // eslint-disable-next-line no-restricted-syntax
  for (const key of getPath<any>(path as any)) {
    result = _get(result, key as any);
    if (result === undefined) return defaultValue;
  }
  return result;
}

/**
 * Checks if path is a direct property of object/array/Map.
 *
 * @param source is the object/array/Map to query.
 * @param path is the path to check.
 * @returns whether path is a direct property of object/array/Map.
 */
export function has<S extends Source>(source: S, path: Path): any {
  let current: any = source;
  // eslint-disable-next-line no-restricted-syntax
  for (const key of getPath<S>(path)) {
    if (!_has(current, key)) return false;
    current = _get(current, key as any);
  }
  return true;
}
