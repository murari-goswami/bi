CREATE OR REPLACE VIEW datamart.dim_opportunity
AS

SELECT 

	co.order_id as opportunity_id,
	dc.case_id,
	co.customer_id,
	--cos.ops_check,
	
	/*Address Details*/
	co.region,
	co.shipping_city,
	co.shipping_country,
	co.shipping_zip,

	CASE 
		WHEN co.date_stylist_picked IS NOT NULL THEN 'Converted'
		WHEN co.order_state=2048 OR co.date_cancelled IS NOT NULL THEN 'Cancelled'
		ELSE 'Open'
	END as status_opportunity,

	co.order_type as opportunity_type,
	co.box_type as sales_channel_1,
	
	REPLACE(REPLACE(REPLACE(REPLACE(co.sales_channel,'WithoutDate',''),'WithDate',''),'WithCall',''),'WithoutCall','') as sales_channel_2,
	
	co.payment_type,
	co.date_created as date_opportunity_created,
	
	CASE
	/* Orders with sales_channel = 'website' and websiteWithoutDateAndPendingConfirmation are not real orders, hence exclude date_created should be set to null */ 
		WHEN (co.sales_channel = 'website' AND co.order_state in (/*'Incoming', 'Cancelled'*/2048) AND NOT (co.date_preview_created is not null))
		OR co.sales_channel = 'websiteWithoutDateAndPendingConfirmation' THEN null
		WHEN co.sales_channel = 'website' AND co.date_preview_created > co.date_created THEN co.date_preview_created
		WHEN CAST(co.date_created as date)<'2015-07-21' THEN COALESCE(cod.date_incoming, co.date_created)
		WHEN CAST(co.date_created as date)>='2015-07-21' THEN co.date_created
	END date_opportunity_incoming,
	
	CASE WHEN cod.date_incoming IS NOT NULL OR cod.date_incoming_no_call IS NOT NULL THEN 1 ELSE 0 END AS opportunity_confirmed,
	CASE WHEN co.date_stylist_picked IS NULL THEN co.date_cancelled END as date_opportunity_cancelled,
	CASE WHEN co.date_stylist_picked IS NULL THEN co.cancellation_reason END AS opportunity_cancellation_reason

FROM stage.v_dim_customer_order co
--LEFT JOIN stage.customer_order_salesforce cos ON cos.order_id=co.order_id
LEFT JOIN stage.v_fact_customer_order_details__audit_log cod on cod.order_id = co.order_id
LEFT JOIN stage.v_dim_case dc on dc.order_id=co.order_id