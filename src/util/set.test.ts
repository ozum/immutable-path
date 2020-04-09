import set from "./set";
import mapFrom from "./map-from";

const object: Record<string, number> = { a: 1 };
const map = mapFrom(object);

describe("set()", () => {
  it("should update value of object key.", () => {
    expect(set(object, "a", 2)).toEqual({ a: 2 });
  });

  it("should add new object key.", () => {
    expect(set(object, "b", 2)).toEqual({ a: 1, b: 2 });
  });

  it("should return new object.", () => {
    expect(set(object, "b", 2)).not.toEqual(object);
  });

  it("should return same object if new value is equal to old one.", () => {
    expect(set(object, "a", 1)).toBe(object);
  });

  it("should update value of element.", () => {
    expect(set([5, 6], 0, 1)).toEqual([1, 6]);
  });

  it("should add new element to array.", () => {
    expect(set([5, 6], 3, 1)).toEqual([5, 6, undefined, 1]);
  });

  it("should not update array if index is a string.", () => {
    expect(set([5, 6], "a" as any, 1)).toEqual([5, 6]);
  });

  it("should update value of map key.", () => {
    expect(set(map, "a", 2)).toEqual(mapFrom({ a: 2 }));
  });

  it("should add new map key.", () => {
    expect(set(map, "b", 2)).toEqual(mapFrom({ a: 1, b: 2 }));
  });

  it("should return new map.", () => {
    expect(set(map, "b", 2)).not.toEqual(map);
  });
});
