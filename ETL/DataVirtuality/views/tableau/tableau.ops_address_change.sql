-- Name: tableau.ops_address_change
-- Created: 2015-09-01 17:50:22
-- Updated: 2015-09-01 17:50:22

create view tableau.ops_address_change
as

with c_order as
(
SELECT 
    rank() OVER(PARTITION BY customer_id ORDER BY date_created asc) as rank_cust,
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
)
select
a.customer_id,
CASE
  WHEN  
    a.shipping_first_name=b.shipping_first_name
    AND a.shipping_last_name=b.shipping_last_name
    AND a.shipping_street=b.shipping_street
    AND a.shipping_street_number=b.shipping_street_number
    AND a.shipping_zip=b.shipping_zip
    AND a.shipping_city=b.shipping_city
    AND a.shipping_co=b.shipping_co
  THEN 'Y'
  ELSE 'N'
end second_addres_change
from
(
  select
    co.customer_id,
    co.shipping_city,
    co.shipping_country, 
    co.shipping_street, 
    co.shipping_street_number, 
    co.shipping_zip, 
    co.shipping_first_name, 
    co.shipping_last_name, 
    co.shipping_co
  from c_order co
  where rank_cust=1
)a
left join
(
  select
    customer_id,
    co.shipping_city,
    co.shipping_country, 
    co.shipping_street, 
    co.shipping_street_number, 
    co.shipping_zip, 
    co.shipping_first_name, 
    co.shipping_last_name, 
    co.shipping_co
  from c_order co
  where rank_cust=2
)b on a.customer_id=b.customer_id


