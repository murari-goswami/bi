-- Name: ml.article_outfittery_style
-- Created: 2015-04-24 18:20:03
-- Updated: 2015-04-24 18:20:03

CREATE VIEW ml.article_outfittery_style AS
SELECT
	osohe.article_id,
	MAX(osohe.basic) AS outfittery_style_basic,
	MAX(osohe.modisch) AS outfittery_style_modisch,
	MAX(osohe.sportlich) AS outfittery_style_sportlich,
	MAX(osohe.elegant) AS outfittery_style_elegant,
	MAX(osohe.klassisch) AS outfittery_style_klassisch,
	MAX(osohe.laessig) AS outfittery_style_laessig
FROM
 (SELECT
    a.article_id,
    CASE WHEN os.attribute_identifier = 'basic'
           OR os.attribute_identifier = 'basics'
         THEN 1 ELSE 0 END AS basic,
    CASE WHEN os.attribute_identifier = 'modisch'
         THEN 1 ELSE 0 END AS modisch,
    CASE WHEN os.attribute_identifier = 'sportlich'
         THEN 1 ELSE 0 END AS sportlich,
    CASE WHEN os.attribute_identifier = 'elegant'
         THEN 1 ELSE 0 END AS elegant,
	CASE WHEN os.attribute_identifier = 'klassisch'
         THEN 1 ELSE 0 END AS klassisch,
	CASE WHEN os.attribute_identifier = 'laessig'
         THEN 1 ELSE 0 END AS laessig
    FROM bi.article AS a
LEFT JOIN ml.article_attribute AS aa
	ON a.article_id = aa.article_id
LEFT JOIN ml.attribute_outfittery_style AS os
	ON os.attribute_id = aa.attribute_id) AS osohe
GROUP BY osohe.article_id


