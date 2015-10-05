-- Name: am.bad_base
-- Created: 2015-04-24 18:17:58
-- Updated: 2015-04-28 17:58:20

CREATE VIEW am.bad_base AS
SELECT * FROM (
SELECT "b.pim_model_id",
COUNT(*) AS "count" FROM am.base_pre b
GROUP BY "pim_model_id" ) x
WHERE x.count > 1


