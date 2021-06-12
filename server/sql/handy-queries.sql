-- Dimensions and indices for a given survey. Remember that "use for predictions"
-- is only for SE predictions and that using a survey dimension in the letter
-- is independent of "use for predictions".
SELECT s.id, sd.id, sd.title, si.id, si.title, si."useForPredictions"
FROM survey AS s
         INNER JOIN survey_dimension sd ON s.id = sd."surveyId"
         INNER JOIN survey_index si ON sd.id = si."surveyDimensionId"
WHERE s.id = 10
ORDER BY "useForPredictions" DESC, sd.title, si.title;

-- Number of times an SEP is mentioned in the Boolean associations for a given letter.
SELECT count(sep.title) as sep_count, sep.title as sep_title
FROM letter AS ltr
         INNER JOIN letter_element le ON ltr.id = le."letterId"
         INNER JOIN prediction_table pt ON pt.id = le."predictionTableId"
         INNER JOIN prediction_table_entry pte ON pt.id = pte."predictionTableId"
         INNER JOIN scripture_engagement_practice sep ON sep.id = pte."practiceId"
WHERE ltr.id = 10
group by sep_title
order by sep_count DESC, sep_title

-- Calculate Survey Dimensions
SELECT sdim.title, sindex.title, AVG(sir.value) AS avg_value
FROM survey_response sr
         INNER JOIN survey_item_response sir ON sr.id = sir."surveyResponseId"
         INNER JOIN survey_item sitem ON sitem.id = sir."surveyItemId"
         INNER JOIN survey_index sindex ON sitem."surveyIndexId" = sindex.id
         INNER JOIN survey_dimension sdim ON sindex."surveyDimensionId" = sdim.id
WHERE sr.id = 2088
GROUP BY sdim.title, sindex.title
ORDER BY sdim.title, sindex.title;

-- Calculate a SEP prediction table (with embedded MSI query)
SELECT sep.title, sidx.title, sidx.id, msi.mean_sidx
FROM prediction_table pt
         INNER JOIN prediction_table_entry pte ON pt.id = pte."predictionTableId"
         INNER JOIN scripture_engagement_practice sep ON sep.id = pte."practiceId"
         INNER JOIN survey_index sidx ON sidx.id = pte."surveyIndexId"
         INNER JOIN (SELECT sidx.id AS sidx_id, AVG(sir.value) AS mean_sidx
                     FROM survey_response sr
                              INNER JOIN survey_item_response sir ON sr.id = sir."surveyResponseId"
                              INNER JOIN survey_item sitem ON sitem.id = sir."surveyItemId"
                              INNER JOIN survey_index sidx ON sitem."surveyIndexId" = sidx.id
                     WHERE sr.id = 2121
                     GROUP BY sidx_id) msi ON msi.sidx_id = sidx.id
WHERE pt.id = 1
  AND sidx."useForPredictions";

-- Better: calculate a SEP prediction table (with embedded MSI view).
-- Note the sub-query using the view in order to constrain the survey response ID.
SELECT "sep"."id"     AS "sep_id",
       "sep"."title"  AS "sep_title",
       "sidx"."id"    AS "sidx_id",
       "sidx"."title" AS "sidx_title",
       msi.mean_sidx  AS "mean_sidx"
FROM "prediction_table" "pt"
         INNER JOIN "prediction_table_entry" "pte" ON "pte"."predictionTableId" = "pt"."id"
         INNER JOIN "scripture_engagement_practice" "sep" ON "sep"."id" = "pte"."practiceId"
         INNER JOIN "survey_index" "sidx" ON "sidx"."id" = "pte"."surveyIndexId"
         INNER JOIN (SELECT *
                     FROM mean_schema_index
                     WHERE sr_id = 2121) "msi" ON msi.sidx_id = "sidx"."id"
WHERE "pt"."id" = 1
  AND "sidx"."useForPredictions"
ORDER BY sep_title;

-- The MSI view to use with the previous query.
CREATE OR REPLACE VIEW mean_schema_index AS
SELECT sr.id AS "sr_id", "sidx"."id" AS "sidx_id", "sidx"."title" AS "sidx_title", AVG("sir"."value") AS "mean_sidx"
FROM "survey_response" "sr"
         INNER JOIN "survey_item_response" "sir" ON "sir"."surveyResponseId" = "sr"."id"
         INNER JOIN "survey_item" "sitem" ON "sitem"."id" = "sir"."surveyItemId"
         INNER JOIN "survey_index" "sidx" ON "sidx"."id" = "sitem"."surveyIndexId"
GROUP BY sr_id, sidx_id, "sidx"."title";
