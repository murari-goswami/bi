-- Name: tableau.accounting_monthly_orders_returns_orders
-- Created: 2015-04-24 18:23:23
-- Updated: 2015-04-24 18:23:23

CREATE VIEW tableau.accounting_monthly_orders_returns_orders
AS
SELECT 
    order_id as customer_order_id,
    co.state as customer_order_state,
    co.date_returned as customer_order_date_returned,
    co.date_shipped as customer_order_date_shipped,
    co.invoice_date_created,
    co.shipping_first_name as first_name,
    co.shipping_last_name as last_name,
    co.shipping_country as country,
    co.total_amount_billed_discount,
    co.total_amount_billed_discount_euro,
    /*Basket Purchase Price*/
    sum(case when op.state>=16 and op.state<2048 then op.purchase_price else 0 end)  as total_amount_basket_purchase_gross,
    sum(case when op.stock_location_id = 4 and op.state>=16 and op.state<2048 then op.purchase_price else 0 end)  as total_amount_basket_purchase_gross_z_stock,
    sum(case when op.stock_location_id = 2 and op.state>=16 and op.state<2048 then op.purchase_price else 0 end) as total_amount_basket_purchase_gross_own,
    sum(case when op.stock_location_id = 4 and op.state>=16 and op.state<2048 then op.purchase_price else 0 end) as total_amount_basket_purchase_gross_z_ch,
    /*basket Retail Price*/
    sum(case when op.state>=16 and op.state<2048 then op.retail_price_euro else 0 end) as total_amount_basket_retail_gross,
    sum(case when op.stock_location_id = 4 and op.state>=16 and op.state<2048 then op.retail_price_euro else 0 end) as total_amount_basket_retail_gross_z_stock,
    sum(case when op.stock_location_id = 2 and op.state>=16 and op.state<2048 then op.retail_price_euro else 0 end) as total_amount_basket_retail_gross_own,
    sum(case when op.stock_location_id = 4 and op.state>=16 and op.state<2048 then op.retail_price_euro else 0 end) as total_amount_basket_retail_gross_z_ch,
    /*Retail Price-local curreny*/
    sum(case when op.state>=16 and op.state<2048 then op.retail_price else 0 end) as total_amount_basket_retail_gross_no,
    sum(case when op.stock_location_id = 4  and op.state>=16 and op.state<2048 then op.retail_price else 0 end) as total_amount_basket_retail_gross_z_stock_no,
    sum(case when op.stock_location_id = 2 and op.state>=16 and op.state<2048 then op.retail_price else 0 end) as total_amount_basket_retail_gross_own_no,
    sum(case when op.stock_location_id = 4 and op.state>=16 and op.state<2048 then op.retail_price else 0 end) as total_amount_basket_retail_gross_z_ch_no,
    /*Billed Purhase Price*/
    sum(case when op.state=1024 then op.purchase_price else 0 end) as total_amount_billed_purchase_gross,
    sum(case when op.stock_location_id = 4 and op.state=1024 then op.purchase_price else 0 end) as total_amount_billed_purchase_gross_z_stock,
    sum(case when op.stock_location_id = 2 and op.state=1024 then op.purchase_price else 0 end) as total_amount_billed_purchase_gross_own,
    sum(case when op.stock_location_id = 4 and op.state=1024 then op.purchase_price else 0 end) as total_amount_billed_purchase_gross_z_ch,
    /*Billed Retail Price*/
    sum(case when op.state=1024 then op.retail_price_euro else 0 end) as total_amount_billed_retail_gross,
    sum(case when op.stock_location_id = 4 and op.state=1024 then op.retail_price_euro else 0 end) as total_amount_billed_retail_gross_z_stock,
    sum(case when op.stock_location_id = 2 and op.state=1024 then op.retail_price_euro else 0 end) as total_amount_billed_retail_gross_own,
    sum(case when op.stock_location_id = 4 and op.state=1024 then op.retail_price_euro else 0 end) as total_amount_billed_retail_gross_z_ch,
    /*Billed Retail Price-local currency*/
    sum(case when op.state=1024 then op.retail_price else 0 end) as total_amount_billed_retail_gross_no,
    sum(case when op.stock_location_id = 4 and op.state=1024 then op.retail_price else 0 end) as total_amount_billed_retail_gross_z_stock_no,
    sum(case when op.stock_location_id = 2 and op.state=1024 then op.retail_price else 0 end) as total_amount_billed_retail_gross_own_no,
    sum(case when op.stock_location_id = 4 and op.state=1024 then op.retail_price else 0 end) as total_amount_billed_retail_gross_z_ch_no
FROM views.order_position op
JOIN views.customer_order co on co.id=op.order_id
WHERE cast(co.invoice_date_created as date)>='2014-01-01' AND
co.state<2048 and
co.order_state='Real Order' AND co.state<2048
GROUP BY 1,2,3,4,5,6,7,8,9,10


