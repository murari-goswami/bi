/*
LB Stk. Endbestand = nvl(quantity,0)/count(distinct date_created)
WE Stk. = nvl(quantity_ow_dlv,0) + nvl(quantity_z_dlv,0)
Abverkauf Stk. = nvl(completed_1024_all,0)
Unterwegs Stk. = nvl(sum_virtual_stock_quantity,0)
brand = 'PAUL HUNTER'
*/

select
  --sum(nvl(quantity,0)) as quantity,
  --count(distinct date_created) as days_count,
  sum(nvl(quantity,0))/count(distinct date_created) as lb_stk_endbestand,
  sum(nvl(quantity_ow_dlv,0) + nvl(quantity_z_dlv,0)) as we_stk,
  sum(nvl(completed_1024_all,0)) as abverkauf_stk,
  sum(nvl(sum_virtual_stock_quantity,0)) as unterwegs_stk
from tableau.data_source_own_stock_2
where brand = 'PAUL HUNTER'
  and cast(date_created as date) >= '2015-07-01' and cast(date_created as date) <= '2015-09-14'
;