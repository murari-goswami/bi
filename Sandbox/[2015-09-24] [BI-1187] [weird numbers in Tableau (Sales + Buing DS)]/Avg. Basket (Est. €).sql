Avg. Basket (Est. €)
sum([Sales Kept]) / sum([Total Invoiced Orders (#)])

[management_management_report_main].[sales_kept] = bi.customer_order.sum(sales_kept)
[management_management_report_main].[orders_invoiced] = bi.customer_order.COUNT(*)

  WHERE co.is_real_order = 'Real Order'
  AND co.date_invoiced is not null
  AND co.date_invoiced > '2014'
  AND co.order_state_number >= 16 
  AND co.order_state_number < 2048




Avg. Basket (Est. €)
sum([sales_kept_forecast]) / [# Orders (processed)]

[sales_datasource].[sales_kept_forecast] = bi.customer_order.avg(co.sales_kept)
countd(if [Customer Order State] >=16 and [Customer Order State] <=1024 and [State]>=16 and [State]!=2048 then[Order Id] else null end)

[sales_datasource].[customer_order_state] = bi.customer_order.order_state_number
[sales_datasource].[state] = bi.customer_order_articles.order_article_state_number
[sales_datasource].[order_id] = bi.customer_order.order_id




select
	sum(sales_kept_forecast) / count(distinct -- 221.19904909538782872910
		case when customer_order_state >=16 and customer_order_state <= 2048 --1024
				--and state>=16 and state!=2048 -- 220.49876615809646611772
				and is_real_order = 'Real Order'
			then order_id else null
		end)
from tableau.sales_datasource
where date_picked >= '2015-08-01' and date_picked < '2015-09-01'
;



select
	sum(sales_kept) / sum(orders_invoiced) as avg_basket_est -- 199.27352786620618936818
from tableau.management_management_report_main
where "date" >= '2015-08-01' and "date" < '2015-09-01'
  /*WHERE co.is_real_order = 'Real Order'
  AND co.date_invoiced is not null
  AND co.date_invoiced > '2014'
  AND co.order_state_number >= 16 
  AND co.order_state_number < 2048*/
;