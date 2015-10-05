CREATE OR REPLACE VIEW datamart.dim_order
AS

SELECT

	co.order_id,
	dc_1.case_id,
	co.customer_id,
	co.parent_order_id,
	co.payment_type,

	co.region,
	co.shipping_city,
	co.shipping_country,
	co.shipping_zip,

	/*Order Process/Status*/
	CASE 
		WHEN fo.billing_total<=fo.billing_received THEN 'Settled'
		ELSE 'Open'
	END AS status_balance,

	CASE
		WHEN fo.items_b4_ret=fo.items_returned THEN 'Full'
		WHEN fo.items_b4_ret<>fo.items_returned AND fo.items_returned > 0 THEN 'Partial'
		WHEN fo.items_b4_ret = fo.items_kept  THEN 'No'
		ELSE 'Open'
	END AS status_returns,

	CASE
		WHEN fo.items_b4_can=fo.items_cancelled THEN 'Full'
		WHEN fo.items_cancelled>=1 THEN 'Partial'
		ELSE 'No'
	END AS status_cancellation,

	co.order_type,
	co.box_type as sales_channel_1,
	REPLACE(REPLACE(REPLACE(REPLACE(sales_channel,'WithoutDate',''),'WithDate',''),'WithCall',''),'WithoutCall','') as sales_channel_2,
  
	op.date_opportunity_created,
	op.date_opportunity_incoming,
	co.date_stylist_picked as date_order_created,
	co.date_invoiced, /*it takes last article picked date in case date_invoiced is null in shipment confirmation)*/
	co.date_shipped,
	co.date_returned,
	dc.date_completed,
	co.marketing_campaign

FROM stage.v_dim_customer_order co
LEFT JOIN datamart.dim_opportunity op on op.opportunity_id=co.order_id
LEFT JOIN datamart.fact_order fo on fo.order_id=co.order_id
LEFT JOIN stage.v_dim_case dc_1 on dc_1.order_id=co.order_id
LEFT JOIN 
(
	SELECT 
		fo_1.order_id,
			CASE
				WHEN fo_1.billing_total<=fo_1.billing_received AND co_1.date_returned<=date_amount_paid THEN date_amount_paid
				WHEN fo_1.billing_total<=fo_1.billing_received AND co_1.date_returned>=date_amount_paid THEN co_1.date_returned
				WHEN fo_1.items_b4_ret=fo_1.items_returned THEN co_1.date_returned
				ELSE NULL
			END
		AS date_completed
	FROM datamart.fact_order fo_1
	JOIN stage.v_dim_customer_order co_1 on co_1.order_id=fo_1.order_id
)dc on dc.order_id=co.order_id
WHERE co.date_stylist_picked IS NOT NULL