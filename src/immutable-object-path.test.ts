import { get, set, unset, has, Options, UnsetOptions } from "./index";

const map = (object: Record<any, any>) => new Map(Object.entries(object) as any);

const date = new Date("2020-01-01 13:00:00");

class A {
  x: number;
  y: Record<string, number>;
  constructor({ x = 0, y = { y1: 0, y2: 0 } } = {}) {
    this.x = x;
    this.y = y;
  }
}

const data: { [key: string]: any } = {
  array: ["a0", "a1", "a2"],
  object: { a: 1, b: 2, c: 3 },
  o2: { o0: 0, o1: ["o10", { o111: 0, o112: [1, 2] }], o2: { o21: 0 }, o3: map({ o31: 0 }) },
  o3: { a: date },
  o4: { a: new A() },
  o5: { o0: 0, o1: [{ o111: 0 }] },
  class: new A(),
};

//
// ─── SET ────────────────────────────────────────────────────────────────────────
//

describe("set()", () => {
  const tests: { [key: string]: Array<[string, [any, any, Options?], any]> } = {
    array: [
      ["to numeric index.", [0, "x"], ["x", "a1", "a2"]],
      ["to numeric index using function.", [0, (v: any, i: number, s: any, r: any) => `${v}${i}${s[1]}${r[2]}`], ["a00a1a2", "a1", "a2"]],
      ["to string index.", ["0", "x"], ["x", "a1", "a2"]],
      ["object to scalar value.", ["0", { a: 1 }], [{ a: 1 }, "a1", "a2"]],
      ["to non-existing index + key.", ["3.a", "x"], ["a0", "a1", "a2", { a: "x" }]],
      ["to non-existing index + key (map).", ["3.a", "x", { preferMap: true }], ["a0", "a1", "a2", new Map([["a", "x"]])]],
      ["to non-existing index + index.", ["3.1", "x"], ["a0", "a1", "a2", [undefined, "x"]]],
      ["using string index without any effect", ["a", 1], ["a0", "a1", "a2"]],
    ],
    object: [
      ["to key.", ["a", 2], { a: 2, b: 2, c: 3 }],
      ["to numeric key.", [0, 2], { a: 1, b: 2, c: 3, 0: 2 }],
      ["to non-existing key.", ["d", 9], { a: 1, b: 2, c: 3, d: 9 }],
      ["to non-existing key + index.", ["d.0", 9], { a: 1, b: 2, c: 3, d: [9] }],
      ["to non-existing key + key.", ["d.e", 9], { a: 1, b: 2, c: 3, d: { e: 9 } }],
      ["to non-existing key + key (map).", ["d.e", 9, { preferMap: true }], { a: 1, b: 2, c: 3, d: new Map([["e", 9]]) }],
    ],
    o2: [
      ["array to scalar value.", ["o0.0", 1], { o0: [1], o1: ["o10", { o111: 0, o112: [1, 2] }], o2: { o21: 0 }, o3: map({ o31: 0 }) }],
      ["to key + index", ["o1.0", 1], { o0: 0, o1: [1, { o111: 0, o112: [1, 2] }], o2: { o21: 0 }, o3: map({ o31: 0 }) }],
      ["to key + key (map)", ["o3.o32", 1], { o0: 0, o1: ["o10", { o111: 0, o112: [1, 2] }], o2: { o21: 0 }, o3: map({ o31: 0, o32: 1 }) }],
      ["to member of map", ["o3.o32", 1], { o0: 0, o1: ["o10", { o111: 0, o112: [1, 2] }], o2: { o21: 0 }, o3: map({ o31: 0, o32: 1 }) }],
      ["to value key + index + key", ["o1.1.o112", 3], { o0: 0, o1: ["o10", { o111: 0, o112: 3 }], o2: { o21: 0 }, o3: map({ o31: 0 }) }],
      [
        "array to key with value of object",
        ["o2.0", 3],
        { o0: 0, o1: ["o10", { o111: 0, o112: [1, 2] }], o2: { o21: 0, 0: 3 }, o3: map({ o31: 0 }) },
      ],
      // ["object key with number", ["o2.0", 3], { o0: 0, o1: ["o10", { o111: 0, o112: [1, 2] }], o2: { o21: 0, 0: 3 }, o3: map({ o31: 0 }) }],

      [
        "to key + index + key",
        ["o1.2.a", 3],
        { o0: 0, o1: ["o10", { o111: 0, o112: [1, 2] }, { a: 3 }], o2: { o21: 0 }, o3: map({ o31: 0 }) },
      ],
    ],
    o3: [
      ["value to date key + key", ["a.b", 3], { a: { b: 3 } }],
      ["value to date key + index", ["a.0", 3], { a: [3] }],
    ],
    o4: [
      ["attribute of class instance", ["a.y.y1", 1], { a: { x: 0, y: { y1: 1, y2: 0 } } }],
      ["value to atomic class instance", ["a.y.y1", 1, { atomicClasses: [A] }], { a: { y: { y1: 1 } } }],
    ],
    class: [["value of class attribute", ["y.y1", 1], { x: 0, y: { y1: 1, y2: 0 } }]],
  };

  const equalityTests: Array<[string, [any, any, any, Options?]]> = [
    ["return same object", [data.o4, "a", data.o4.a]],
    ["return same array", [data.o2, "o1", data.o2.o1]],
    ["return same map", [data.o2, "o3", data.o2.o3]],
  ];

  Object.keys(tests).forEach(type =>
    describe(type, () => tests[type].forEach(t => it(`should set ${t[0]}`, () => expect(set(data[type], ...t[1])).toEqual(t[2]))))
  );

  describe("map", () =>
    tests.object.forEach(t => it(`should set ${t[0]}`, () => expect(set(map(data.object), ...t[1])).toEqual(map(t[2])))));

  describe("with same value", () => {
    equalityTests.forEach(t => it(`should ${t[0]}`, () => expect(set(...t[1])).toBe(t[1][0])));
  });
});

