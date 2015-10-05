-- Name: ml.last50queries
-- Created: 2015-04-24 18:17:46
-- Updated: 2015-04-24 18:17:46

CREATE VIEW ml.last50queries AS
SELECT * FROM "SYSADMIN.Queries"
WHERE issuer = 'lando'
ORDER BY startTime DESC
LIMIT 50


