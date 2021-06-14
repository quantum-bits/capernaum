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
SELECT COUNT(sep.title) AS sep_count, sep.title AS sep_title
FROM letter AS ltr
         INNER JOIN letter_element le ON ltr.id = le."letterId"
         INNER JOIN prediction_table pt ON pt.id = le."predictionTableId"
         INNER JOIN prediction_table_entry pte ON pt.id = pte."predictionTableId"
         INNER JOIN scripture_engagement_practice sep ON sep.id = pte."practiceId"
WHERE ltr.id = 10
GROUP BY sep_title
ORDER BY sep_count DESC, sep_title

-- The mean survey index view.
CREATE OR REPLACE VIEW mean_survey_index AS
SELECT sr.id              AS "sr_id",
       "sidx"."id"        AS "sidx_id",
       "sidx"."title"     AS "sidx_title",
       AVG("sir"."value") AS "mean_sidx"
FROM "survey_response" "sr"
         INNER JOIN "survey_item_response" "sir" ON "sir"."surveyResponseId" = "sr"."id"
         INNER JOIN "survey_item" "sitem" ON "sitem"."id" = "sir"."surveyItemId"
         INNER JOIN "survey_index" "sidx" ON "sidx"."id" = "sitem"."surveyIndexId"
GROUP BY sr_id, sidx_id, sidx_title;

-- Calculate Survey Dimensions
SELECT sdim.title AS sdim_title, sidx.title AS sidx_title, msi.mean_sidx
FROM survey_response sr
         INNER JOIN mean_survey_index msi ON sr.id = msi.sr_id
         INNER JOIN survey_index sidx ON msi.sidx_id = sidx.id
         INNER JOIN survey_dimension sdim ON sidx."surveyDimensionId" = sdim.id
WHERE sr.id = 2161
ORDER BY sdim.title, sidx.title;

-- Calculate an SEP prediction table (with embedded MSI view).
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
                     FROM mean_survey_index
                     WHERE sr_id = 2161) "msi" ON msi.sidx_id = "sidx"."id"
WHERE "pt"."id" = 1
  AND "sidx"."useForPredictions"
ORDER BY sep_title;

-- The mean survey index view for a group.
CREATE OR REPLACE VIEW group_mean_survey_index AS
SELECT grp.id         AS grp_id,
       sidx.id        AS sidx_id,
       sidx.title     AS sidx_title,
       AVG(sir.value) AS mean_sidx
FROM "group" grp
         INNER JOIN survey_response sr ON "grp".id = sr."groupId"
         INNER JOIN survey_item_response sir ON sr.id = sir."surveyResponseId"
         INNER JOIN survey_item sitem ON sitem.id = sir."surveyItemId"
         INNER JOIN survey_index sidx ON sitem."surveyIndexId" = sidx.id
GROUP BY grp_id, sidx_id, sidx_title;

SELECT *
FROM group_mean_survey_index
WHERE grp_id = 7;