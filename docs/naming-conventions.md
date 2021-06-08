# Naming Conventions

Naming conventions to which we aspire.

## Resolvers

Resolvers respond to GraphQL requests.
Expose the same names to GraphQL clients.
All methods are public unless otherwise noted.

| CRUD       | FooResolver                 | Description                              |
| ---------- | --------------------------- | ---------------------------------------- |
| **Create** | `createFoo(FooCreateInput)` | Create a new `Foo`                       |
| **Read**   | `readAllFoos()`             | Read _all_ `Foo`s                        |
|            | `readOneFoo(fooId)`         | Read `Foo` with `id`                     |
|            | `resolveBar()`              | Resolve `Bar` for `Foo` (private method) |
| **Update** | `updateFoo(FooUpdateInput)` | Update `Foo`                             |
| **Delete** | `deleteFoo(fooId)`          | Delete `Foo` with `id`                   |

## Services

|    CRUD    | FooService               | Description                                          |
| :--------: | ------------------------ | ---------------------------------------------------- |
| **Create** | `create(FooCreateInput)` | Create a new `Foo`                                   |
|            | `importFromBar(...)`     | Import `Foo` from `Bar` (e.g., Qualtrics)            |
|  **Read**  | `readAll()`              | Read _all_ `Foo`s                                    |
|            | `readOne(fooId)`         | Read `Foo` with `id`                                 |
|            | `readRelatedBar(foo)`    | Read `Bar` related to `Foo` (e.g., GraphQL resolver) |
| **Update** | `update(FooUpdateInput)` | Update `Foo`                                         |
| **Delete** | `delete(fooId)`          | Delete `Foo` with `id`                               |
