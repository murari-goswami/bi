select * into dwh.ccc_co_tab_12_mnth
from "bi.customer_order" 
where date_created >= TIMESTAMPADD(SQL_TSI_MONTH,-12,curdate())
and shipping_country in ('DE','AT')
and billing_total between 50 and 149
and given_to_debt_collection = 'false'
and customer_id not in (select customer_id from (
												select customer_id, kept_state, count(*) from "bi.customer_order" b
												where cast(date_created as date) >= TIMESTAMPADD(SQL_TSI_MONTH,-12,curdate())
												and kept_state = 'All Returned'
												group by customer_id,kept_state
												having count(*) > 2) as tab)
						);

select * into dwh.ccc_case_tab
from (
select * from (
select a.customer_id, a.date_created, a.stylist_id, a.articles_kept, a.sales_kept, a.pre_pay, cast(a.billing_total as long) 		as billing_total ,
  rank() over (partition by customer_id order by date_created desc) as rank_date
from dwh.ccc_co_tab_12_mnth_1 a
where exists (select 1 from "bi.customer" b
		        where a.customer_id = b.customer_id
    		    and phone_number is not null
		        and COALESCE(vip_customer, true) = 'false'
	            and club_member = 'false'
	            and lower(occupation) not like '%behinderte%'
	            and (newsletter_accepted <> 'false' and subscribed_to_sms <> 'false' and subscribed_to_stylist_emails <> 'false')
			    )			    		    	    		    
	) as mainTab
	where mainTab.rank_date = 1
	and mainTab.pre_pay = 0) final_tab;