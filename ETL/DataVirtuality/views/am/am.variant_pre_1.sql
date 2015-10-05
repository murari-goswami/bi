-- Name: am.variant_pre_1
-- Created: 2015-04-24 18:24:33
-- Updated: 2015-04-24 18:24:33

CREATE VIEW am.variant_pre_1 AS
SELECT
v.*,
norm_eu_size.eu_size_normed "eu_size_normed",
v.eu_size_x_length "eu_size_x_length_normed"
FROM "am.variant_pre" v
LEFT JOIN "am.size_raw__size_normalized" norm_eu_size ON norm_eu_size.eu_size = v.eu_size


