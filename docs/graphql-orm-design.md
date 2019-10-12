# One To Many

One Survey has many Survey Dimensions

## Survey 

### Entity

```ts
@OneToMany(type => SurveyDimension, dimension => dimension.survey)
@Field(type => [SurveyDimension]) surveyDimensions: SurveyDimension[];
```

### Resolver

```ts
@ResolveProperty("surveyDimensions", type => [SurveyDimension])
resolveSurveyDimensions(@Parent() survey: Survey) {
  return this.surveyService.find(SurveyDimension, { survey });
}
```

## Survey Dimension

### Entity

```ts
@ManyToOne(type => Survey, survey => survey.surveyDimensions)
@Field(type => Survey) survey: Survey;
@Column("integer") surveyId: number;
```

### Resolver

```ts
@ResolveProperty(type => Survey)
survey(@Parent() surveyDimension: SurveyDimension) {
  return this.surveyService.readOne(Survey, surveyDimension.surveyId);
}
```