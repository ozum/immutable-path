import has from "./has";
import mapFrom from "./map-from";

const object: Record<string, number> = { a: 1 };
const map = mapFrom(object);

describe("has()", () => {
  it("should return true when object has key.", () => {
    expect(has(object, "a")).toBe(true);
  });

  it("should return true when object doesn't have key.", () => {
    expect(has(object, "b" as any)).toBe(false);
  });

  it("should return true when object have key with value of undefined.", () => {
    expect(has({ a: 1, b: undefined }, "b")).toBe(true);
  });

  it("should return true when array has index.", () => {
    expect(has([0], 0)).toBe(true);
  });

  it("should return true when array doesn't have index.", () => {
    expect(has([0], 1)).toBe(false);
  });

  it("should return true when array have index with value of undefined.", () => {
    expect(has([0, undefined], 1)).toBe(true);
  });

  it("should return true when map has key.", () => {
    expect(has(map, "a")).toBe(true);
  });

  it("should return true when map doesn't have key.", () => {
    expect(has(map, "b" as any)).toBe(false);
  });

  it("should return true when map have key with value of undefined.", () => {
    expect(has(mapFrom({ a: 1, b: undefined }), "b")).toBe(true);
  });
});
