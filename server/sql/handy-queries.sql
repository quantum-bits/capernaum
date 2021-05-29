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
GROUP BY ltr.id, ltr.title