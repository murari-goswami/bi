-- Name: ml.attribute_outfittery_style
-- Created: 2015-04-24 18:17:15
-- Updated: 2015-04-24 18:17:15

CREATE VIEW ml.attribute_outfittery_style AS
SELECT
    a.id AS attribute_id,
    a.identifier AS attribute_identifier
FROM postgres.attribute AS a
LEFT JOIN postgres.property AS p
    ON p.id = a.property_id
WHERE p.id = 18792295
ORDER BY a.id ASC


