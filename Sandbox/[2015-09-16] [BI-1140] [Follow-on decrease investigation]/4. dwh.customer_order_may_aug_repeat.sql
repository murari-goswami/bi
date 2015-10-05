-- Table: dwh.customer_order_may_aug_repeat

-- DROP TABLE dwh.customer_order_may_aug_repeat;

select cast(date_created as date) as date_created, count(*) as vol
into dwh.customer_order_may_aug_repeat
from raw.customer_order_fo_issue
group by cast(date_created as date);									   

ALTER TABLE dwh.customer_order_may_aug_repeat
  OWNER TO postgres;
