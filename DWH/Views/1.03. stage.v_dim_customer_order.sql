create or replace view stage.v_dim_customer_order
as
select
	co.id as order_id,
	co.customer_id,
	co.parent_order_id,
	co.shipping_address_id,
	co.stylelist_id as stylist_id,
	case 
		when co.payment_method = 1 then 'Invoice'
		when co.payment_method = 2 then 'Credit Card'
		when co.payment_method = 4 then 'Pre-pay'
		when co.payment_method = 6 then 'Arvato'
		else 'Ask BI'
	end as payment_type,
	co.sales_channel,
	co.state as order_state,
	co.date_created,
	pr.date_preview_created,
	co.phone_date as date_phone_call,
	/*Date Picked from amidala when stylist picks the articles, date_picked in customer_order when order is submitted to warehouse
	and invoice is printed*/
	coalesce(op.date_stylist_picked, co.date_picked, dd_ms.date_shipped, co.date_shipped) as date_stylist_picked,
	/*date_invoiced is when invoice is printed and kept in the box which we get form shippiment comfirmation, it takes invoice date
	created if date in manifest shipping is null*/
	coalesce(dd_sc.date_invoiced, inv.date_created) as date_invoiced,
	co.date_returned,
	/*date_shipped from doc_data is when label is printed, will be changed to aftership table when dhl scans the label*/
	coalesce(dd_ms.date_shipped,co.date_shipped) as date_shipped,
	co.date_payed AS date_paid, /*date_paid for arvato customers can be get from dwh.arvato payments*/
	coalesce(can.date_cancelled, co.date_canceled) as date_cancelled,
	can.cancellation_reason,
	co.marketing_campaign,
	co.discount_type,
	/* Be very careful here as the code for discounts is duplicated for the discount_total column */
	case 
		when co.total_goodwill_credit is not null
			then co.total_goodwill_credit
		else 0
	end + case
		when co.total_amount_billed_discount is not null
			then co.total_amount_billed_discount
		else 0
	end + case
		when not (vou.credit_note = vou.credit_goodwill or vou.credit_note = vou.credit_campaign)
			and vou.credit_note is not null
			then vou.credit_note
		else 0 
	end as discount_total,
	case
		when co.total_goodwill_credit is not null
			then co.total_goodwill_credit
		else 0
	end as discount_goodwill,
	case
		when co.total_amount_billed_discount is not null
			then co.total_amount_billed_discount
		else 0
	end as discount_marketing,
	case
		when (vou.credit_note <> vou.credit_goodwill or vou.credit_note <> vou.credit_campaign)
			and vou.credit_note is not null
			then vou.credit_note
		else 0 
	end as discount_paid_voucher,
	co.total_amount_payed,
	co.currency_code as country_code_iso,
	case 
		when ship_add.country in ('DE','AT','CH') then 'DACH'
		when ship_add.country in ('BE','NL','LU') then 'BENELUX'
		when ship_add.country in ('DK','SE') then 'Nordic'
		else 'ASK BI'
	end as region,
	initcap(ship_add.city) as shipping_city,
	ship_add.zip as shipping_zip,
	case 
		when ship_add.country='A' then 'AT'
		when ship_add.country='' then null
		else ship_add.country
	end as shipping_country,
	/*Call Box is set when order has phone date or else its is No Call box
		with TM, the definition will be changed Call Box (state change 4-8) and NoCall Box (4-12)*/
	case
		when co.phone_date > '2012-05-10'
			and co.phone_date < current_date + interval '2 months'
			and co.phone_date >= co.date_created
			then 'Call Box'
		when co.sales_channel = 'clubWithCall' then 'Call Box'
		else 'No Call Box'
	end as box_type,
	case
		when co.real_order_seq_num = 1 and co.parent_order_id is null then 'First Order'
		when co.all_order_seq_num = 2 and co.parent_order_id is not null then 'First Order Follow-on'
		when co.sales_channel like 'club%' then 'Outfittery Club Order'
		when co.real_order_seq_num > 1 and co.parent_order_id is null then 'Repeat Order'
		when co.all_order_seq_num > 2 and co.parent_order_id is not null then 'Repeat Order Follow-on'
		/* to deal with bad data where order_id=parent_id */
		when co.real_order_seq_num = 1 and co.id = co.parent_order_id then 'First Order'
	end as order_type
from (
	select
		*,
		rank() over (partition by customer_id order by id) as all_order_seq_num, -- rank of order within all orders by this customer
		case
			when (parent_order_id is null or id = parent_order_id) -- to deal with bad data where id = parent_order_id
				then rank() over (partition by customer_id order by id)
			else null
		end as real_order_seq_num -- rank of order within all non-follow-on orders by this customer
	from stage.postgres_customer_order
	) co
	left join stage.postgres_address ship_add on ship_add.id = co.shipping_address_id
	left join stage.postgres_voucher inv on inv.order_id = co.id and inv.voucher_type = 'INVOICE'
	left join (
		select
			order_id,
			max(date_picked) as date_stylist_picked
		from stage.postgres_order_position
		group by 1
	) op on op.order_id=co.id
	/*date_invoiced is invoice is kept in box i.e., shipment confirmation*/
	left join (
		select
			ss.orderid as order_id, 
			to_date(min(ss.shipping_date), 'YYYYMMDD') as date_invoiced 
		from stage.postgres_doc_data_shipment_confirmation ss
		group by 1
	) dd_sc on dd_sc.order_id = cast(co.id as varchar)
	/* Get the last clicked on showroom / preview / topic box (and its parent) by ordering by date_created */
	left join (
		select 
			pd.order_id,
			pd.preview_id,
			pd.customer_preview_id,
			pd.date_preview_created
		from (
			select 
				pr1.preview_id,
				pr1.id as customer_preview_id,
				pr1.date_created as date_preview_created,
				pr1.order_id,
				row_number() over (partition by pr1.order_id order by pr1.date_created desc) as "rnum"
			from stage.postgres_preview pr1
		) pd
		where pd.rnum = '1'
	) pr on pr.order_id = co.id
	/*date shipped is correct in doc_data_manifest_shipping*/
	left join (
		select 
			ss.orderid as order_id,
			to_date(min(ss.shipping_date), 'YYYYMMDD') as date_shipped
		from stage.postgres_doc_data_manifest_shipping ss
		group by 1
	) dd_ms on dd_ms.order_id = cast(co.id as varchar)
	/*get vouchers*/
	left join (
		select
			v.order_id, 
			sum(case when v.voucher_type = 'CREDIT_GOODWILL' then -v.amount else 0 end) as credit_goodwill,
			sum(case when v.voucher_type = 'CREDIT_CAMPAIGN' then -v.amount else 0 end) as credit_campaign,
			sum(case when v.voucher_type = 'CREDIT_NOTE' then -v.amount else 0 end) as credit_note
		from stage.postgres_voucher v 
		group by 1
	) vou on vou.order_id = co.id
	left join (
		select
			oc.order_id,
			oc.date_created as date_cancelled,
			ocr.reason as cancellation_reason
		from stage.postgres_order_cancellation oc
		left join stage.postgres_order_cancellation_reason ocr on oc.order_cancellation_reason_id = ocr.id
	) can on can.order_id = co.id
;