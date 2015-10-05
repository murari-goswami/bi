-- Name: tableau.ios_performance
-- Created: 2015-09-30 17:45:18
-- Updated: 2015-10-01 09:08:42

CREATE VIEW "tableau.ios_performance" 
AS

SELECT
co_1.*,
vi.visits,
av.app_installs
FROM 
(
		SELECT		
		CAST(co.date_created AS DATE) as date_created,
		CASE
			WHEN co.sales_channel IN('appWithDate','appWithoutDate','miniAppWithDate','miniAppWithDate','miniApp','app')
			THEN 'App'
			ELSE 'Desktop'
		END AS app_type,
		COUNT(DISTINCT co.order_id) AS nb_order,
		COUNT(DISTINCT CASE WHEN co.date_invoiced is not null then co.order_id end) AS nb_order_invoiced,
		SUM(co.sales_sent) as sales_sent,
		SUM(co.sales_kept) as sales_kept,
		SUM(co.sales_sent)/
			COUNT(DISTINCT CASE WHEN co.date_invoiced is not null then co.order_id end) as avg_sales_sent,
		SUM(co.sales_kept)/
			COUNT(DISTINCT CASE WHEN co.date_invoiced is not null then co.order_id end) as avg_sales_kept,
		COUNT(DISTINCT CASE WHEN co.box_type='Call Box' THEN co.order_id END) AS nb_order_call,
		COUNT(DISTINCT CASE WHEN co.box_type='No Call Box' THEN co.order_id END) AS nb_order_no_call,
		COUNT(DISTINCT CASE WHEN co.date_invoiced is not null and co.box_type='Call Box' then co.order_id end) AS nb_order_invoiced_call,
		COUNT(DISTINCT CASE WHEN co.date_invoiced is not null and co.box_type='No Call Box' then co.order_id end) AS nb_order_invoiced_nocall,
		COUNT(DISTINCT CASE WHEN co.box_type='Call Box' THEN co.sales_sent END) AS sales_sent_call,
		COUNT(DISTINCT CASE WHEN co.box_type='No Call Box' THEN co.sales_sent END) AS sales_sent_no_call,
		COUNT(DISTINCT CASE WHEN co.box_type='Call Box' THEN co.sales_kept END) AS sales_kept_call,
		COUNT(DISTINCT CASE WHEN co.box_type='No Call Box' THEN co.sales_kept END) AS sales_kept_no_call
		FROM bi.customer_order co
		GROUP BY 1,2
)co_1
LEFT JOIN 
(
	SELECT 
    	date_created,
    	CAST('Desktop' AS string) as app_type,
    	SUM(visits) as visits 
  	FROM "bi.marketing_funnel_by_date_domain_channel_device"
  	GROUP BY 1,2
)vi on vi.date_created=CAST(co_1.date_created AS DATE) AND vi.app_type=co_1.app_type
LEFT JOIN
(
	SELECT
		CAST(date_created as date) as date_created,
		CAST('App' AS string) AS app_type,
		SUM(installs) as app_installs
	FROM dwh.appdownloads
	GROUP BY 1,2
)av on av.date_created=CAST(co_1.date_created AS DATE) AND av.app_type=co_1.app_type


