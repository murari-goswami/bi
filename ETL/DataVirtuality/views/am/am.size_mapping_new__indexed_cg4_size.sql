-- Name: am.size_mapping_new__indexed_cg4_size
-- Created: 2015-04-24 18:19:21
-- Updated: 2015-04-24 18:19:21

CREATE VIEW am.size_mapping_new__indexed_cg4_size AS
SELECT * FROM "am.size_mapping_new"
WHERE eu_size_x_length IS NULL
AND brand IS NULL


