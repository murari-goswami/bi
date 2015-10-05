select MONTHNAME(date_created) month_created,YEAR(date_created) year_ctreated,
       month(date_created) month_no , default_domain as "Language", count(*)  as "Volume of Orders"
from "bi.customer" 
where default_domain is not null
and date_created is not null
group by MONTHNAME(date_created), YEAR(date_created),month(date_created),default_domain
order by YEAR(date_created) desc, month(date_created) desc;

select MONTHNAME(date_created) month_,YEAR(date_created) year_ctreated,
       month(date_created) month_no ,shipping_country, count(*)  as "Volume of Orders"
from "bi.customer_order"
where shipping_country is not null
group by MONTHNAME(date_created), YEAR(date_created),month(date_created),shipping_country
order by YEAR(date_created) asc, month(date_created) asc;

