import get from "./get";
import map from "./map-from";

describe("get()", () => {
  it("should get value of object key.", () => {
    expect(get({ a: 1 }, "a")).toBe(1);
  });

  it("should get default value if it is undefined.", () => {
    expect(get({ a: 1, b: undefined }, "b" as any, 9)).toBe(9);
  });

  it("should get default value if it does not exists.", () => {
    expect(get({ a: 1 }, "b" as any, 9)).toBe(9);
  });

  it("should get value of array index.", () => {
    expect(get(["a"], 0)).toBe("a");
  });

  it("should get value of array index given as string.", () => {
    expect(get(["a", "b"], "1" as any)).toBe("b");
  });

  it("should get value of map key.", () => {
    expect(get(map({ a: 1 }), "a")).toBe(1);
  });
});
