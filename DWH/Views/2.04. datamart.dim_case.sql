CREATE OR REPLACE VIEW datamart.dim_case
AS

WITH c_order AS 
(
		SELECT 
		RANK() OVER(PARTITION BY op.customer_id ORDER BY op.date_opportunity_created DESC) AS "opportunity_rank", 
		op.opportunity_id, 
		op.customer_id, 
		co.parent_order_id, 
		op.date_opportunity_created, 
		co.date_order_created, 
		op.date_opportunity_cancelled, 
		co.date_completed, 
		cu.date_of_birth, 
		op.region, 
		op.shipping_country, 
		op.shipping_city, 
		op.shipping_zip 
	FROM datamart.dim_opportunity op 
	LEFT JOIN datamart.dim_order co on co.order_id=op.opportunity_id 
	LEFT JOIN stage.v_dim_customer cu on cu.customer_id=op.customer_id	
	)

SELECT

	ac.case_id,
	a.customer_id,
	ac.case_no,
		 
	d.region,
	d.shipping_country,	
	d.shipping_city,	
	d.shipping_zip,
	
	CASE
		WHEN a.date_completed IS NOT NULL THEN 'Closed'	
		WHEN a.date_opportunity_cancelled IS NULL AND a.date_order_created IS NULL THEN 'Open Opportunity'
		WHEN (a.date_completed IS NULL OR a.date_opportunity_cancelled IS NULL) AND a.date_order_created IS NOT NULL THEN 'Open Order' 
		WHEN c.nb_orders=c.nb_cancel_orders OR a.date_opportunity_cancelled IS NOT NULL THEN 'Cancelled'
	END AS case_status,
	
	CASE 
		WHEN ac.case_no=1 then 'First Case'	
		ELSE 'Repeat Case'	
	END AS case_type,
	 
	CASE	 
		WHEN c.nb_orders=c.nb_cancel_orders THEN 'Cancelled'	
		ELSE 'Not Cancelled'	
	END AS cancellation_status,
	 
	ac.case_date_created as date_case_created,
	
	extract(year from age(cast(a.date_of_birth as date),cast(ac.case_date_created as date))) as customer_age_order_time, 
	 
	CASE 
		WHEN e.parent_order_id IS NOT NULL or a.parent_order_id IS NOT NULL THEN 1 
		ELSE 0	
	END AS has_followon_order, 
	 
	CASE	 
		WHEN a.parent_order_id IS NOT NULL THEN 1	
		ELSE 0	
	END AS is_followon_order
	
FROM c_order a
LEFT JOIN stage.v_dim_case ac on ac.order_id=a.opportunity_id 
/*This join gets number of orders created and cancelled*/	
LEFT JOIN	 
(	
 SELECT	 
	customer_id,	
	count(*) AS nb_orders,	
	COUNT(DISTINCT case when date_opportunity_cancelled IS NULL then opportunity_id else null end) nb_cancel_orders 
 FROM c_order	
 GROUP BY 1
)c on c.customer_id=a.customer_id 
	
LEFT JOIN	
(	
 SELECT	
	customer_id, 
	region, 
	shipping_country, 
	shipping_city, 
	shipping_zip 
 FROM c_order 
 WHERE opportunity_rank=1
 GROUP BY 1,2,3,4,5
)d on d.customer_id=a.customer_id

LEFT JOIN	
(	
	SELECT	 
		distinct c_2.parent_order_id	
	FROM c_order c_2	
	GROUP BY 1
)e ON e.parent_order_id=a.opportunity_id