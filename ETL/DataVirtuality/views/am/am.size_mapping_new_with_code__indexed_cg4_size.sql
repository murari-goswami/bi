-- Name: am.size_mapping_new_with_code__indexed_cg4_size
-- Created: 2015-04-29 18:30:40
-- Updated: 2015-05-21 11:50:14

CREATE VIEW am.size_mapping_new_with_code__indexed_cg4_size AS
SELECT * FROM "am.size_mapping_new_with_code"
WHERE eu_size_x_length IS NULL
AND brand IS NULL


