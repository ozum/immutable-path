import { Options } from "../index";
import { Key, Source, Path, Class } from "./types";
import has from "./has";
import get from "./get";

/** List of default atomic classes. */
export const defaultAtomicClasses: Class[] = [Date, RegExp];

/**
 * Returns whether given value is an atomic value.
 *
 * @ignore
 * @param value to be tested.
 * @param atomicClasses are list of atomic classes.
 * @returns whether given value is atomic.
 */
export function isAtomic(value: any, atomicClasses: Class[]): boolean {
  return typeof value !== "object" || value === null || atomicClasses.some(baseClass => value instanceof baseClass);
}

/**
 * Returns wheter given object/array/Map is empty (has zero element).
 *
 * @ignore
 * @param value is object/array/Map to check.
 * @param atomicClasses are array of atomic classes.
 * @returns whether given value is empty.
 */
export function isEmpty(value: any, atomicClasses: Class[]): boolean {
  if (value instanceof Map) return value.size === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (!isAtomic(value, atomicClasses)) return Object.keys(value).length === 0;
  return false;
}

/**
 * Returns whether given value looks like an array index.
 *
 * @ignore
 * @param key is the key/index to check.
 * @returns whether given value looks like an array index.
 */
export function doesLookLikeArrayIndex(key: any): boolean {
  return Number.isInteger(Number(key));
}

/**
 * Returns an further addressable value (object/array/Map) of requested key/index from object/array/Map. If `nextKey` is provided
 * and value is not addressable, returns compatible addressable empty value by looking `nextKey`. For example if next key is a number, returns
 * an ampty array.
 *
 * @ignore
 * @param source
 * @param key
 * @param options
 * @param nextKey
 * @example
 * const source = { x: { k: 2 }, y: 9 }
 * const a = getOrGenerateValue(source, "x", opt, "k"); // { y: 2 } -> x has an addressable next key "k", return value of x.
 * const b = getOrGenerateValue(source, "x", opt, 0;    // []       -> x is not an array, but next index 0 will require an array, return empty array.
 * const c = getOrGenerateValue(source, "x", opt, "u"); // {}       -> x does not have object key "u", next key "u" will request an object, return empty object.
 * const d = getOrGenerateValue(source, 0, opt);      // []         -> x does not have array index 0, undefined.
 * const e = getOrGenerateValue(source, "k", opt);      // {}       -> x does not have object key "", undefined.
 */
export function getAddressableValue<S extends Source, K extends Key<S>>(
  source: S,
  key: K,
  options: Required<Options>,
  nextKey?: string | number
): any {
  // TODO uyumsuz key verilirse throw etmeyi düşün.
  if (has(source, key)) {
    const value = get(source, key);
    if (!isAtomic(value, options.atomicClasses)) return value;
  }
  if (!nextKey) return undefined;
  if (doesLookLikeArrayIndex(nextKey)) return [];
  return options.preferMap ? new Map() : {};
}

/**
 * Converts string (dot notaion) path into array path by splitting by `.`. If path is array returns it.
 *
 * @ignore
 * @param path is the path to convert.
 * @returns converted path.
 */
export function getPath<S extends Source>(path: Path): [Key<S>, string | number] {
  return (Array.isArray(path) ? path : path.toString().split(".")) as any;
}
