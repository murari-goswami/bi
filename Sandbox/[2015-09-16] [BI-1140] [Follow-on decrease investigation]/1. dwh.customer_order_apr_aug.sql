-- Table: dwh.customer_order_apr_aug

-- DROP TABLE dwh.customer_order_apr_aug;

select * into dwh.customer_order_apr_aug
from "bi.customer_order" 
where cast(date_created as date) between '2015-04-01' and '2015-08-31' ;

ALTER TABLE dwh.customer_order_apr_aug
  OWNER TO postgres;
