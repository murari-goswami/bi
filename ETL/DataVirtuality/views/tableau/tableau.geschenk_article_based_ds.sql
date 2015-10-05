-- Name: tableau.geschenk_article_based_ds
-- Created: 2015-05-05 09:28:52
-- Updated: 2015-05-05 09:28:52

CREATE VIEW tableau.geschenk_article_based_ds
AS

select 
	op.order_id,
	co.customer_id,
	co.payment_method,
	co.shipping_country,
	co.date_created,
	co.shipping_city,
	co.total_amount_basket_retail_gross,
	co.total_amount_billed_retail_gross,
	co.total_amount_payed,
	co.info_picagerange,
	co.info_pictypicalstyle,
	co.info_picclothwork,
	co.customer_age,
	co.follow_on_count,
	co.real_repeat_order_count,
	co.sales_channel,
	co.state,
	a.article_brand,
	a.commodity_group1,
	a.commodity_group2,
	a.commodity_group3,
	a.commodity_group4,
	a.commodity_group5,
	a.price_retail_de,
	a.purchase_price,
	case
	 	when co.real_repeat_order_count= '1' then 'first order'
	  when co.real_repeat_order_count is null then 'follow on order'
	  else 'real repeat'
	end as order_typ,
	timestampdiff(SQL_TSI_DAY,co.date_shipped,co.date_returned) as days_shipped_returned,
	sfo.arvatoStatus__c,
	sfo.NewCardrecommendation__c,
	sfo.NoCall_Box__c,
	md.marketing_channel,
	ad.arvatoscore,
	sty."Name",
	cast(c.first_order_date as date) as first_order_date,
	sfa.CustomerStatus__c,
	sfa.BMI__c,
	sfa.Outfittery_Club_Mitglied__c,
	a2.*,
	op2.*
from views.order_position op
left join views.article a on a.supplier_article_id = op.supplier_article_id
left join views.customer_order co on co.id = op.order_id
left join views.salesforce_opportunity sfo on sfo.ExternalOrderId__c = op.order_id
left join views.marketing_order md on md.order_id = op.order_id
left join views.additional_order_information ad on ad.order_id = op.order_id
left join views.stylist sty on sty.stylist_id=co.stylelist_id
inner join views.customer c on c.customer_id = co.customer_id
left join views.salesforce_account sfa on sfa.ExternalCustomerId__c = co.customer_id
inner join
(
	select 
		op.order_id as op2_order_id,
		avg(case when op.preview_id is null then 1 else 0 end) as has_preview,
		sum(case when op.state in (512, 1024, 1536) and op.date_shipped is not null then quantity else 0 end) as anzahl_artikel_verschickt,
		sum(case when  op.state=1024 and date_shipped is not null then  quantity else 0 end) as anzahl_artikel_verschickt_behalten, 
		sum(case when op.state in (512, 1024, 1536) and op.date_shipped  is not null then op.retail_price_euro else Null end) as gross_basket,
		sum(case when  op.state=1024 and op.date_shipped  is not null then op.retail_price_euro else 0 end) as net_basket, 
		round(((sum(case when op.state in (512, 1024, 1536) and op.date_shipped  is not null then op.retail_price_euro else Null end))-(sum(case when  op.state=1024 and op.date_shipped  is not null then op.retail_price_euro else 0 end)))/(sum(case when op.state in (512, 1024, 1536) and op.date_shipped  is not null then op.retail_price_euro else Null end) ),2) as rq_value,
		round((sum(case when op.state in (512, 1024, 1536) and op.date_shipped is not null then cast(quantity as bigdecimal) else null end)-(sum(case when  op.state=1024 and date_shipped is not null then cast(quantity as bigdecimal) else null end)))/(sum(case when op.state in (512, 1024, 1536) and op.date_shipped is not null then cast (quantity as bigdecimal) else Null end)),2)as rq_item
	from views.order_position op
	where cast(date_shipped as date)>='2013-07-01'
	group by op.order_id
) op2 on op.order_id = op2.op2_order_id
inner join 
(
	select 
		a.a2_order_id,
		count(case when ( a.article_ean ='2009876543503' or a.article_ean='2009876543510') then '1' else Null end) as geschenk_box,
		count(case when  a.article_ean ='2009876543503' then 1 else Null end) as geschenk_box_2009876543503, 
		count(case when  a.article_ean ='2009876636489' then 1 else Null end) as geschenk_box_2009876636489, 
		count(case when  a.article_ean ='2009876543527' then 1 else Null end) as geschenk_box_2009876543527, 
		count(case when  a.article_ean ='2009876543534' then 1 else Null end) as geschenk_box_2009876543534,  
		count(case when  a.article_ean ='2009876543510' then 1 else Null end) as geschenk_box_2009876543510
	from
	(
		select 
			op.order_id as a2_order_id, 
			article_ean
		from views.order_position op 
		inner join views.article a on a.supplier_article_id=op.supplier_article_id ) a 
		group by a2_order_id
	)a2 on a2.a2_order_id=op.order_id
where co.state!=2048 and co.date_shipped >= '2014-08-27'


