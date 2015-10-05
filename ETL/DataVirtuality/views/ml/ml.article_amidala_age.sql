-- Name: ml.article_amidala_age
-- Created: 2015-04-24 18:20:01
-- Updated: 2015-04-24 18:20:01

CREATE VIEW ml.article_amidala_age AS
SELECT
	aiohe.article_id,
	MAX(aiohe.all_ages) AS all_ages,
	MAX(aiohe.under_40) AS under_40,
	MAX(aiohe.over_40) AS over_40
FROM
 (SELECT
    a.article_id,
    CASE WHEN age.attribute_identifier = 'all'
           OR age.attribute_identifier = 'alle'
         THEN 1 ELSE 0 END AS all_ages,
    CASE WHEN age.attribute_identifier = 'under_40'
           OR age.attribute_identifier = 'unter_40'
         THEN 1 ELSE 0 END AS under_40,
    CASE WHEN age.attribute_identifier = 'ueber_40'
         THEN 1 ELSE 0 END AS over_40
    FROM bi.article AS a
LEFT JOIN ml.article_attribute AS aa
	ON a.article_id = aa.article_id
LEFT JOIN ml.attribute_amidala_age AS age
	ON age.attribute_id = aa.attribute_id) AS aiohe
GROUP BY aiohe.article_id
ORDER BY article_id ASC


