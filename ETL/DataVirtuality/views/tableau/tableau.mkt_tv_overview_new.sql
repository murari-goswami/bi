-- Name: tableau.mkt_tv_overview_new
-- Created: 2015-04-24 18:26:36
-- Updated: 2015-08-07 10:48:28

CREATE VIEW tableau.mkt_tv_overview_new
AS
SELECT
    c.date,
    x.country,
	ab.incoming_orders_attributed,
	ab.invoiced_orders_attributed,
	ab.biling_total_attributed,
	ab.sales_sent_attributed,
	ab.sales_kept_attributed,
    ab.incoming_orders_total,
    ab.invoiced_orders_total,
	ab.sales_sent_total,
	ab.sales_kept_total,
	ab.billing_total,
    mc.costs
FROM dwh.calendar c 
CROSS JOIN (SELECT country FROM dwh.marketingcost GROUP BY 1) x
LEFT JOIN
(
	SELECT 
		cast(datecreated as date) as "date", 
		country, 
		sum(cast(costs as decimal))  as costs
	FROM "dwh.marketingcost"
	WHERE channel like 'TV%'
	GROUP BY 1,2
) mc ON cast(mc.date as date) = c.date AND mc.country = x.country
LEFT JOIN
(
		SELECT 
		cast(co.date_incoming as date) as "date",
		co.shipping_country,
		SUM(at.contact_weight) as incoming_orders_attributed,
		SUM(CASE WHEN co.date_invoiced is not null AND co.order_state_number >= 16 THEN ROUND(at.contact_weight,2) ELSE 0 END) as invoiced_orders_attributed,
		ROUND(SUM(at.contact_weight*co.sales_sent),2) as sales_sent_attributed,
      	ROUND(SUM(at.contact_weight*co.sales_kept),2) as sales_kept_attributed,
      	ROUND(SUM(at.contact_weight*co.billing_total),2) as biling_total_attributed,
		COUNT(co.order_id) as incoming_orders_total,
		SUM(CASE WHEN co.date_invoiced is not null AND co.order_state_number >= 16 THEN 1 ELSE 0 END) as invoiced_orders_total,
		SUM(co.sales_sent) as sales_sent_total,
		SUM(co.sales_kept) as sales_kept_total,
		SUM(co.billing_total) as billing_total
	FROM bi.customer_order co
	RIGHT JOIN
	(
		SELECT
		cast(cd.contact_timestamp as date) as "date",
		cd.order_id,
		cd.contact_weight
		FROM bi.marketing_order_attribution cd 
		WHERE cd.marketing_channel = 'TV'	
	) at ON at.order_id = co.order_id
	WHERE date_incoming is not null
	GROUP BY 1,2
) ab ON ab.shipping_country = x.country AND c.date=ab.date
WHERE c.date > '2014'
AND c.date < CURDATE()


