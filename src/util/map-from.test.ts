import mapFrom from "./map-from";

describe("mapFrom()", () => {
  it("should create map from given object", () => {
    expect(mapFrom({ a: 1 })).toEqual(new Map([["a", 1]]));
  });
});
