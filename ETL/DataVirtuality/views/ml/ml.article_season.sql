-- Name: ml.article_season
-- Created: 2015-04-24 18:19:58
-- Updated: 2015-04-24 18:19:58

CREATE VIEW ml.article_season AS
SELECT
	agohe.article_id,
	CASE WHEN agohe.season_fs15 = 1
         THEN 1 ELSE 0 END AS year_2015,
	CASE WHEN agohe.herbst_winter_2014 = 1
           OR agohe.fruehjahr_sommer_2014 = 1
         THEN 1 ELSE 0 END AS year_2014,
	CASE WHEN agohe.herbst_winter_2013 = 1
           OR agohe.fruehjahr_sommer_2013 = 1
         THEN 1 ELSE 0 END AS year_2013,
	CASE WHEN agohe.herbst_winter_2012 = 1
           OR agohe.fruehjahr_sommer_2012 = 1
         THEN 1 ELSE 0 END AS year_2012,
	CASE WHEN agohe.herbst_winter_2011 = 1
           OR agohe.fruehjahr_sommer_2011 = 1
         THEN 1 ELSE 0 END AS year_2011,
	CASE WHEN agohe.herbst_winter_2010 = 1
           OR agohe.fruehjahr_sommer_2010 = 1
         THEN 1 ELSE 0 END AS year_2010,
	CASE WHEN agohe.herbst_winter_2009 = 1
           OR agohe.fruehjahr_sommer_2009 = 1
         THEN 1 ELSE 0 END AS year_2009,
	CASE WHEN agohe.herbst_winter_2009 = 1
           OR agohe.herbst_winter_2010 = 1
           OR agohe.herbst_winter_2011 = 1
           OR agohe.herbst_winter_2012 = 1
           OR agohe.herbst_winter_2013 = 1
           OR agohe.herbst_winter_2014 = 1
           OR agohe.hw_basisartikel    = 1
         THEN 1 ELSE 0 END AS season_autumn_winter,
    CASE WHEN agohe.fruehjahr_sommer_2009 = 1
           OR agohe.fruehjahr_sommer_2010 = 1
           OR agohe.fruehjahr_sommer_2011 = 1
           OR agohe.fruehjahr_sommer_2012 = 1
           OR agohe.fruehjahr_sommer_2013 = 1
           OR agohe.fruehjahr_sommer_2014 = 1
           OR agohe.season_fs15           = 1
           OR agohe.fs_basisartikel       = 1
         THEN 1 ELSE 0 END AS season_spring_summer,
    CASE WHEN agohe.ganzjaehriger_basisartikel = 1
           OR agohe.hw_basisartikel = 1
           OR agohe.fs_basisartikel = 1
           OR agohe.basisartikel    = 1
         THEN 1 ELSE 0 END AS basic_article
FROM
(SELECT
	aiohe.article_id,
	MAX(aiohe.herbst_winter_2014) AS herbst_winter_2014,
	MAX(aiohe.season_fs15) AS season_fs15,
	MAX(aiohe.herbst_winter_2013) AS herbst_winter_2013,
	MAX(aiohe.fruehjahr_sommer_2013) AS fruehjahr_sommer_2013,
	MAX(aiohe.herbst_winter_2012) AS herbst_winter_2012,
	MAX(aiohe.ganzjaehriger_basisartikel) AS ganzjaehriger_basisartikel,
	MAX(aiohe.fruehjahr_sommer_2012) AS fruehjahr_sommer_2012,
	MAX(aiohe.fruehjahr_sommer_2014) AS fruehjahr_sommer_2014,
	MAX(aiohe.basisartikel) AS basisartikel,
	MAX(aiohe.hw_basisartikel) AS hw_basisartikel,
	MAX(aiohe.herbst_winter_2011) AS herbst_winter_2011,
	MAX(aiohe.fs_basisartikel) AS fs_basisartikel,
	MAX(aiohe.fruehjahr_sommer_2011) AS fruehjahr_sommer_2011,
	MAX(aiohe.herbst_winter_2010) AS herbst_winter_2010,
	MAX(aiohe.herbst_winter_2009) AS herbst_winter_2009,
	MAX(aiohe.fruehjahr_sommer_2010) AS fruehjahr_sommer_2010,
	MAX(aiohe.fruehjahr_sommer_2009) AS fruehjahr_sommer_2009
FROM
 (SELECT
    a.article_id,
    CASE WHEN asi.attribute_identifier = 'herbst_winter_2014' THEN 1 ELSE 0 END AS herbst_winter_2014,
    CASE WHEN asi.attribute_identifier = 'season_fs15' THEN 1 ELSE 0 END AS season_fs15,
    CASE WHEN asi.attribute_identifier = 'herbst_winter_2013' THEN 1 ELSE 0 END AS herbst_winter_2013,
    CASE WHEN asi.attribute_identifier = 'fruehjahr_sommer_2013' THEN 1 ELSE 0 END AS fruehjahr_sommer_2013,
    CASE WHEN asi.attribute_identifier = 'herbst_winter_2012' THEN 1 ELSE 0 END AS herbst_winter_2012,
    CASE WHEN asi.attribute_identifier = 'ganzjaehriger_basisartikel' THEN 1 ELSE 0 END AS ganzjaehriger_basisartikel,
    CASE WHEN asi.attribute_identifier = 'fruehjahr_sommer_2012' THEN 1 ELSE 0 END AS fruehjahr_sommer_2012,
    CASE WHEN asi.attribute_identifier = 'fruehjahr_sommer_2014' THEN 1 ELSE 0 END AS fruehjahr_sommer_2014,
    CASE WHEN asi.attribute_identifier = 'basisartikel' THEN 1 ELSE 0 END AS basisartikel,
    CASE WHEN asi.attribute_identifier = 'hw_basisartikel' THEN 1 ELSE 0 END AS hw_basisartikel,
    CASE WHEN asi.attribute_identifier = 'herbst_winter_2011' THEN 1 ELSE 0 END AS herbst_winter_2011,
    CASE WHEN asi.attribute_identifier = 'fs_basisartikel' THEN 1 ELSE 0 END AS fs_basisartikel,
    CASE WHEN asi.attribute_identifier = 'fruehjahr_sommer_2011' THEN 1 ELSE 0 END AS fruehjahr_sommer_2011,
    CASE WHEN asi.attribute_identifier = 'herbst_winter_2010' THEN 1 ELSE 0 END AS herbst_winter_2010,
    CASE WHEN asi.attribute_identifier = 'herbst_winter_2009' THEN 1 ELSE 0 END AS herbst_winter_2009,
    CASE WHEN asi.attribute_identifier = 'fruehjahr_sommer_2010' THEN 1 ELSE 0 END AS fruehjahr_sommer_2010,
    CASE WHEN asi.attribute_identifier = 'fruehjahr_sommer_2009' THEN 1 ELSE 0 END AS fruehjahr_sommer_2009
FROM bi.article AS a
LEFT JOIN ml.article_attribute AS aa
	ON a.article_id = aa.article_id
LEFT JOIN ml.attribute_season AS asi
	ON asi.attribute_id = aa.attribute_id) AS aiohe
GROUP BY aiohe.article_id) AS agohe
ORDER BY article_id ASC


