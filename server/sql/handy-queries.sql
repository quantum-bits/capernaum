-- Dimensions and indices for a given survey. Remember that "use for predictions"
-- is only for SE predictions and that using a survey dimension in the letter
-- is independent of "use for predictions".
SELECT s.id, sd.id, sd.title, si.id, si.title, si."useForPredictions"
FROM survey AS s
         INNER JOIN survey_dimension sd ON s.id = sd."surveyId"
         INNER JOIN survey_index si ON sd.id = si."surveyDimensionId"
WHERE s.id = 10
ORDER BY "useForPredictions" DESC, sd.title, si.title;

-- Number of times a SEP is mentioned in the Boolean associations for a given letter.
SELECT ltr.id, ltr.title, COUNT(sep.title) AS "sep_count"
FROM letter AS ltr
         INNER JOIN prediction_table_entry pte ON ltr.id = pte."letterId"
         INNER JOIN scripture_engagement_practice sep ON sep.id = pte."practiceId"
GROUP BY ltr.id, ltr.title;

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

-- Calculate a SEP prediction table
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