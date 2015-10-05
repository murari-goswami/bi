-- Name: tableau.sales_ccc_report
-- Created: 2015-08-18 14:10:37
-- Updated: 2015-08-20 17:55:46

CREATE view tableau.sales_ccc_report
as
/*customer call center report, this report is exported every 2nd week by sales team to call 
customers */

with c_order as
(
	SELECT 
 		rank() OVER(PARTITION BY customer_id ORDER BY date_created desc) as rank_cust,
 		order_id,
 		order_type,
		customer_id,
		date_created,
		shipping_country,
		case when revenue_state='Final' then sales_kept end as sales_kept,
		case when revenue_state='Final' then articles_kept end as articles_kept
	from bi.customer_order
	WHERE shipping_country='DE'
)

SELECT 
	cu.customer_id,
	cu.vip_customer,
	cu.first_name||' '||cu.last_name as customer_name,
	st.stylist,
	cu.phone_number,
	cu.email,
	b.articles_kept,
	b.sales_kept,
	b.last_date_ordered,
	cos.last_call_reactivation
FROM bi.customer cu
LEFT JOIN bi.stylist st on st.stylist_id=cu.new_stylist_id
JOIN
(
	SELECT
		customer_id,
		MAX(date_created) as last_date_ordered,
		sum(sales_kept) as sales_kept,
		SUM(articles_kept) as articles_kept
	FROM
	(
		SELECT * FROM c_order WHERE rank_cust=1 and sales_kept>=150
	)a
	WHERE 
	   order_type in ('Repeat Order', 'Repeat Order Follow-on')
	GROUP BY 1
	HAVING SUM(sales_kept)>=150
	AND MAX(CAST(date_created AS DATE))>=TIMESTAMPADD(SQL_TSI_YEAR,-1,CURDATE())
)b on b.customer_id=cu.customer_id
LEFT JOIN raw.customer_salesforce cos on cos.customer_id=cu.customer_id
WHERE cu.club_member<>'true'
and cu.phone_number IS NOT NULL
AND cos.last_call_reactivation<=TIMESTAMPADD(SQL_TSI_WEEK,-2,CURDATE())


