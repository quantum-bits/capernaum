# Frequently Forgotten Answers

These are some things
that I keep forgetting and have to re-learn
after taking a hiatus from the project.

## Slots

1. [Slots are nifty](https://vuejs.org/v2/guide/components-slots.html).
1. [Named slots](https://vuejs.org/v2/guide/components-slots.html#Named-Slots) are straightforward.
1. [Scoped slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) are more complicated.

### Scoped Slots

Here's an example from the documentation, plus comments.
This is the _template_ for a **child** component
entitled `current-user`.
The user information is the default slot content
if it's not overridden.

```vue
<span>
  <slot>
    {{ user.lastName }}
  </slot>
</span>
```

Here's a **stupid parent** component that _tries_ (unsuccessfully) to override the previous template.

```vue
<div>
  <current-user>
    {{ user.firstName }}
  </current-user>
</div>
```

The intent here is for the parent to override
the content of the slot
**using data owned by the _child_**.
This won't work.
One-way data binding won't allow it.
The `user` object is only visible in the **child**.

Here's a second
version of `current-user`,
call it the **scoped child** component.

```vue
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>
```

Here, the `v-bind` property
allows the **scoped child**
to selectively expose data
_that it owns_,
making it available to parent components.
The **scoped child** is
making its internal `user` object
(`"user"`)
available to the parent component
with the bound name
(the `user` argument to `v-bind`).
Visual version:

```
v-bind:user="user"
       ^     ^
       |     |
       |     +--- Object owned by scoped child
       +--- Binding accessible to parent
```

Now our **(non-stupid) parent**
component can get access to the underlying
`user` object owned by the **scoped child**.

```vue
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
```

Here's what's going on:

1. The `v-slot` prop of the `template`
   refers to the `default` slot of `current-user`
   (there may be more than one named slot in `current-user`).
1. The `"slotProps"` value gives the name of an object
   that will be bound to whatever scoped slots
   are accessible from the **scoped child**
   (there may be more than one).
1. Within the double mustaches, the **parent**
   can refer to the scoped slots exported from `current-user`
   as attributes of the `slotProps` object.

As [noted in the documentation](https://vuejs.org/v2/guide/components-slots.html#Destructuring-Slot-Props)
the value of the `v-slot` directive in the **parent**
is actually passed to a function,
allowing it to be any valid JS expression,
including _object destructuring_.
Here, we destructure the object
made visible from the **scoped child**,
granting the **parent** component
direct access to the `user` object from the child.

```vue
<current-user>
  <template v-slot:default="{ user }">
    {{ user.firstName }}
  </template>
</current-user>
```

Things of Note

1. The content of the template in the **parent**
   is just ordinary content that will override the named slot.
   Nothing requires that we use the values bound
   from the **scoped child**
   (although it would be kind of dumb to go to this
   much trouble and not use it).
1. There is
   [shortcut syntax](https://vuejs.org/v2/guide/components-slots.html#Abbreviated-Syntax-for-Lone-Default-Slots)
   that avoids the nested `template`
   if the underlying **scoped child** is sufficiently simple.

## Slots in Vuetify Data Tables

Vuetify makes extensive use of slots.
There's a slight complication in some cases.

1. Vuetify uses a dotted syntax
   to identify slots that are part of data tables
   (e.g., `item.<name>`).
   Consequently, the `v-slot` argument may look like
   ```vue
   <template v-slot:item.columnName="{ item }"></template>
   ```
1. The
   [ESLint rule `vue/valid-v-slot`](https://eslint.vuejs.org/rules/valid-v-slot.html)
   does not like this syntax because it thinks the
   `columnName` is a
   [Vue directive modifier](https://vuejs.org/v2/guide/syntax.html#Modifiers).

There are (at least) two ways to make ESLint happy:

1. As noted in
   [the Vuetify docs](https://vuetifyjs.com/en/components/data-tables/#slots)
   and elsewhere on the Internets,
   you can disable this error by modifying your ESLint configuration.
1. Change your markup to use this horrible syntax:

   ```vue
   <template v-slot:[`item.columnName`]="{ item }"></template>
   ```

   What's going on here?
   We're subverting Vue's
   [dynamic arguments](https://vuejs.org/v2/guide/syntax.html#Dynamic-Arguments)
   to avoid having a directive argument appearing to have a modifier.
   The syntax for a dynamic argument is:

   ```vue
   <a v-bind:[attributeName]="url"> ... </a>
   ```

   where the square brackets are required syntax
   and `attributeName` is
   "dynamically evaluated as JavaScript expression"
   whose
   "value will be used as the final value for the argument."

   Dynamic arguments must evaluate to a string (or `null`).
   It would be nice to use ordinary quote marks here,
   but they are invalid within HTML attribute names.
   The template literal string sidesteps that issue.

I've elected to change the ESLint configuration,
but there may be vestigial remains of the ugly syntax
still lurking about the code.

As of this writing,
Vuetify is working on version 3
(targeting Vue 3's Composition API).
It's not clear whether they will change
the names of these scoped slots to avoid
the dots and allow us to use the default
setting for `vue/valid-v-slot` in ESLint.
