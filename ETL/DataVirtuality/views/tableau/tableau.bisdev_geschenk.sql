-- Name: tableau.bisdev_geschenk
-- Created: 2015-05-06 10:27:30
-- Updated: 2015-05-12 17:53:44

CREATE VIEW tableau.bisdev_geschenk
AS

select

	co.order_id,
	co.customer_id,
	co.date_created,
	co.date_shipped,
	co.payment_type,
	co.shipping_country,
	co.shipping_city,
	co.billing_total,
	co.follow_on_count,
	co.real_order_count,
	co.sales_channel,
	co.order_state_number,
	co.preview_id,
	co.sales_sent as total_amount_basket_retail_gross,
	co.billing_total as total_amount_billed_retail_gross,
	CASE
		WHEN co.order_type = 'First Order' THEN 'First Order'
		WHEN co.order_type in ('Repeat Order', 'Outfittery Club Order') THEN 'Repeat Order'
		WHEN co.order_type in ('First Order Follow-on', 'Repeat Order Follow-on') THEN 'Follow-on'
	END as order_type,
	timestampdiff(SQL_TSI_DAY,co.date_shipped,co.date_returned) as days_shipped_returned,
	co.arvato_score as arvatoscore,
	co.box_type,
	sty.stylist,

	cu.customer_age,
	cast(f.first_order_date as date) as first_order_date,
	cu.club_membership_type,
	
	sfo.arvato_status,
	sfo.newcardrecommendation,
	sfa.customer_status,
	sfa.bmi,

	op.articles_sent,
	op.articles_kept,
	op.articles_returned,
	op.sales_sent,
	op.sales_kept,
	op.sales_returned,
	op.geschenk_box,
	op.geschenk_box_2009876543503,
	op.geschenk_box_2009876636489,
	op.geschenk_box_2009876543527,
	op.geschenk_box_2009876543534,
	op.geschenk_box_2009876543510,
	op.geschenk_box_2009876543497,
	op.geschenk_retourniert,

	md.marketing_channel,

	a.article_brand,
	a.article_commodity_group1,
	a.article_commodity_group2,
	a.article_commodity_group3,
	a.article_commodity_group4,
	a.article_commodity_group5,
	a.article_sales_price_de as price_retail_de,
	a.article_cost as purchase_price

FROM bi.customer_order_articles o
LEFT JOIN bi.customer_order co ON o.order_id=co.order_id
LEFT join bi.customer cu on cu.customer_id = co.customer_id
LEFT JOIN bi.article a on a.article_id=o.article_id
LEFT JOIN bi.customer_order_salesforce sfo on sfo.order_id = co.order_id
LEFT JOIN raw.customer_salesforce sfa on sfa.customer_id = co.customer_id
left join bi.stylist sty on sty.stylist_id=co.stylist_id
LEFT JOIN views.arvatoresults arv on co.order_id=arv.order_id
left join views.marketing_order md on md.order_id = co.order_id
JOIN(
	SELECT 
		coa.order_id,
		SUM(coa.articles_sent) AS articles_sent,
		SUM(coa.articles_kept) AS articles_kept,
		SUM(coa.articles_returned) AS articles_returned,
		SUM(coa.sales_sent) AS sales_sent,
		SUM(coa.sales_kept) AS sales_kept,
		SUM(coa.sales_returned) AS sales_returned,
		             		            		/*Geschenk Articles*/
		count(case when  art.article_ean in ('2009876543503','2009876543510') and coa.order_article_state_number < 2048 then '1' else Null end) as geschenk_box,
		count(case when  art.article_ean ='2009876543503' and coa.order_article_state_number < 2048 then 1 else Null end) as geschenk_box_2009876543503,
		count(case when  art.article_ean ='2009876636489' and coa.order_article_state_number < 2048 then 1 else Null end) as geschenk_box_2009876636489,
		count(case when  art.article_ean ='2009876543527' and coa.order_article_state_number < 2048 then 1 else Null end) as geschenk_box_2009876543527,
		count(case when  art.article_ean ='2009876543534' and coa.order_article_state_number < 2048 then 1 else Null end) as geschenk_box_2009876543534,   
		count(case when  art.article_ean ='2009876543510' and coa.order_article_state_number < 2048 then 1 else Null end) as geschenk_box_2009876543510,
		count(case when  art.article_ean ='2009876543497' and coa.order_article_state_number < 2048 then 1 else Null end) as geschenk_box_2009876543497,
		count(case when  art.article_ean in ('2009876543503','2009876543510','2009876543527','2009876636489','2009876543534','2009876543497') and coa.order_article_state_number = 512 
		then 1 else Null end) as geschenk_retourniert
	FROM bi.customer_order_articles coa
	LEFT JOIN bi.article art on art.article_id=coa.article_id
	GROUP BY 1
)op ON op.order_id=co.order_id
LEFT JOIN 
(
	SELECT 
		co.customer_id,
		min(co.date_created) as first_order_date,
		min(CASE WHEN co.order_state = 'Completed' THEN co.date_created ELSE null END) as first_order_date_completed
	FROM bi.customer_order co 
	GROUP BY 1
) f on f.customer_id = co.customer_id
WHERE co.order_state_number<>2048 
AND CAST(co.date_shipped as date) >= '2014-08-27'


