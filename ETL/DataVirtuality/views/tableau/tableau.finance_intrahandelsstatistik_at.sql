-- Name: tableau.finance_intrahandelsstatistik_at
-- Created: 2015-04-24 18:23:20
-- Updated: 2015-06-25 14:12:28

CREATE view tableau.finance_intrahandelsstatistik_at
AS

SELECT 
    cast(co.date_shipped as date) as date_shipped,
    co.shipping_country,
    it.brand,
    it.parent_no as o_parentId,
    it.net_weight as net_weight_gram,
    it.tariff_no as de_customs_tarff_number,
    sum(coa.articles_sent) as items_sent,
    sum(coa.cost_sent) as order_value_purchase_price
FROM bi.customer_order co 
LEFT JOIN bi.customer_order_articles coa ON co.order_id=coa.order_id
LEFT JOIN bi.item it ON it.article_id=coa.article_id
WHERE co.date_shipped IS NOT NULL AND co.order_state_number<2048
GROUP BY 1,2,3,4,5,6


