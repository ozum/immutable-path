# immutable-path



Immutable `get`, `set`, `has`, `unset` deep path operations libraray for object, array and `Map`.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Synopsis](#synopsis)
- [Details](#details)
- [API](#api)
- [immutable-path](#immutable-path)
  - [Type aliases](#type-aliases)
    - [Class](#class)
    - [Key](#key)
    - [KeyOfMap](#keyofmap)
    - [Path](#path)
    - [SetFunction](#setfunction)
    - [Source](#source)
  - [Variables](#variables)
    - [`Const` defaultAtomicClasses](#const-defaultatomicclasses)
  - [Functions](#functions)
    - [get](#get)
    - [has](#has)
    - [set](#set)
    - [unset](#unset)
- [Interfaces](#interfaces)
- [Interface: Options](#interface-options)
  - [Hierarchy](#hierarchy)
  - [Properties](#properties)
    - [`Optional` atomicClasses](#optional-atomicclasses)
    - [`Optional` preferMap](#optional-prefermap)
- [Interface: UnsetOptions](#interface-unsetoptions)
  - [Hierarchy](#hierarchy-1)
  - [Properties](#properties-1)
    - [`Optional` atomicClasses](#optional-atomicclasses-1)
    - [`Optional` preferMap](#optional-prefermap-1)
    - [`Optional` unsetEmpty](#optional-unsetempty)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Installation
# Synopsis

```ts
const object = { a: "a", b: [0, 1], c: new Map([["x", "x"]]) };

set(object, "a", "new"); // { a: "new", b: [0, 1], c: new Map([["x", "x"]]) };
set(object, "a.c.x", "new"); // { a: "new", b: [0, 1], c: new Map([["x", "new"]]) };
set(object, "a.c.x", "new"); // { a: "new", b: [0, 1], c: new Map([["x", "new"]]) };
unset(object, "a.c.x"); // { a: "new", b: [0, 1], c: new Map() };
unset(object, "a.c.x", { unsetEmpty: true }); // { a: "new", b: [0, 1] };

const otherObject = { a: "a", b: new CustomClass() };
set(otherObject, "b.x", "new", { atomicClasses: CustomClass }); // { a: "a", b: "x" }
```

# Details

Update, get, delete or check existence of keys of deeply nested objects, keys and `Map`s.

# API


<a name="readmemd"></a>

[immutable-path](#readmemd)

# immutable-path

## Type aliases

###  Class

Ƭ **Class**: *object*

Defined in util/types.ts:1

#### Type declaration:

___

###  Key

Ƭ **Key**: *keyof S | [KeyOfMap](#keyofmap)‹S›*

Defined in util/types.ts:13

Object key or arrau index.

___

###  KeyOfMap

Ƭ **KeyOfMap**: *M extends Map<infer K, unknown> ? K : never*

Defined in util/types.ts:7

___

###  Path

Ƭ **Path**: *string | number | Array‹string | number›*

Defined in util/types.ts:5

___

###  SetFunction

Ƭ **SetFunction**: *function*

Defined in util/types.ts:42

Returned value from this function is used as new value to be set.

#### Type declaration:

▸ (`value`: S[K], `key`: K, `source`: S, `root`: any): *S[K]*

qefjewoıh

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | S[K] | is the current value of given key/index. |
`key` | K | is the current key/index of value to be replaced. |
`source` | S | is the object/array/Map which has the key/index. |
`root` | any | is the root object/array/Map. |

___

###  Source

Ƭ **Source**: *Array‹any› | Map‹any, any› | Record‹any, any›*

Defined in util/types.ts:3

## Variables

### `Const` defaultAtomicClasses

• **defaultAtomicClasses**: *[Class](#class)[]* = [Date, RegExp]

Defined in util/helper.ts:7

List of default atomic classes.

## Functions

###  get

▸ **get**<**S**>(`source`: S, `path`: [Path](#path), `defaultValue?`: any): *any*

Defined in immutable-object-path.ts:89

Gets the property value at path of object/array/Map. If the resolved value is undefined the defaultValue is used in its place.

**Type parameters:**

▪ **S**: *[Source](#source)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`source` | S | is the object/array/map to query. |
`path` | [Path](#path) | is the path of the property to get. |
`defaultValue?` | any | is the value returned if the resolved value is `undefined`. |

**Returns:** *any*

the resolved value.

___

###  has

▸ **has**<**S**>(`source`: S, `path`: [Path](#path)): *any*

Defined in immutable-object-path.ts:106

Checks if path is a direct property of object/array/Map.

**Type parameters:**

▪ **S**: *[Source](#source)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`source` | S | is the object/array/Map to query. |
`path` | [Path](#path) | is the path to check. |

**Returns:** *any*

whether path is a direct property of object/array/Map.

___

###  set

▸ **set**<**S**>(`source`: S, `path`: [Path](#path), `value`: any, `__namedParameters`: object, `root`: any): *any*

Defined in immutable-object-path.ts:25

Sets the property value of path on object/array/Map immutably without changing input. If a portion of path does not exist it's created.
Provided `atomicClasses` is used to determine which type of objects are treated as atomic. Atomic classes are
treated like primitives pretending they don't have attributes. See example below. If `preferMap` is true,
when new objects are needed, they are created as `Map` instead of object.

#### Example
```typescript
const a = set({ x: new Date() }, "x.y", 3); // 3 is not assigned to atomic class Date. Insted it is replaced: { x: { y: 3 } }
const b = set({ x: { z: 1 } }, "x.y", 3); // 3 is not assigned to `x.y`: { x: { y: 3, z: 1 } }
const c = set({ }, "x.y", 3); // 3 is not assigned to `x.y`: { x: { y: 3 } }
const c = set({ }, "x.y", 3, { preferMap: true }); // Map([[x, new Map([[y, 3]])]]);
```

**Type parameters:**

▪ **S**: *[Source](#source)*

**Parameters:**

▪ **source**: *S*

is the object/array/map to set.

▪ **path**: *[Path](#path)*

is the path of the property to set.

▪ **value**: *any*

is the value to set.

▪`Default value`  **__namedParameters**: *object*= {}

are options.

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`atomicClasses` | object[] | defaultAtomicClasses | Atomic classes are treated like a scalar, because MOST PROBABLY user did not intend to update a property of it. Instead they want to replace it. |
`preferMap` | boolean | false | If an attribute for a non-existing object should be created, whether to create a `Map` instead of `object`. |

▪`Default value`  **root**: *any*= source

**Returns:** *any*

new object/array/Map.

___

###  unset

▸ **unset**<**S**>(`source`: S, `path`: [Path](#path), `__namedParameters`: object): *any*

Defined in immutable-object-path.ts:52

Removes the property at path of object and returns it. Does not change input value.

**Type parameters:**

▪ **S**: *[Source](#source)*

**Parameters:**

▪ **source**: *S*

is the object/array/map to unset a value.

▪ **path**: *[Path](#path)*

is the path of the property to unset.

▪`Default value`  **__namedParameters**: *object*= {}

are options.

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`atomicClasses` | object[] | defaultAtomicClasses | Atomic classes are treated like a scalar, because MOST PROBABLY user did not intend to update a property of it. Instead they want to replace it. |
`preferMap` | boolean | false | If an attribute for a non-existing object should be created, whether to create a `Map` instead of `object`. |
`unsetEmpty` | boolean | true | After unsetting a key/index if object/array/Map becomes empty, it is also unset in parent. |

**Returns:** *any*

new object/array/Map.

# Interfaces


<a name="interfacesoptionsmd"></a>

[immutable-path](#readmemd) › [Options](#interfacesoptionsmd)

# Interface: Options

Options

## Hierarchy

* **Options**

  ↳ [UnsetOptions](#interfacesunsetoptionsmd)

## Properties

### `Optional` atomicClasses

• **atomicClasses**? : *[Class](#class)[]*

Defined in util/types.ts:30

Atomic classes are treated like a scalar, because MOST PROBABLY user did not intend to update a property of it. Instead they want to replace it.

#### Example
```typescript
set([new Date()], "0.a", "x"); // => [{ a: "x" }] NOT [a Date with an attribute "x"]
```

___

### `Optional` preferMap

• **preferMap**? : *undefined | false | true*

Defined in util/types.ts:23

If an attribute for a non-existing object should be created, whether to create a `Map` instead of `object`.


<a name="interfacesunsetoptionsmd"></a>

[immutable-path](#readmemd) › [UnsetOptions](#interfacesunsetoptionsmd)

# Interface: UnsetOptions

Unset options.

## Hierarchy

* [Options](#interfacesoptionsmd)

  ↳ **UnsetOptions**

## Properties

### `Optional` atomicClasses

• **atomicClasses**? : *[Class](#class)[]*

*Inherited from [Options](#interfacesoptionsmd).[atomicClasses](#optional-atomicclasses)*

Defined in util/types.ts:30

Atomic classes are treated like a scalar, because MOST PROBABLY user did not intend to update a property of it. Instead they want to replace it.

#### Example
```typescript
set([new Date()], "0.a", "x"); // => [{ a: "x" }] NOT [a Date with an attribute "x"]
```

___

### `Optional` preferMap

• **preferMap**? : *undefined | false | true*

*Inherited from [Options](#interfacesoptionsmd).[preferMap](#optional-prefermap)*

Defined in util/types.ts:23

If an attribute for a non-existing object should be created, whether to create a `Map` instead of `object`.

___

### `Optional` unsetEmpty

• **unsetEmpty**? : *undefined | false | true*

Defined in util/types.ts:36

After unsetting a key/index if object/array/Map becomes empty, it is also unset in parent.

