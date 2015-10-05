-- Name: tableau.accounting_order_report_weekly_ch_correction
-- Created: 2015-04-24 18:23:28
-- Updated: 2015-08-07 14:00:23

CREATE VIEW tableau.accounting_order_report_weekly_ch_correction
AS
SELECT 
	op.order_id,
	co.customer_id,
	co.invoice_date_created,
	co.date_shipped,
	co.date_created,
	cu.date_created as customer_date_created,
	co.shipping_country,
	co.vat_percentage,
	co.currency_code,
    co.box_type,
	co.total_amount_billed_discount_euro,
	co.total_goodwill_credit_euro,
    co.total_amount_paid_euro,
	co.order_type,
	co.date_payed,
    co.date_picked,
	co.payment_method,
	co.date_returned,
	co.first_saleschannel_completed,
	ret.return_rate_3_weeks,
	op.articles_sent,
	op.articles_sent_os,
	op.articles_sent_ps,
	op.articles_kept,
	op.articles_kept_os,
	op.articles_kept_ps,
	op.total_basket_purchase_price,
	op.total_amount_basket_purchase_gross_patner,
	op.total_amount_basket_purchase_gross_own,
	op.total_basket_retail_price,
	op.total_amount_basket_retail_gross_patner,
	op.total_amount_basket_retail_gross_own,
	op.retoure_value_purchase_price,
	op.return_purchase_gross_patner,
	op.return_purchase_gross_own,
	op.retoure_value,
	op.return_retail_gross_patner,
	op.return_retail_gross_own,
	op.gross_lost_purchase,
	op.gross_lost_purchase_patner,
	op.gross_lost_purchase_own,
	op.gross_lost_retail,
	op.gross_lost_retail_patner,
	op.gross_lost_retail_own,
	arv.paid_to_arvato,
	arv.arvato_paid_date,
/*Campaign Details*/
  ca.code as campaign_code,
  ca.campaign_title,
  ca.currency as campaign_currency,
/*Stylist Information*/
  	sty."Name" as stylist_name,
  	sty.user_role
