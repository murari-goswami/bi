-- Name: tableau.bisdev_big_size_cg4_analysis
-- Created: 2015-05-04 17:51:05
-- Updated: 2015-05-04 17:51:05

CREATE view tableau.bisdev_big_size_cg4_analysis
AS

SELECT 
	coalesce(a.commodity_group4,sa.cat2) as commodity_group4,
	a.article_size,
	count(case when op.state>=16 and op.state<2048 then op.id else null end) as shipped_items,
	count(case when op.state=1024 then op.id else null end) as kept_items
FROM views.order_position op
LEFT JOIN views.article a on a.article_id=op.article_id
LEFT JOIN views.supplier_article_categories sa on sa.supplier_article_id=op.supplier_article_id
WHERE CAST(op.date_shipped as date)>=timestampadd(sql_tsi_week,-4,curdate())
group by 1,2


