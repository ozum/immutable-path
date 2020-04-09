import { isEmpty } from "./helper";

describe("isEmpty()", () => {
  it("should return false for primitive values", () => {
    expect(isEmpty(1, [])).toBe(false);
  });
});