FROM views.customer_order co
LEFT JOIN views.customer cu on cu.customer_id=co.customer_id
/*Order Position KPI's*/
INNER JOIN 
(
	SELECT 
		op.order_id,
		/*Articles Sent*/
		count(DISTINCT CASE WHEN op.state>= '128' AND op.state<2048 then op.id else null end) as "articles_sent",
		count(DISTINCT CASE WHEN stock_location_id = 2 AND op.state>= '128' AND op.state<2048 then op.id else null end) as "articles_sent_os",
		count(DISTINCT CASE WHEN stock_location_id <> 2 AND op.state>= '128' AND op.state<2048 then op.id else null end) as "articles_sent_ps",
		/*Article Kept*/
		count(DISTINCT CASE WHEN op.state=1024 then op.id else null end) as "articles_kept",
		count(DISTINCT CASE WHEN stock_location_id = 2 AND op.state=1024 then op.id else null end) as "articles_kept_os",
		count(DISTINCT CASE WHEN stock_location_id <> 2 AND op.state= 1024 then op.id else null end) as "articles_kept_ps",
		/*Basket Purchase Price*/
		SUM(CASE WHEN op.state>=16 AND op.state<2048 then quantity*op.purchase_price else 0 end) total_basket_purchase_price,
		SUM(CASE WHEN stock_location_id <> 2 AND op.state>=16 AND op.state<2048 then quantity*op.purchase_price else 0 end)  as total_amount_basket_purchase_gross_patner,
		SUM(CASE WHEN stock_location_id = 2 AND op.state>=16 AND op.state<2048 then quantity*op.purchase_price else 0 end) as total_amount_basket_purchase_gross_own,
		/*basket Retail Price*/
		SUM(CASE WHEN op.state>=16 AND op.state<2048 then quantity*op.retail_price_euro else 0 end) total_basket_retail_price,
		SUM(CASE WHEN stock_location_id <> 2 AND op.state>=16 AND op.state<2048 then quantity*op.retail_price_euro else 0 end) as total_amount_basket_retail_gross_patner,
		SUM(CASE WHEN stock_location_id = 2 AND op.state>=16 AND op.state<2048 then quantity*op.retail_price_euro else 0 end) as total_amount_basket_retail_gross_own,
		/*Return Purchase Price*/
		SUM(CASE WHEN op.state=512 then quantity*op.purchase_price else 0 end) retoure_value_purchase_price,
		SUM(CASE WHEN stock_location_id <> 2 AND op.state=512 then quantity*op.purchase_price else 0 end)  as return_purchase_gross_patner,
		SUM(CASE WHEN stock_location_id = 2 AND op.state=512 then quantity*op.purchase_price else 0 end) as return_purchase_gross_own,
		/*Return Retail Price*/
		SUM(CASE WHEN op.state=512 then quantity*op.retail_price_euro else 0 end) retoure_value,
		SUM(CASE WHEN stock_location_id <> 2 AND op.state=512 then quantity*op.retail_price_euro else 0 end) as return_retail_gross_patner,
		SUM(CASE WHEN stock_location_id = 2 AND op.state=512 then quantity*op.retail_price_euro else 0 end) as return_retail_gross_own,
		/*Lost Purchase Price*/
		SUM(CASE WHEN op.state=1536 then op.quantity*op.purchase_price else 0 end) gross_lost_purchase,
		SUM(CASE WHEN stock_location_id <> 2 AND op.state=1536 then op.quantity*op.purchase_price else 0 end)  as gross_lost_purchase_patner,
		SUM(CASE WHEN stock_location_id = 2 AND op.state=1536 then op.quantity*op.purchase_price else 0 end) as gross_lost_purchase_own,
		/*Lost Retail Price*/
		SUM(CASE WHEN op.state=1536 then op.quantity*op.retail_price_euro else 0 end) gross_lost_retail,
		SUM(CASE WHEN stock_location_id <> 2 AND op.state=1536 then op.quantity*op.retail_price_euro else 0 end) as gross_lost_retail_patner,
		SUM(CASE WHEN stock_location_id = 2 AND op.state=1536 then op.quantity*op.retail_price_euro else 0 end) as gross_lost_retail_own
		FROM views.order_position op
		GROUP BY 1
)op on op.order_id=co.id
/*Return Rate Per Country*/
LEFT JOIN
(
	SELECT 
	shipping_country,
	CASE 
		WHEN shipping_country in('SE','DK','BE','LU') then 0.75
                WHEN shipping_country='CH' then 0.70 
		else return_rate_3_weeks 
	end as return_rate_3_weeks 
	FROM(
			SELECT 
			shipping_country, 
			CASE WHEN total_basket_retail_price=0 then 0 
			else return_retail_price/total_basket_retail_price 
			end as return_rate_3_weeks 
			FROM(
				SELECT
					co.shipping_country,
					SUM(CASE WHEN op.state=512 then quantity*op.retail_price_euro else 0 end) return_retail_price,
					SUM(CASE WHEN co.state=1024 AND op.state<=1024 then quantity*op.retail_price_euro else 0 end) total_basket_retail_price
				FROM views.order_position op
				INNER JOIN views.customer_order co on co.id=op.order_id
				WHERE cast(co.invoice_date_created as date)>=timestampadd(sql_tsi_month,-3,timestampadd(sql_tsi_day,-14,curdate())) AND
				cast(co.invoice_date_created as date)<=timestampadd(sql_tsi_day,-14,curdate())
			GROUP BY 1)
		a)
b)ret on ret.shipping_country=co.shipping_country
LEFT JOIN
(
	SELECT 
		ordernumber,
		sum(amount) as paid_to_arvato,
		max(cast(date_created as date)) as arvato_paid_date
	FROM views.arvatopayments
	group by 1
)arv on arv.ordernumber=co.id
LEFT JOIN views.campaign ca on ca.id=co.campaign_id
LEFT JOIN views.stylist sty on sty.stylist_id=co.stylelist_id
WHERE cast(co.invoice_date_created as date)>='2014-01-01' AND
co.order_state='Real Order' AND co.state<=1024


