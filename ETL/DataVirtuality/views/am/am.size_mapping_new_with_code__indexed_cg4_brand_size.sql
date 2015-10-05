-- Name: am.size_mapping_new_with_code__indexed_cg4_brand_size
-- Created: 2015-04-29 18:28:53
-- Updated: 2015-05-21 11:49:54

CREATE VIEW am.size_mapping_new_with_code__indexed_cg4_brand_size AS
SELECT * FROM "am.size_mapping_new_with_code"
WHERE eu_size_x_length IS NULL
AND brand IS NOT NULL


