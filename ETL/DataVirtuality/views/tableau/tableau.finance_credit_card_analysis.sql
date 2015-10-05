-- Name: tableau.finance_credit_card_analysis
-- Created: 2015-04-24 18:23:15
-- Updated: 2015-07-30 17:59:33

CREATE view tableau.finance_credit_card_analysis
AS
WITH cust_pay AS
(
	SELECT 
		c1.customer_id,
		c1.payment_method,
		row_number() over(partition by c1.customer_id ORDER BY c1.date_created DESC,c1.payment_method) AS r_pay
	FROM views.customer_order c1
	WHERE state=1024
)
SELECT 
co.customer_id,
co.first_order_date,
co.last_order_date,
cur_pay.current_payment_method,
cust_inv.cust_with_invoice,
bill.credit_card_expires,
bill.credit_card_entries,
bill.cc_expired
FROM
(
	SELECT 
		customer_id,
		min(co.date_created) as first_order_date,
		max(co.date_created) as last_order_date
	FROM views.customer_order co
	WHERE co.state=1024
	GROUP BY 1
)co
LEFT JOIN 
(
	SELECT
		customer_id,
		payment_method as cust_with_invoice
	FROM cust_pay c
	WHERE c.r_pay=1 AND c.payment_method=1
)cust_inv on cust_inv.customer_id=co.customer_id 
LEFT JOIN 
(
	SELECT
		customer_id,
		payment_method as current_payment_method
	FROM cust_pay
	WHERE r_pay=1
)cur_pay on cur_pay.customer_id=co.customer_id
LEFT JOIN
(
	SELECT 
		b.customer_id,
		CAST(b.credit_card_expires AS date) AS credit_card_expires,
		case 
			when CAST(b.credit_card_expires AS date)<=curdate() then 'Y'
			else 'N'
		end as cc_expired,
		row_number() over(partition by b.customer_id ORDER BY b.id DESC) AS rnum_expires,
		COUNT(DISTINCT b.credit_card_number) OVER (PARTITION BY b.customer_id) AS credit_card_entries
	FROM views.billing_data b
) bill on bill.customer_id=co.customer_id AND bill.rnum_expires=1


