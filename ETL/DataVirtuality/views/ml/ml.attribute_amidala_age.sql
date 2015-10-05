-- Name: ml.attribute_amidala_age
-- Created: 2015-04-24 18:17:15
-- Updated: 2015-04-24 18:17:15

CREATE VIEW ml.attribute_amidala_age AS
SELECT
    a.id AS attribute_id,
    a.identifier AS attribute_identifier
FROM postgres.attribute AS a
LEFT JOIN postgres.property AS p
    ON p.id = a.property_id
WHERE p.id = 125863535
ORDER BY a.id ASC


