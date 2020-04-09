/**
 * Returns a map constructed from given object.
 *
 * @ignore
 * @param object is the object to create `Map` from.
 * @returns `Map` created from object.
 */
export default function mapFrom<K extends string | number | symbol, V>(object: Record<K, V>): Map<K, V> {
  return new Map(Object.entries(object) as any);
}
