-- Name: am.bad_variant
-- Created: 2015-04-24 18:27:08
-- Updated: 2015-04-24 18:27:08

CREATE VIEW am.bad_variant AS
SELECT *
FROM
( SELECT pim_size_variation_id,
COUNT(*) "count"
FROM "am.variant_pre_4" vr
GROUP BY vr.pim_size_variation_id ) x
WHERE x.count > 1


