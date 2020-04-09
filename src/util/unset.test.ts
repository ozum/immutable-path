import unset from "./unset";
import mapFrom from "./map-from";

const object: Record<string, number> = { a: 1 };
const map = mapFrom(object);
const array = [5, 6];

describe("ununset()", () => {
  it("should unset object key.", () => {
    expect(unset(object, "a")).toEqual({});
  });

  it("should unset non existing object key.", () => {
    expect(unset(object, "b")).toEqual({ a: 1 });
  });

  it("should return new object.", () => {
    expect(unset(object, "a")).not.toEqual(object);
  });

  it("should return same object if key does not exist.", () => {
    expect(unset(object, "b")).toBe(object);
  });

  it("should unset array element.", () => {
    expect(unset(array, 0)).toEqual([6]);
  });

  it("should unset array element whne index given as string.", () => {
    expect(unset(array, "0" as any)).toEqual([6]);
  });

  it("should unset non existing array element.", () => {
    expect(unset(array, 3)).toEqual(array);
  });

  it("should unset map key.", () => {
    expect(unset(map, "a")).toEqual(new Map());
  });

  it("should unset non existing map key.", () => {
    expect(unset(map, "b")).toEqual(map);
  });

  it("should return new map.", () => {
    expect(unset(map, "a")).not.toEqual(map);
  });

  it("should ignore string index access to array.", () => {
    expect(unset(array, "a" as any)).toEqual(array);
  });
});
