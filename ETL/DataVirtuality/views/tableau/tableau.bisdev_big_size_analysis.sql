-- Name: tableau.bisdev_big_size_analysis
-- Created: 2015-04-24 18:23:56
-- Updated: 2015-04-24 18:23:56

CREATE view tableau.bisdev_big_size_analysis
AS
WITH cal AS
(
	SELECT
 		c.date,
 		a.shirt_size
 	FROM dwh.calendar c 
 	CROSS JOIN (SELECT DISTINCT shirt_size from views.customer WHERE shirt_size in ('XXL','3XL','4XL'))a
 	WHERE c.date>'2014' and c.date < CURDATE()
),
cust AS
(
	SELECT 
		c.customer_id,
		cast(c.date_created as date) as "date",
		c.shirt_size
	FROM views.customer c
	WHERE c.shirt_size in ('XXL','3XL','4XL')
	and user_type='Real User'
),
c_order as
(
	select
		co.id,
		co.customer_id,
		cu.shirt_size,
		cast(co.date_created as date) as date_created,
		cast(co.invoice_date_created as date) as "date",
		co.order_type,
		opk.order_value_sent_re,
		opk.order_value_kept_re,
		opk.order_value_returned_re
	FROM views.customer_order co
	LEFT JOIN views.customer cu on cu.customer_id=co.customer_id
	LEFT JOIN views.order_position_kpis opk on opk.order_id=co.id
	WHERE
	co.invoice_date_created is not null
	AND co.state >= 16
	                                            ),
op_feedback_shirts as
(
	SELECT 
		op.order_id,
		sum(case when op.feedback_Zu_Klein=1 then 1 else null end) as zu_klein,
		sum(case when op.feedback_Zu_Gross=1 then 1 else null end) as zu_gross
	FROM views.order_position op
	LEFT JOIN views.supplier_article_categories a on a.supplier_article_id=op.supplier_article_id
	AND a.cat2 in ('Shirts','Hemden')
	GROUP BY 1
)	
SELECT
	ca."date",
	ca."shirt_size",
	cu.new_customers,
	cu.nb_of_orders,
	/*customer orders with big sizes*/
	cart.orders_invoiced,
	cart.cart_value_first,
	cart.cart_value_repeat,
	cart.cart_value_follown,
	cart.order_value_sent_re,
	cart.order_value_kept_re,
	cart.order_value_returned_re,
	cart.rr_return,
	/*All Customer Order details without big sizes*/
	cn_no_big.new_customers_no_big,
	cn_no_big.nb_of_orders_no_big,
	cust_no_big.orders_invoiced_no_big_size,
	cust_no_big.cart_value_first_no_big_size,
	cust_no_big.cart_value_repeat_no_big_size,
	cust_no_big.cart_value_first_order_followon_no_big_size,
	cust_no_big.order_value_sent_re_no_big_size,
	cust_no_big.order_value_kept_re_no_big_size,
	cust_no_big.order_value_returned_re_no_big_size,
	rr_reason.zu_klein,
	rr_reason.zu_gross
FROM cal ca
/*number of new customers signed up / created*/
LEFT JOIN
(
	SELECT 
		c1."date",
		c1.shirt_size,
		count(distinct c1.customer_id) as new_customers,
		count(distinct co.id) as nb_of_orders
	FROM cust c1
	LEFT JOIN c_order co on co.customer_id=c1.customer_id
	GROUP BY 1,2
)cu ON cu."date"=ca."date" and ca.shirt_size=cu.shirt_size
/*Cart Value of first,real repeat and follow on orders*/
LEFT JOIN
(
	SELECT
		co."date",
		co.shirt_size,
		COUNT(*) as orders_invoiced,
		COUNT(CASE WHEN co.order_type = 'first order' THEN co.id ELSE 0 END) as nb_of_first_orders,
		COUNT(CASE WHEN co.order_type = 'real repeat order' THEN co.id ELSE 0 END) as nb_of_repeat_orders,
		COUNT(CASE WHEN co.order_type = 'follow on order' THEN co.id ELSE 0 END) as nb_of_followon_orders,
		AVG(CASE WHEN co.order_type = 'first order' THEN order_value_kept_re ELSE 0 END) as cart_value_first,
		AVG(CASE WHEN co.order_type = 'real repeat order' THEN order_value_kept_re ELSE 0 END) as cart_value_repeat,
		AVG(CASE WHEN co.order_type = 'follow on order' THEN order_value_kept_re ELSE 0 END) as cart_value_follown,
		SUM(co.order_value_sent_re) as order_value_sent_re,
		SUM(co.order_value_kept_re) as order_value_kept_re,
		SUM(co.order_value_returned_re) as order_value_returned_re,
		AVG(case
			when co.order_value_sent_re=0 then 0 
			else co.order_value_returned_re/co.order_value_sent_re
		end) as rr_return
	FROM c_order co
	JOIN cust c on c.customer_id=co.customer_id
	GROUP BY 1,2
)cart on cart."date"=ca."date" AND cart.shirt_size=cu.shirt_size
LEFT JOIN
(
	SELECT 
		cast(c1."date_created" as date) as datec,
		count(distinct c1.customer_id) as new_customers_no_big,
		count(distinct co.id) as nb_of_orders_no_big
	FROM views.customer c1
	LEFT JOIN views.customer_order co on co.customer_id=c1.customer_id
	WHERE c1.shirt_size not in ('XXL','3XL','4XL')
	GROUP BY 1
)cn_no_big on cn_no_big."datec"=ca."date"
/*customers with no big sizes-first,real repeat and follow on orders*/
LEFT JOIN
(
	SELECT
		co."date",
		COUNT(*) as orders_invoiced_no_big_size,
		COUNT(CASE WHEN co.order_type = 'first order' THEN co.id ELSE 0 END) as nb_of_first_orders_no_big_size,
		COUNT(CASE WHEN co.order_type = 'real repeat order' THEN co.id ELSE 0 END) as nb_of_repeat_orders_no_big_size,
		COUNT(CASE WHEN co.order_type = 'follow on order' THEN co.id ELSE 0 END) as nb_of_followon_orders_no_big_size,
		AVG(CASE WHEN co.order_type = 'first order' THEN order_value_kept_re ELSE 0 END) as cart_value_first_no_big_size,
		AVG(CASE WHEN co.order_type = 'real repeat order' THEN order_value_kept_re ELSE 0 END) as cart_value_repeat_no_big_size,
		AVG(CASE WHEN co.order_type = 'follow on order' THEN order_value_kept_re ELSE 0 END) as cart_value_first_order_followon_no_big_size,
		SUM(co.order_value_sent_re) as order_value_sent_re_no_big_size,
		SUM(co.order_value_kept_re) as order_value_kept_re_no_big_size,
		SUM(co.order_value_returned_re) as order_value_returned_re_no_big_size
	FROM c_order co
	WHERE co.shirt_size not in ('XXL','3XL','4XL')
	GROUP BY 1
)cust_no_big on cust_no_big."date"=ca."date"
/*share of return reason "zu klein" (too small) and "zu groﬂ" (too big)*/
LEFT JOIN
(
	SELECT
		co."date",
		co.shirt_size,
		sum(zu_klein) as zu_klein,
		sum(zu_gross) as zu_gross
	FROM op_feedback_shirts ofd
	JOIN c_order co on co.id=ofd.order_id
	GROUP BY 1,2
)rr_reason on rr_reason."date"=ca."date" AND rr_reason.shirt_size=cu.shirt_size
order by ca.date desc