//
// ─── UNSET ──────────────────────────────────────────────────────────────────────
//

describe("unset()", () => {
  const tests: { [key: string]: Array<[string, [any, UnsetOptions?], any]> } = {
    array: [
      ["true for existing index.", ["1"], ["a0", "a2"]],
      ["non existing index.", ["4"], ["a0", "a1", "a2"]],
      ["existing - non existing index.", ["1.2"], ["a0", "a1", "a2"]],
      ["non existing - non existing index.", ["9.0"], ["a0", "a1", "a2"]],
    ],
    o2: [
      ["deep key.", ["o1.1.o111"], { o0: 0, o1: ["o10", { o112: [1, 2] }], o2: { o21: 0 }, o3: map({ o31: 0 }) }],
      ["deep index.", ["o1.1.o112.0"], { o0: 0, o1: ["o10", { o111: 0, o112: [2] }], o2: { o21: 0 }, o3: map({ o31: 0 }) }],
      ["deep map index.", ["o3.o31"], { o0: 0, o1: ["o10", { o111: 0, o112: [1, 2] }], o2: { o21: 0 } }],
      [
        "deep map index without `unsetEmpty`.",
        ["o3.o31", { unsetEmpty: false }],
        { o0: 0, o1: ["o10", { o111: 0, o112: [1, 2] }], o2: { o21: 0 }, o3: new Map() },
      ],
    ],
    o3: [["non existing key of non atomic value.", ["o3.a.a"], { a: date }]],
    o5: [
      ["cascadingly.", ["o1.0.o111"], { o0: 0 }],
      ["without cascadingly.", ["o1.0.o111", { unsetEmpty: false }], { o0: 0, o1: [{}] }],
    ],
  };

  Object.keys(tests).forEach(type =>
    describe(type, () => tests[type].forEach(t => it(`should unset ${t[0]}`, () => expect(unset(data[type], ...t[1])).toEqual(t[2]))))
  );
});

//
// ─── HAS ────────────────────────────────────────────────────────────────────────
//
describe("has()", () => {
  const tests: { [key: string]: Array<[string, [any], any]> } = {
    array: [
      ["return true for existing index.", [0], true],
      ["return true for existing string index.", ["0"], true],
      ["return false for non existing index.", [99], false],
      ["return false for non existing string index.", ["99"], false],
      ["return false for non existing unrelated string index.", ["a"], false],
    ],
    object: [
      ["return true for existing key.", ["a"], true],
      ["return false for non existing key.", ["z"], false],
      ["return false for non existing number key.", [0], false],
    ],
    o2: [
      ["return true for existing array path.", ["o1.1.o112.0"], true],
      ["return true for existing map path.", ["o3.o31"], true],
      ["return false for non existing path.", ["o1.1.o112.99"], false],
    ],
  };

  Object.keys(tests).forEach(type =>
    describe(type, () => tests[type].forEach(t => it(`for ${t[0]} should`, () => expect(has(data[type], ...t[1])).toEqual(t[2]))))
  );
});

//
// ─── GET ────────────────────────────────────────────────────────────────────────
//
describe("get()", () => {
  const tests: { [key: string]: Array<[string, [any, any?], any]> } = {
    array: [
      ["return value for existing index.", [0], "a0"],
      ["return value for existing string index.", ["0"], "a0"],
      ["return undefined for non existing index.", [99], undefined],
      ["return undefined for non existing string index.", ["99"], undefined],
      ["return undefined for non existing unrelated string index.", ["a"], undefined],
      ["return default value for non existing index.", [99, "x"], "x"],
    ],
    object: [
      ["return value for existing key.", ["a"], 1],
      ["return undefined for non existing key.", ["z"], undefined],
      ["return undefined for non existing number key.", [0], undefined],
    ],
    o2: [
      ["return value for existing array path.", ["o1.1.o112.0"], 1],
      ["return value for existing map path.", ["o3.o31"], 0],
      ["return undefined for non existing path.", ["o1.1.o112.99"], undefined],
      ["return default value for non existing path.", ["o1.1.o112.99", "x"], "x"],
    ],
  };

  Object.keys(tests).forEach(type =>
    describe(type, () => tests[type].forEach(t => it(`for ${t[0]} should`, () => expect(get(data[type], ...t[1])).toEqual(t[2]))))
  );
});
