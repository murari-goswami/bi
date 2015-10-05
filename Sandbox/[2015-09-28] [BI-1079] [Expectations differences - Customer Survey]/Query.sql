select
	date_incoming,
	sales_channel,
	box_type,
	searching_for_specific_items,
	case when total_new_survey > 0 then cast(searching_for_specific_items as real) / total_new_survey else null end as searching_for_specific_items_perc,
	build_new_wardrobe,
	case when total_new_survey > 0 then cast(build_new_wardrobe as real) / total_new_survey else null end as build_new_wardrobe_perc,
	personal_advice,
	case when total_new_survey > 0 then cast(personal_advice as real) / total_new_survey else null end as personal_advice_perc,
	save_time,
	case when total_new_survey > 0 then cast(save_time as real) / total_new_survey else null end as save_time_perc,
	inspiration,
	case when total_new_survey > 0 then cast(inspiration as real) / total_new_survey else null end as inspiration_perc,
	testing_the_service,
	case when total_new_survey > 0 then cast(testing_the_service as real) / total_new_survey else null end as testing_the_service_perc
from (
	select
		case when co.date_incoming >= '2015-07-13' then '>=2015-07-13' else '<2015-07-13' end as date_incoming,
		case when lower(co.sales_channel) like '%app%' then 'iOS' else 'Desktop' end as sales_channel,
		co.box_type,
		sum(s.why_try_outfittery__searching_for_specific_items) as searching_for_specific_items,
		sum(s.why_try_outfittery__build_new_wardrobe) as build_new_wardrobe,
		sum(s.why_try_outfittery__personal_advice) as personal_advice,
		sum(s.why_try_outfittery__save_time) as save_time,
		sum(s.why_try_outfittery__inspiration) as inspiration,
		sum(s.why_try_outfittery__testing_the_service) as testing_the_service,
		sum(nvl(s.why_try_outfittery__searching_for_specific_items,0)
			+ nvl(s.why_try_outfittery__build_new_wardrobe,0)
			+ nvl(s.why_try_outfittery__personal_advice,0)
			+ nvl(s.why_try_outfittery__save_time,0)
			+ nvl(s.why_try_outfittery__inspiration,0)
			+ nvl(s.why_try_outfittery__testing_the_service,0)) as total_new_survey
	from bi.customer_order co
		join raw.customer_survey s on s.customer_id = co.customer_id
	where co.order_type = 'First Order'
	group by 1,2,3
	order by 1,2,3
) t
order by 1,2,3
;