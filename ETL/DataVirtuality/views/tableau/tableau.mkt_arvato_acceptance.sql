-- Name: tableau.mkt_arvato_acceptance
-- Created: 2015-06-29 10:14:30
-- Updated: 2015-06-29 11:16:38

CREATE VIEW tableau.mkt_arvato_acceptance
AS
SELECT 
    CAST(co.date_created as date) as date_incoming,
	co.shipping_country,
	CASE
		WHEN at.marketing_channel is null THEN 'Untracked'
		ELSE at.marketing_channel
	END AS marketing_channel, 
	cu.customer_age,
	co.arvato_result,
	SUM(CASE 
		WHEN at.marketing_channel is null THEN 1
		ELSE at.contact_weight
	END) AS weight
FROM bi.marketing_order_attribution at
FULL JOIN bi.customer_order co ON at.order_id = co.order_id
LEFT JOIN bi.customer cu ON co.customer_id = cu.customer_id
WHERE co.shipping_country IN ('DE', 'AT', 'CH', 'NL')
AND co.order_type = 'First Order'
GROUP BY 1,2,3,4,5


