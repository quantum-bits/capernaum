-- Number of times an SEP is mentioned in the Boolean associations for a given letter.
SELECT COUNT(sep.title) AS sep_count, sep.title AS sep_title
FROM letter AS ltr
         INNER JOIN letter_element le ON ltr.id = le."letterId"
         INNER JOIN prediction_table pt ON pt.id = le."predictionTableId"
         INNER JOIN prediction_table_entry pte ON pt.id = pte."predictionTableId"
         INNER JOIN scripture_engagement_practice sep ON sep.id = pte."practiceId"
WHERE ltr.id = 10
GROUP BY sep_title
ORDER BY sep_count DESC, sep_title;

-- Mean survey index for an individual.
SELECT "sidx"."id"        AS sidx_id,
       "sidx"."title"     AS sidx_title,
       AVG("sir"."value") AS mean_sidx
FROM "survey_response" "sr"
         INNER JOIN "survey_item_response" "sir" ON "sir"."surveyResponseId" = "sr"."id"
         INNER JOIN "survey_item" "sitem" ON "sitem"."id" = "sir"."surveyItemId"
         INNER JOIN "survey_index" "sidx" ON "sidx"."id" = "sitem"."surveyIndexId"
WHERE sr.id = 2181
GROUP BY sidx_id, sidx_title
ORDER BY sidx_title;

-- Mean survey index for a group.
SELECT sidx.id        AS sidx_id,
       sidx.title     AS sidx_title,
       AVG(sir.value) AS mean_sidx
FROM "group" grp
         INNER JOIN survey_response sr ON "grp".id = sr."groupId"
         INNER JOIN survey_item_response sir ON sr.id = sir."surveyResponseId"
         INNER JOIN survey_item sitem ON sitem.id = sir."surveyItemId"
         INNER JOIN survey_index sidx ON sitem."surveyIndexId" = sidx.id
WHERE grp.id = 17
GROUP BY sidx_id, sidx_title
ORDER BY sidx_title;

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

-- Survey dimensions for an individual
SELECT sdim.id       AS sdim_id,
       sdim.title    AS sdim_title,
       sidx.id       AS sidx_id,
       sidx.title    AS sidx_title,
       msi.mean_sidx AS mean_sidx
FROM survey_dimension sdim
         INNER JOIN survey_index sidx ON sdim.id = sidx."surveyDimensionId"
         INNER JOIN (
    SELECT "sidx"."id"        AS sidx_id,
           "sidx"."title"     AS sidx_title,
           AVG("sir"."value") AS mean_sidx
    FROM "survey_response" "sr"
             INNER JOIN "survey_item_response" "sir" ON "sir"."surveyResponseId" = "sr"."id"
             INNER JOIN "survey_item" "sitem" ON "sitem"."id" = "sir"."surveyItemId"
             INNER JOIN "survey_index" "sidx" ON "sidx"."id" = "sitem"."surveyIndexId"
    WHERE sr.id = $1
    GROUP BY sidx_id, sidx_title) msi ON sidx.id = msi.sidx_id
ORDER BY sdim.title, sidx.title;
