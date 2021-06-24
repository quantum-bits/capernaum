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

-- Survey dimensions for an individual
SELECT sdim.id        AS sdim_id,
       sdim.title     AS sdim_title,
       sidx.id        AS sidx_id,
       sidx.title     AS sidx_title,
       AVG(sir.value) AS mean_sidx
FROM "survey_response" "sr"
         INNER JOIN "survey_item_response" "sir" ON "sir"."surveyResponseId" = "sr"."id"
         INNER JOIN "survey_item" "sitem" ON "sitem"."id" = "sir"."surveyItemId"
         INNER JOIN "survey_index" "sidx" ON "sidx"."id" = "sitem"."surveyIndexId"
         INNER JOIN survey_dimension sdim ON sdim.id = sidx."surveyDimensionId"
WHERE sr.id = $1
GROUP BY sdim.id, sdim.title, sidx.id, sidx.title
ORDER BY sdim.title, sidx.title;

-- Survey dimensions for a group
SELECT sdim.id        AS sdim_id,
       sdim.title     AS sdim_title,
       sidx.id        AS sidx_id,
       sidx.title     AS sidx_title,
       AVG(sir.value) AS mean_sidx
FROM "group" grp
         INNER JOIN survey_response sr ON grp.id = sr."groupId"
         INNER JOIN "survey_item_response" "sir" ON "sir"."surveyResponseId" = "sr"."id"
         INNER JOIN "survey_item" "sitem" ON "sitem"."id" = "sir"."surveyItemId"
         INNER JOIN "survey_index" "sidx" ON "sidx"."id" = "sitem"."surveyIndexId"
         INNER JOIN survey_dimension sdim ON sdim.id = sidx."surveyDimensionId"
WHERE grp.id = $1
GROUP BY sdim.id, sdim.title, sidx.id, sidx.title
ORDER BY sdim.title, sidx.title;


-- Scripture engagement prediction for an individual
SELECT sep.id            AS sep_id,
       sep.title         AS sep_title,
       sidx.id           AS sidx_id,
       sidx.title        AS sidx_title,
       sidx.abbreviation AS sidx_abbreviation,
       AVG(sir.value)    AS mean_sidx
FROM "survey_response" "sr"
         INNER JOIN "survey_item_response" "sir" ON "sir"."surveyResponseId" = "sr"."id"
         INNER JOIN "survey_item" "sitem" ON "sitem"."id" = "sir"."surveyItemId"
         INNER JOIN "survey_index" "sidx" ON "sidx"."id" = "sitem"."surveyIndexId"
         INNER JOIN prediction_table_entry pte ON sidx.id = pte."surveyIndexId"
         INNER JOIN scripture_engagement_practice sep ON pte."practiceId" = sep.id
WHERE sr.id = $1
  AND sidx."useForPredictions"
GROUP BY sep.id, sep.title, sidx.id, sidx.title, sidx.abbreviation
ORDER BY sep.title;

-- Summarize a qualtrics survey.
SELECT survey."qualtricsName" as survey_name,
       sdim.id AS sdim_id,
       sdim.title,
       sidx.id AS sidx_id,
       sidx.title,
       sitem.id as sitem_id,
       sitem."qualtricsId",
       sitem."qualtricsText"
FROM survey
         INNER JOIN survey_dimension sdim ON survey.id = sdim."surveyId"
         INNER JOIN survey_index sidx ON sdim.id = sidx."surveyDimensionId"
         INNER JOIN survey_item sitem ON sidx.id = sitem."surveyIndexId"
order by sdim_id, sidx_id, sitem_id;