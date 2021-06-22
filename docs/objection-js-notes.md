Repackaging of the [Objection Docs](https://vincit.github.io/objection.js/guide/relations.html#relations)

Three ways to create a relationship between two tables `A` and `B`:
1. Table `A` has a column that holds `B.id`. 
    * `BelongsToOneRelation`
    * `A` _belongs to one_ `B`.
1. Table `B` has a column that holds `A.id`.
    * `HasManyRelation`
    * `A` _has many_ `B`'s.
1. Table `C` has columns for both `A.id` and `B.id`
    * `ManyToManyRelation`
    * Each `C` joins one `A` with one `B`.
    * `A` _has many_ `B`'s
    * `B` _has many_ `A`'s

Vocabulary for the relation descriptions:
1. **source model**: model for which you are writing the `relationMapping`
1. **related model**: model at the other end of the relation.

Then:
1. `BelongsToOneRelation`: source model has the foreign key
1. `HasManyRelation`: related model has the foreign key
1. `HasOneRelation`: related model has the foreign key (like `HasManyRelation`) but for _one_ related row
1. `ManyToManyRelation`: model is related to a list of other models through a join table
1. `HasOneThroughRelation`: model is related to a single model through a join table

Traditional naming:
1. "One `A` to many `B`"
    * `A` is `HasManyRelation`
    * `B` is `BelongsToOneRelation` with FK to `A`
1. "Many `A` to many `B`"
    * `A` is `ManyToManyRelation`
    * `B` is `ManyToManyRelation`
