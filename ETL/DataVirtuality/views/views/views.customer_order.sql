-- Name: views.customer_order
-- Created: 2015-04-24 18:19:39
-- Updated: 2015-08-07 10:51:24

CREATE VIEW views.customer_order
AS
SELECT
	co.order_id as id,
	co.customer_id,
	co.date_created,
	null as last_updated,  /* Set to null as it's pointless data */
	co.order_state_number as state,
	CASE 
		WHEN co.payment_type = 'Invoice' THEN 1 
		WHEN co.payment_type = 'Credit Card' THEN 2
		WHEN co.payment_type = 'Pre-pay' THEN 4 
		WHEN co.payment_type = 'Arvato' THEN 6
	END as payment_method,
	CASE 
		WHEN co.payment_state = 'Pending' THEN 8
		WHEN co.payment_state = 'Authorised' THEN 16
		WHEN co.payment_state = 'Captured' THEN 32
		WHEN co.payment_state = 'Factored' THEN 48
		WHEN co.payment_state = 'Paid' THEN 64
		WHEN co.payment_state = 'Cancelled' THEN 2048
	END as payment_state,
	co.cost_sent as total_amount_basket_purchase_gross,
	co.sales_sent*co.exchange_rate as total_amount_basket_retail_gross,
	co.discount_marketing*co.exchange_rate as total_amount_billed_discount,
	co.cost_kept as total_amount_billed_purchase_gross,
	co.billing_total*co.exchange_rate as total_amount_billed_retail_gross,
	'0' as total_amount_net,  /* Always zero in production database */
	co.parent_order_id,
	co.date_invoiced as date_billed,
	co.date_paid as date_payed,
	co.date_returned,
	co.date_shipped,
	'1' as total_amount_reserved,  /* Not sure what the data here means. Set to 1 as 99.9% of rows show 1 */
	co.sales_channel,
	co.box_type,
	co.date_phone_call as phone_date,
	co.stylist_id as stylelist_id,
	co.discount_type,
	'0' as discount_content,  /* Always zero in production database */
	'0' as total_amount_billed_discount_percentage,  /* Set this to zero as everything is covered in the absolute column */
	co.discount_marketing*co.exchange_rate as total_amount_billed_discount_absolute,
	co.date_completed,
	co.campaign_id,
	co.date_first_reminder,
	co.date_first_warning as date_first_dunning,
	co.billing_received*co.exchange_rate as total_amount_payed,
	co.date_given_to_debt_collection as date_encashment,
	co.date_returned_online,
	co.currency_code,
	co.date_cancelled as date_canceled,
	co.vat_percentage,
	co.date_stylist_picked as date_picked,
	co.customer_message_content,
	co.date_second_warning as date_second_dunning,
	null as date_earliest_delivery,
	co.date_submitted,
	co.discount_goodwill*co.exchange_rate as total_goodwill_credit,
	co.shipping_address_meets_billing_address,
	co.discount_marketing as total_amount_billed_discount_euro,
	co.discount_goodwill as total_goodwill_credit_euro,
	co.billing_received as total_amount_paid_euro,
	cust_sales_channel.sales_channel as first_saleschannel_completed,
	cust_sales_channel.box_type as first_box_type,
	co.shipping_city,
	co.shipping_country,
	co.shipping_street,
	co.shipping_street_number,
	co.shipping_zip,
	co.shipping_first_name,
	co.shipping_last_name,
	co.shipping_co,
	co.billing_city,
	co.billing_country,
	co.billing_street,
	co.billing_street_number,
	co.billing_zip,
	co.billing_first_name,
	co.billing_last_name,
	co.billing_co,
	c.date_of_birth as customer_date_of_birth,
	c.customer_age,
	co.date_invoiced as invoice_date_created,
	co.invoice_number,
	co.real_order_count as real_repeat_order_count,
	co.follow_on_count,
	co.all_order_count as total_order_count,
	co.all_order_count as all_orders_count,
	co.real_order_count_completed,
	co.all_order_count_completed,
	CASE
		WHEN co.order_type = 'First Order' THEN 'first order'
		WHEN co.order_type in ('Repeat Order', 'Outfittery Club Order') THEN 'real repeat order'
		WHEN co.order_type in ('First Order Follow-on', 'Repeat Order Follow-on') THEN 'follow on order'
		ELSE 'Ask BI'
	END as order_type,
	CASE
		WHEN co.order_type_completed = 'First Order' THEN 'first order'
		WHEN co.order_type_completed in ('Repeat Order', 'Outfittery Club Order') THEN 'real repeat order'
		WHEN co.order_type_completed in ('First Order Follow-on', 'Repeat Order Follow-on') THEN 'follow on order'
		WHEN co.order_type_completed = 'Not Completed' THEN 'not completed'
		ELSE 'Ask BI'
	END as order_type_completed,
	cam.campaign_type,
	cam.discount_code as code,
	cam.campaign_title,
	null as info_pictypicalstyle,
	null as info_quantityshoes,
	null as info_quantitysakkos,
	null as info_selectedprdsportive,
	null as info_picarticlecloset,
	null as info_picclothwork,
	null as info_pictypicalcar,
	null as info_piclanguage,
	null as info_question6,
	null as info_picgoodcolor,
	null as info_quantitytshirts,
	null as info_question7,
	null as info_pictypicalsupermarket,
	null as info_picagerange,
	null as info_quantitytrousers,
	null as info_quantitypullover,
	null as info_selectedprdfashion,
	null as info_quantityshirts,
	null as info_picbrandok,
	null as info_selectedprdclassic,
	null as info_picarticleneeded,
	null as info_haircolor,
	null as info_quantityjackets,
	null as info_pictypicalshoes,
	null as info_undefined,
	co.is_real_order as order_state
FROM bi.customer_order co
JOIN bi.customer c on c.customer_id = co.customer_id 
LEFT JOIN raw.discount_campaigns as cam on co.campaign_id = cam.campaign_id
LEFT JOIN (
	SELECT
  		fsc.customer_id,
  		fsc.sales_channel,
  		fsc.box_type
 	FROM 
 	(
 		SELECT
			row_number() over (partition by customer_id order by date_created asc) as "rnum",
			customer_id,
			order_id as id,
			sales_channel,
			box_type
		FROM bi.customer_order
		WHERE order_state_number = '1024'
	) fsc
 	where fsc.rnum = '1'
) cust_sales_channel on cust_sales_channel.customer_id = co.customer_id


