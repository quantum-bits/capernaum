## `@Field`
  ```ts
  @Field(): MethodAndPropDecorator

  @Field(options: AdvancedOptions): MethodAndPropDecorator

  @Field(returnTypeFunction?: ReturnTypeFunction,
         options?: AdvancedOptions): MethodAndPropDecorator
  ```
* `AdvancedOptions`
  * `BasicOptions`
    * `DecoratorTypeOptions`
      ```
      nullable?: boolean
      defaultValue?: any
      ```
    * `DescriptionOptions`
      ```
      description?: string
      ```
  * `DeprecationOptions`
    ```
    deprecationReason?: string
    ```
  * `SchemaNameOptions`
    ```
    name?: string
    ```
  * `ComplexityOptions`
    ```
    complexity?: Complexity
    ```
* `ReturnTypeFunc`
  ```
  ReturnTypeFunc = (returns?: void) => ReturnTypeFuncValue;
  ReturnTypeFuncValue = TypeValue | [TypeValue];
  TypeValue = ClassType | GraphQLScalarType | Function | object | symbol;
  ```
  For example:
  ```
  @Field(type => [Post])
  ```

## `@Resolver`
```ts
@Resolver(): ClassDecorator;
@Resolver(options: ResolverClassOptions): ClassDecorator;
@Resolver(typeFunc: ClassTypeResolver, options?: ResolverClassOptions): ClassDecorator;
@Resolver(objectType: ClassType, options?: ResolverClassOptions): ClassDecorator;
```
  * `ResolverClassOptions` === `AbstractClassOptions`
    ```ts
    isAbstract?: boolean;
    ```
  * `ClassTypeResolver`
    ```ts
    ClassTypeResolver = (of?: void) => ClassType;
    ```

## `@Args`
```ts
@Args(): any;
@Args(...pipes: (Type<PipeTransform> | PipeTransform)[]): any;
@Args(property: string, ...pipes: (Type<PipeTransform> | PipeTransform)[]): any;
@Args(options: ArgsOptions, ...pipes: (Type<PipeTransform> | PipeTransform)[]): any;
```
  * `ArgsOptions`
    ```ts
    name?: string;
    type: () => any;
    ```
