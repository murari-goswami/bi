-- Name: tableau.mkt_insert_campaign_development
-- Created: 2015-08-18 10:15:46
-- Updated: 2015-08-18 10:15:46

CREATE VIEW tableau.mkt_insert_campaign_development
AS

SELECT
	mc.marketing_campaign,
	de.cluster,
	de.country,
	de.campaign_type,
	CAST(mi.date_first_order as date) as date_first_order,
	cn.total_orders,
	TIMESTAMPDIFF(SQL_TSI_DAY,mi.date_first_order,co.date_incoming) as days_since_first_order,
	COUNT(co.order_id) as order_count
	FROM raw.marketing_contacts_discounts mc
LEFT JOIN bi.customer_order co ON mc.order_id = co.order_id
LEFT JOIN raw.marketing_voucher_campaign_details de ON de.campaign_title = LTRIM(RTRIM(mc.marketing_campaign))
LEFT JOIN
(
SELECT 
	mc.marketing_campaign,
	MIN(co.date_incoming) as date_first_order
FROM raw.marketing_contacts_discounts mc
LEFT JOIN bi.customer_order co ON mc.order_id = co.order_id
GROUP BY 1
) mi ON mi.marketing_campaign = mc.marketing_campaign
LEFT JOIN
(
SELECT
marketing_campaign,
COUNT(order_id) as total_orders
FROM raw.marketing_contacts_discounts
GROUP BY 1
) cn ON cn.marketing_campaign = mc.marketing_campaign
WHERE mc.marketing_channel = 'Inserts'
GROUP BY 1,2,3,4,5,6,7


