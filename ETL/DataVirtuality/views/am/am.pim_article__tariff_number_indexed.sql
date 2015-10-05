-- Name: am.pim_article__tariff_number_indexed
-- Created: 2015-04-24 18:19:30
-- Updated: 2015-04-24 18:19:30

CREATE VIEW "am.pim_article__tariff_number_indexed" AS
SELECT
pm.pim_model_id,
CAST(pim_article__count.count = 1 AS INTEGER) "tariff_is_constant",
pam.tariff_number
FROM
"am.pim_model" pm
LEFT JOIN
( SELECT
pim_model_id,
COUNT(*) "count"
FROM "am.pim_article__tariff_number"
GROUP BY pim_model_id ) pim_article__count
ON pim_article__count.pim_model_id = pm.pim_model_id
LEFT JOIN "am.pim_article__tariff_number" pam ON pam.pim_model_id = pim_article__count.pim_model_id AND pim_article__count.count = 1


