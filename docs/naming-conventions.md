# Naming Conventions

Naming conventions to which we aspire.

## Resolvers

Resolvers respond to GraphQL requests.
Expose the same names to GraphQL clients.
All methods are public unless otherwise noted.
Naming convention is to prefix with entity
to help sorted schemas come up nicely.

| CRUD       | FooResolver                 | Description                              |
| ---------- | --------------------------- | ---------------------------------------- |
| **Create** | `fooCreate(FooCreateInput)` | Create a new `Foo`                       |
| **Read**   | `fooReadAll()`              | Read _all_ `Foo`s                        |
|            | `fooReadOne(fooId)`         | Read one `Foo` with `fooId`              |
|            | `foo[s]ByBar(...)`          | Read `Foo` that satisfy `Bar` criteria   |
|            | `foo[s]ForBar(...)`         | Read `Foo` that satisfy `Bar` criteria   |
|            | `resolveBar()`              | Resolve `Bar` for `Foo` (private method) |
| **Update** | `fooUpdate(FooUpdateInput)` | Update `Foo`                             |
| **Delete** | `fooDelete(fooId)`          | Delete `Foo` with `id`                   |

## Services

|    CRUD    | FooService               | Description                                             |
| :--------: | ------------------------ | ------------------------------------------------------- |
| **Create** | `create(FooCreateInput)` | Create a new `Foo`                                      |
|            | `importFromBar(...)`     | Import `Foo` from `Bar` (e.g., Qualtrics)               |
|  **Read**  | `readAll()`              | Read _all_ `Foo`s                                       |
|            | `readOne(fooId)`         | Read `Foo` with `id`                                    |
|            | `resolveRelatedBar(foo)` | Resolve `Bar` related to `Foo` (e.g., GraphQL resolver) |
|            | `findByBar(...)`         | Find `Foo` based on criteria `Bar`                      |
| **Update** | `update(FooUpdateInput)` | Update `Foo`                                            |
| **Delete** | `delete(fooId)`          | Delete `Foo` with `id`                                  |
