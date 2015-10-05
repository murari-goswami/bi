-- Name: ml.attribute_season
-- Created: 2015-04-24 18:17:15
-- Updated: 2015-04-24 18:17:15

CREATE VIEW ml.attribute_season AS
SELECT
    a.id AS attribute_id,
    a.identifier AS attribute_identifier
FROM postgres.attribute AS a
LEFT JOIN postgres.property AS p
    ON p.id = a.property_id
WHERE p.id = 2031418
ORDER BY a.id ASC


