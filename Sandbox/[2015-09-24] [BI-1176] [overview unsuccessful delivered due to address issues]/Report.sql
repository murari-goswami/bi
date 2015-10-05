	SELECT  date_shipped, shipping_country, order_type, delivery_status, sum(GSb4Ret) as GSb4Ret
	FROM (
		SELECT
	    co.customer_id as "customer_id",
	    co.order_id as "order_id",
	    cast(coalesce (date_shipped,'Missing Shipping Date') as date) as "date_shipped",
	    coalesce (shipping_country, 'Missing Country Information') as shipping_country,
		coalesce (order_type, 'Missing Order Type Information') as order_type,
		cast(coalesce(co.sales_sent, 0.0) as double) as GSb4Ret,
		dcoa.return_comment,
		dcoa.order_article_state as "delivery_status"
	FROM bi.customer_order co
	JOIN
	(	
	   SELECT aic.order_id, aic.return_comment, coa.order_article_state
	   from dwh.address_issue_case aic
	   left join
	   (select * from (
	   		   	 SELECT
			     order_article_state, order_id,
			     row_number() over (partition by order_id order by date_returned desc) rnb
			     FROM  "raw.customer_order_articles" )t
	   		     where rnb =1) coa
	   on coa.order_id=aic.order_id 
	) dcoa ON dcoa.order_id = co.order_id) as ftab
	group by date_shipped, shipping_country, order_type, delivery_status
	order by date_shipped asc;

		SELECT  date_shipped, shipping_country, order_type, delivery_status, 
	formatDouble(cast(sum(GSb4Ret) as double),  '#,##0.00;($#,##0.00)') as GSb4Ret
	FROM (
		SELECT
	    co.customer_id as "customer_id",
	    co.order_id as "order_id",
	    cast(coalesce (date_shipped,'Missing Shipping Date') as date) as "date_shipped",
	    coalesce (shipping_country, 'Missing Country Information') as shipping_country,
		coalesce (order_type, 'Missing Order Type Information') as order_type,
		cast(coalesce(co.sales_sent, 0.0) as double) as GSb4Ret,
		dcoa.return_comment,
		dcoa.order_article_state as "delivery_status"
	FROM bi.customer_order co
	JOIN
	(	
	   SELECT aic.order_id, aic.return_comment, coa.order_article_state
	   from dwh.address_issue_case aic
	   left join
	   ( SELECT order_article_state, order_id
	     FROM  "raw.customer_order_articles"
	     where order_position_count = 1 ) coa
	   on coa.order_id=aic.order_id 
	) dcoa 
	ON dcoa.order_id = co.order_id) as ftab
	group by date_shipped, shipping_country, order_type, delivery_status
	order by date_shipped asc;
