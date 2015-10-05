-- Name: raw.preview_articles
-- Created: 2015-04-24 18:17:44
-- Updated: 2015-04-24 18:17:44

CREATE VIEW raw.preview_articles
AS
SELECT
	p.id as preview_id,
	pp.id as preview_position_id,
	pp.article_id,
	a.model_id as article_model_id,
	pp.group_id as outfit_id,
	p.name as preview_name,
	p.date_created,
	pp.preview_positions_idx as article_count
FROM postgres.preview p 
JOIN postgres.preview_position pp on pp.preview_id = p.id
JOIN postgres.article a on a.id = pp.article_id
WHERE p.class = 'com.ps.customer.preview.Preview'


