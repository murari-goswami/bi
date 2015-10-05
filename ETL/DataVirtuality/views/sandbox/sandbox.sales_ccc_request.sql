-- Name: sandbox.sales_ccc_request
-- Created: 2015-08-25 12:11:34
-- Updated: 2015-09-01 16:44:59

CREATE view sandbox.sales_ccc_request
as

with c_order as
(
	SELECT 
 		rank() OVER(PARTITION BY customer_id ORDER BY date_created desc) as rank_cust,
 		order_id,
 		order_type,
		customer_id,
		date_created,
		kept_state,
		payment_type,
		date_invoiced,
		shipping_city,
		shipping_country, 
		shipping_street, 
		shipping_street_number, 
		shipping_zip, 
		shipping_first_name, 
		shipping_last_name, 
		shipping_co, 
		given_to_debt_collection,
		case when revenue_state='Final' then sales_kept end as sales_kept,
		case when revenue_state='Final' then articles_kept end as items_kept
	from bi.customer_order
	where shipping_country ='CH'
)
SELECT
	cu.customer_id,
	cu.first_name||' '||cu.last_name as customer_name,
	cu.phone_number,
	st.stylist,
	st.team,
	c.date_invoiced_last_box,
	c.items_kept_last_box,
	c.sales_kept_last_box,
	ad.shipping_first_name, 
	ad.shipping_last_name, 
	ad.shipping_street, 
	ad.shipping_street_number, 
	ad.shipping_co,
	ad.shipping_zip,
	ad.shipping_city,
	ad.shipping_country
FROM raw.customer cu
LEFT JOIN bi.customer cu_1 on cu_1.customer_id=cu.customer_id
LEFT JOIN bi.stylist st on st.stylist_id=cu.stylist_id
JOIN
(
	SELECT 
		DISTINCT customer_id
	FROM c_order
	WHERE sales_kept>=100
)a on a.customer_id=cu.customer_id
/*customer had 2 full returns within the last 12 months at the most*/
JOIN
(
	SELECT 
		customer_id,
		kept_state,
		COUNT(*) as full_return_boxes
	FROM c_order
	WHERE kept_state='All Returned'
	AND CAST(date_created AS DATE)>=TIMESTAMPADD(SQL_TSI_MONTH,-10,CURDATE())
	GROUP BY 1,2
	HAVING COUNT(*)<=2
)b on a.customer_id=b.customer_id
JOIN
(
	SELECT 
		customer_id,
		max(case when rank_cust=1 then items_kept end) as items_kept_last_box,
		max(case when rank_cust=1 then sales_kept end) as sales_kept_last_box,
		max(case when rank_cust=1 then date_invoiced end) as date_invoiced_last_box,
		sum(sales_kept) as sales_kept,
		max(date_created) as date_created,
		max(given_to_debt_collection) as given_to_debt_collection,
		max(case when rank_cust=1 then payment_type end) as last_payment_type
	FROM c_order 
	GROUP BY 1
)c on c.customer_id=a.customer_id AND c.given_to_debt_collection<>true
left join
(
	select
		customer_id,
		shipping_city,
		shipping_country, 
		shipping_street, 
		shipping_street_number, 
		shipping_zip, 
		shipping_first_name, 
		shipping_last_name, 
		shipping_co
		from c_order where rank_cust=1
)ad on ad.customer_id=cu.customer_id
and c.last_payment_type not like 'Pre-pay'
WHERE
cu.club_member=false
and cu.phone_number is not null
and cu.email not like '%invalid%'
and cu_1.vip_customer<>true
and (cu.subscribed_to_sms=true
or cu.newsletter_accepted=true
or cu.subscribed_to_stylist_emails=true)
and CAST(c.date_created AS DATE)>=TIMESTAMPADD(SQL_TSI_MONTH,-10,CURDATE())


