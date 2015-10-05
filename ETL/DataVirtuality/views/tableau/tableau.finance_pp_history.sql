-- Name: tableau.finance_pp_history
-- Created: 2015-04-24 18:19:16
-- Updated: 2015-04-24 18:19:16

CREATE view tableau.finance_pp_history
AS
select 
	pim.o_parentid,
	pop.purchase_order_id,
	pop.date_created,
	pop.earliest_delivery_date,
	pop.latest_delivery_date,
	pop.ean,
	pim.season as pim_season, 
	case when a.date_delivered_new is null then b.date_delivered_old else a.date_delivered_new end as "delivery_date",
	sum(pop.fulfilled_quantity) as fulfilled_quantity, 
	sum(pop.fulfilled_quantity*pop.purchase_price) as purchase_price_fulfilled,
	sum(pop.purchase_price) as purchase_price_per_piece
FROM views.purchase_order_position pop
left JOIN views.pim_article pim on pop.ean = pim.ean
LEFT JOIN 
(
	select
		po,
		ean,
		cast(max(date_delivered) as date) as date_delivered_new
	from views.scantemplates
	group by 1,2
)a ON a.po=pop.purchase_order_id AND a.ean = pop.ean
left join 
(
	select 
		po,
		ean,
		cast(max(date_delivered) as date) as date_delivered_old
	FROM dwh.scantemplates_old
	GROUP BY 1,2
) b  ON b.po=pop.purchase_order_id AND b.ean = pop.ean
where pop.fulfilled_quantity > 0
GROUP BY 1,2,3,4,5,6,7,8


