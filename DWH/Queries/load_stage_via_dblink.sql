--create extension dblink;

select public.dblink_connect('postgres','hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>');
select public.dblink_connect('dv_dwh','hostaddr=10.0.0.54 port=5432 dbname=dv_r172 user=postgres password=<password>');


-- Stage

truncate table stage.postgres_address;

insert into stage.postgres_address
select *
from public.dblink(
	'postgres',
	'
	select
		id,
		version,
		city,
		co,
		country,
		street,
		street_number,
		zip,
		first_name,
		last_name,
		salutation,
		active,
		default_address,
		co_type
	from public.address a
	'
)
as t1 (
	id bigint,
	version bigint,
	city character varying(255),
	co character varying(255),
	country character varying(255),
	street character varying(255),
	street_number character varying(255),
	zip character varying(255),
	first_name character varying(255),
	last_name character varying(255),
	salutation integer,
	active boolean,
	default_address boolean,
	co_type character varying(255)
);


truncate table stage.postgres_audit_log;

insert into stage.postgres_audit_log
select *
from public.dblink(
	'postgres',
	'
	select
		id,
		actor,
		class_name,
		date_created,
		event_name,
		last_updated,
		new_value,
		old_value,
		persisted_object_id,
		persisted_object_version,
		property_name,
		uri
	from public.audit_log al
	where al.last_updated >= current_date - interval ''10 days''
	'
)
as t1 (
	id bigint,
	actor character varying(255),
	class_name character varying(255),
	date_created timestamp with time zone,
	event_name character varying(255),
	last_updated timestamp with time zone,
	new_value character varying(255),
	old_value character varying(255),
	persisted_object_id character varying(255),
	persisted_object_version bigint,
	property_name character varying(255),
	uri character varying(255)
);


truncate table stage.postgres_customer_order;

insert into stage.postgres_customer_order
select *
from public.dblink(
	'postgres',
	'
	select
		id,
		version,
		belonging_questionnaire_session_id,
		billing_address_id,
		customer_id,
		date_created,
		gtc_accepted,
		last_updated,
		shipping_address_id,
		shipping_address_meets_billing_address,
		state,
		payment_method,
		payment_state,
		total_amount_basket_purchase_gross,
		total_amount_basket_retail_gross,
		total_amount_billed_discount,
		total_amount_billed_purchase_gross,
		total_amount_billed_retail_gross,
		total_amount_net,
		parent_order_id,
		date_billed,
		date_payed,
		date_returned,
		date_shipped,
		total_amount_reserved,
		comment,
		sales_channel,
		phone_date,
		stylelist_id,
		discount_type,
		discount_content,
		total_amount_billed_discount_percentage,
		total_amount_billed_discount_absolute,
		date_completed,
		billing_data_id,
		campaign_id,
		--additional_info,
		--additional_info_map,
		date_first_reminder,
		date_first_dunning,
		date_second_dunning,
		total_amount_payed,
		date_encashment,
		date_returned_online,
		currency_code,
		date_earliest_delivery,
		date_submitted,
		logistics_processor,
		vat_percentage,
		customer_message_content,
		date_picked,
		last_external_checkout_payment_method,
		last_external_checkout_id,
		last_external_checkout_price,
		date_credited,
		date_canceled,
		last_external_document_id,
		date_return_reminder,
		date_third_dunning,
		total_goodwill_credit,
		max_total_amount_billed_retail_gross,
		max_total_amount_billed_retail_gross_origin,
		marketing_campaign,
		date_return_registration
	from public.customer_order co
	where co.last_updated >= current_date - interval ''10 days''
	'
)
as t1 (
	id bigint,
	version bigint,
	belonging_questionnaire_session_id bigint,
	billing_address_id bigint,
	customer_id bigint,
	date_created timestamp with time zone,
	gtc_accepted boolean,
	last_updated timestamp with time zone,
	shipping_address_id bigint,
	shipping_address_meets_billing_address boolean,
	state integer,
	payment_method bigint,
	payment_state integer,
	total_amount_basket_purchase_gross numeric(19,2),
	total_amount_basket_retail_gross numeric(19,2),
	total_amount_billed_discount numeric(19,2),
	total_amount_billed_purchase_gross numeric(19,2),
	total_amount_billed_retail_gross numeric(19,2),
	total_amount_net real,
	parent_order_id bigint,
	date_billed timestamp with time zone,
	date_payed timestamp with time zone,
	date_returned timestamp with time zone,
	date_shipped timestamp with time zone,
	total_amount_reserved numeric(19,2),
	comment text,
	sales_channel character varying(255),
	phone_date timestamp with time zone,
	stylelist_id integer,
	discount_type integer,
	discount_content integer,
	total_amount_billed_discount_percentage numeric(19,2),
	total_amount_billed_discount_absolute numeric(19,2),
	date_completed timestamp with time zone,
	billing_data_id bigint,
	campaign_id bigint,
	--additional_info hstore,
	--additional_info_map bytea,
	date_first_reminder timestamp with time zone,
	date_first_dunning timestamp with time zone,
	date_second_dunning timestamp with time zone,
	total_amount_payed numeric(19,2),
	date_encashment timestamp with time zone,
	date_returned_online timestamp with time zone,
	currency_code character varying(255),
	date_earliest_delivery timestamp with time zone,
	date_submitted timestamp with time zone,
	logistics_processor character varying(6),
	vat_percentage numeric(19,3),
	customer_message_content character varying(500),
	date_picked timestamp with time zone,
	last_external_checkout_payment_method character varying(255),
	last_external_checkout_id character varying(255),
	last_external_checkout_price numeric(19,2),
	date_credited timestamp with time zone,
	date_canceled timestamp with time zone,
	last_external_document_id character varying(255),
	date_return_reminder timestamp with time zone,
	date_third_dunning timestamp with time zone,
	total_goodwill_credit numeric(19,2),
	max_total_amount_billed_retail_gross numeric(19,2),
	max_total_amount_billed_retail_gross_origin character varying(255),
	marketing_campaign character varying(255),
	date_return_registration timestamp with time zone
);


truncate table stage.postgres_customer_subscription;

insert into stage.postgres_customer_subscription
select *
from public.dblink(
	'postgres',
	'
	select
		id,
		customer_id,
		date_activated,
		date_cancelled,
		date_created,
		end_date,
		"interval",
		name,
		notes,
		offer,
		start_date,
		status,
		type
	from public.customer_subscription cl
	--where cl.date_created >= current_date - interval ''10 days''
	'
)
as t1 (
	id bigint,
	customer_id bigint,
	date_activated timestamp without time zone,
	date_cancelled timestamp without time zone,
	date_created timestamp without time zone,
	end_date timestamp without time zone,
	"interval" character varying(255),
	name character varying(255),
	notes text,
	offer character varying(255),
	start_date timestamp without time zone,
	status character varying(255),
	type character varying(255)
);


truncate table stage.postgres_doc_data_manifest_shipping;

insert into stage.postgres_doc_data_manifest_shipping
select *
from public.dblink(
	'postgres',
	'
	select
		id,
		version,
		cod_amount,
		collo_number,
		date_created,
		date_processed,
		last_updated,
		line_number,
		orderid,
		outfittery_article_number,
		processing_reason,
		processing_result,
		processing_state,
		quantity,
		receiver_address1,
		receiver_address2,
		receiver_city,
		receiver_company,
		receiver_country_code,
		receiver_name,
		receiver_zip_code,
		return_track_and_trace_number,
		shipping_date,
		track_and_trace_number,
		transport_company,
		used_invoice_number
	from public.doc_data_manifest_shipping dd_ms
	where dd_ms.last_updated >= current_date - interval ''10 days''
	'
)
as t1 (
	id bigint,
	version bigint,
	cod_amount character varying(50),
	collo_number character varying(50),
	date_created timestamp with time zone,
	date_processed timestamp with time zone,
	last_updated timestamp with time zone,
	line_number character varying(255),
	orderid character varying(20),
	outfittery_article_number character varying(20),
	processing_reason text,
	processing_result integer,
	processing_state integer,
	quantity character varying(50),
	receiver_address1 character varying(50),
	receiver_address2 character varying(50),
	receiver_city character varying(50),
	receiver_company character varying(50),
	receiver_country_code character varying(2),
	receiver_name character varying(50),
	receiver_zip_code character varying(10),
	return_track_and_trace_number character varying(255),
	shipping_date character varying(255),
	track_and_trace_number character varying(50),
	transport_company character varying(50),
	used_invoice_number character varying(50)
);


truncate table stage.postgres_doc_data_shipment_confirmation;

insert into stage.postgres_doc_data_shipment_confirmation
select *
from public.dblink(
	'postgres',
	'
	select
		id,
		version,
		date_created,
		date_processed,
		last_updated,
		line_number,
		orderid,
		outfittery_article_number,
		processing_reason,
		processing_result,
		processing_state,
		quantity_shipped,
		shipping_date,
		track_and_trace_number,
		transport_company_code
	from public.doc_data_shipment_confirmation dd_sc
	where dd_sc.last_updated >= current_date - interval ''10 days''
	'
)
as t1 (
	id bigint,
	version bigint,
	date_created timestamp with time zone,
	date_processed timestamp with time zone,
	last_updated timestamp with time zone,
	line_number character varying(255),
	orderid character varying(20),
	outfittery_article_number character varying(20),
	processing_reason text,
	processing_result integer,
	processing_state integer,
	quantity_shipped character varying(50),
	shipping_date character varying(255),
	track_and_trace_number character varying(20),
	transport_company_code character varying(50)
);


truncate table stage.postgres_order_cancellation;

insert into stage.postgres_order_cancellation
select *
from public.dblink(
	'postgres',
	'
	select
		id,
		version,
		date_created,
		order_id,
		order_cancellation_reason_id
	from public.order_cancellation can
	--where can.date_created >= current_date - interval ''10 days''
	'
)
as t1 (
	id bigint,
	version bigint,
	date_created timestamp without time zone,
	order_id bigint,
	order_cancellation_reason_id bigint
);


truncate table stage.postgres_order_cancellation_reason;

insert into stage.postgres_order_cancellation_reason
select *
from public.dblink(
	'postgres',
	'
	select
		id,
		version,
		reason,
		reference_key
	from public.order_cancellation_reason ocr
	'
)
as t1 (
	id bigint,
	version bigint,
	reason character varying(255),
	reference_key character varying(255)
);


truncate table stage.postgres_order_position;

insert into stage.postgres_order_position
select *
from public.dblink(
	'postgres',
	'
	select
		id,
		state,
		version,
		article_id,
		date_created,
		last_updated,
		order_id,
		quantity,
		supplier_article_id,
		purchase_price,
		retail_price,
		date_returned,
		date_shipped,
		supplier_order_number,
		date_incoming,
		date_returned_online,
		group_id,
		order_positions_idx,
		track_and_trace_number,
		stock_location_id,
		date_picked,
		date_canceled,
		date_lost
	from public.order_position op
	where op.last_updated >= current_date - interval ''10 days''
	'
)
as t1 (
	id bigint,
	state integer,
	version bigint,
	article_id bigint,
	date_created timestamp with time zone,
	last_updated timestamp with time zone,
	order_id bigint,
	quantity integer,
	supplier_article_id bigint,
	purchase_price real,
	retail_price real,
	date_returned timestamp with time zone,
	date_shipped timestamp with time zone,
	supplier_order_number character varying(255),
	date_incoming timestamp with time zone,
	date_returned_online timestamp with time zone,
	group_id character varying(255),
	order_positions_idx integer,
	track_and_trace_number character varying(255),
	stock_location_id bigint,
	date_picked timestamp with time zone,
	date_canceled timestamp with time zone,
	date_lost timestamp with time zone
);


truncate table stage.postgres_preview;

insert into stage.postgres_preview
select *
from public.dblink(
	'postgres',
	'
	select
		id,
		customer_id,
		date_created,
		last_updated,
		note,
		order_id,
		state,
		class,
		created_by_id,
		preview_id,
		name,
		comment
	from public.preview pr
	where pr.last_updated >= current_date - interval ''10 days''
	'
)
as t1 (
	id bigint,
	customer_id bigint,
	date_created timestamp with time zone,
	last_updated timestamp with time zone,
	note text,
	order_id bigint,
	state integer,
	class character varying(255),
	created_by_id bigint,
	preview_id bigint,
	name character varying(255),
	comment text
);


truncate table stage.postgres_principal;

insert into stage.postgres_principal
select *
from public.dblink(
	'postgres',
	'
	select
		id,
		version,
		account_expired,
		account_locked,
		email,
		enabled,
		password,
		password_expired,
		class,
		first_name,
		last_name,
		postfix,
		prefix,
		profile_id,
		salutation,
		gtc_accepted,
		date_created,
		last_login,
		last_updated,
		last_accessed_ip,
		token,
		facebook_page,
		telefon,
		salesforce_id,
		--photo,
		mail_password,
		referred_by_id,
		balance_strategy_resolver_string,
		mails_halt_to,
		credit,
		--data,
		default_page,
		stylelist_id,
		--additional_info,
		--social_info,
		favourite_preview_id,
		callable,
		balancer_enabled,
		national_id,
		formal,
		in_debt_collection,
		no_callable,
		guest_account
	from public.principal p
	where p.last_updated >= current_date - interval ''10 days''
	'
)
as t1 (
	id bigint,
	version bigint,
	account_expired boolean,
	account_locked boolean,
	email character varying(255),
	enabled boolean,
	password character varying(255),
	password_expired boolean,
	class character varying(255),
	first_name character varying(255),
	last_name character varying(255),
	postfix character varying(255),
	prefix character varying(255),
	profile_id bigint,
	salutation integer,
	gtc_accepted boolean,
	date_created timestamp with time zone,
	last_login timestamp with time zone,
	last_updated timestamp with time zone,
	last_accessed_ip character varying(100),
	token character varying(255),
	facebook_page character varying(255),
	telefon character varying(255),
	salesforce_id character varying(255),
	--photo bytea,
	mail_password character varying(255),
	referred_by_id bigint,
	balance_strategy_resolver_string character varying(255),
	mails_halt_to timestamp with time zone,
	credit integer,
	--data hstore,
	default_page character varying(255),
	stylelist_id bigint,
	--additional_info hstore,
	--social_info hstore,
	favourite_preview_id bigint,
	callable boolean,
	balancer_enabled boolean,
	national_id character varying(12),
	formal boolean,
	in_debt_collection boolean,
	no_callable boolean,
	guest_account boolean
);


truncate table stage.postgres_profile;

insert into stage.postgres_profile
select *
from public.dblink(
	'postgres',
	'
	select
		id,
		version,
		branch_working_in,
		date_of_birth,
		height_in_cm,
		phone_number,
		preferred_brand,
		preferred_contact_channel,
		preferred_contact_time,
		shirt_size,
		shoe_size,
		trousers_size,
		weight_in_kg,
		buying_problem_other,
		--buying_problems,
		newsletter_accepted,
		preferred_brand_other,
		spending_budget_for_jeans,
		spending_budget_for_shirts,
		spending_budget_for_shoes,
		branch_working_in_other,
		trousers_size_length,
		trousers_size_width,
		--photo,
		spending_budget_for_sakkos,
		date_created,
		last_updated,
		referral,
		date_newsletter_confirmed,
		send_to_external_questionnaire,
		preferred_language,
		collar_size,
		spending_budget_for_shirts_from,
		spending_budget_for_shirts_to,
		spending_budget_for_jeans_from,
		spending_budget_for_jeans_to,
		spending_budget_for_shoes_from,
		spending_budget_for_shoes_to,
		spending_budget_for_sakkos_from,
		spending_budget_for_sakkos_to,
		favorite_jeans_brand,
		favorite_jeans_fit,
		shirt_size_fit,
		jeans_width_fit,
		salesforce_migrated_at,
		subscribed_to_newsletter,
		subscribed_to_stylist_emails,
		subscribed_to_sms
	from public.profile pr
	where pr.last_updated >= current_date - interval ''10 days''
	'
)
as t1 (
	id bigint,
	version bigint,
	branch_working_in character varying(255),
	date_of_birth timestamp with time zone,
	height_in_cm integer,
	phone_number character varying(255),
	preferred_brand character varying(255),
	preferred_contact_channel character varying(5),
	preferred_contact_time character varying(255),
	shirt_size character varying(255),
	shoe_size character varying(255),
	trousers_size character varying(255),
	weight_in_kg integer,
	buying_problem_other character varying(255),
	--buying_problems bytea,
	newsletter_accepted boolean,
	preferred_brand_other character varying(255),
	spending_budget_for_jeans integer,
	spending_budget_for_shirts integer,
	spending_budget_for_shoes integer,
	branch_working_in_other character varying(255),
	trousers_size_length character varying(255),
	trousers_size_width character varying(255),
	--photo bytea,
	spending_budget_for_sakkos integer,
	date_created timestamp with time zone,
	last_updated timestamp with time zone,
	referral character varying(255),
	date_newsletter_confirmed timestamp with time zone,
	send_to_external_questionnaire boolean,
	preferred_language character varying(255),
	collar_size character varying(50),
	spending_budget_for_shirts_from bigint,
	spending_budget_for_shirts_to bigint,
	spending_budget_for_jeans_from bigint,
	spending_budget_for_jeans_to bigint,
	spending_budget_for_shoes_from bigint,
	spending_budget_for_shoes_to bigint,
	spending_budget_for_sakkos_from bigint,
	spending_budget_for_sakkos_to bigint,
	favorite_jeans_brand character varying(255),
	favorite_jeans_fit character varying(255),
	shirt_size_fit integer,
	jeans_width_fit integer,
	salesforce_migrated_at timestamp with time zone,
	subscribed_to_newsletter boolean,
	subscribed_to_stylist_emails boolean,
	subscribed_to_sms boolean
);


truncate table stage.postgres_supplier_article;

insert into stage.postgres_supplier_article
select *
from public.dblink(
	'postgres',
	'
	select
		id,
		version,
		article_id,
		date_created,
		last_updated,
		retail_price,
		sku,
		supplier_id,
		purchase_price,
		quantity,
		--data,
		active,
		ean,
		image_url,
		partner_shop_url,
		manufacturer_sku
	from public.supplier_article sa
	where sa.last_updated >= current_date - interval ''10 days''
	'
)
as t1 (
	id bigint,
	version bigint,
	article_id bigint,
	date_created timestamp with time zone,
	last_updated timestamp with time zone,
	retail_price numeric(19,2),
	sku character varying(255),
	supplier_id bigint,
	purchase_price numeric(19,2),
	quantity integer,
	--data hstore,
	active boolean,
	ean character varying(13),
	image_url character varying(256),
	partner_shop_url character varying(256),
	manufacturer_sku character varying(255)
);


truncate table stage.postgres_userconnection;

insert into stage.postgres_userconnection
select *
from public.dblink(
	'postgres',
	'
	select
		userid,
		providerid,
		provideruserid,
		accesstoken,
		displayname,
		expiretime,
		imageurl,
		profileurl,
		rank,
		refreshtoken,
		secret
	from public.userconnection uc
	'
)
as t1 (
	userid character varying(255),
	providerid character varying(255),
	provideruserid character varying(255),
	accesstoken character varying(1024),
	displayname character varying(255),
	expiretime bigint,
	imageurl character varying(255),
	profileurl character varying(255),
	rank bigint,
	refreshtoken character varying(255),
	secret character varying(255)
);


truncate table stage.postgres_voucher;

insert into stage.postgres_voucher
select *
from public.dblink(
	'postgres',
	'
	select
		id,
		version,
		date_created,
		last_updated,
		customer_id,
		order_id,
		file_url,
		voucher_type,
		amount,
		reference_number,
		parent_voucher_id
	from public.voucher inv
	where inv.last_updated >= current_date - interval ''10 days''
	'
)
as t1 (
	id bigint,
	version bigint,
	date_created timestamp with time zone,
	last_updated timestamp with time zone,
	customer_id bigint,
	order_id bigint,
	file_url character varying(255),
	voucher_type character varying(55),
	amount numeric(19,2),
	reference_number bigint,
	parent_voucher_id bigint
);






-- Import

truncate table import.arvato_payments;

insert into import.arvato_payments
select *
from public.dblink(
	'dv_dwh',
	'
	select
		mandantid,
		debitornumber,
		journalentrytype,
		ordernumber,
		journalentrynumber,
		journalentrydate,
		amount,
		currency,
		dunninglevel,
		returndebitnote,
		creditcardchargeback,
		indebtcollection,
		id,
		date_created
	from dwh.arvato_payments
	'
)
as t1 (
	mandantid character varying(4000),
	debitornumber character varying(4000),
	journalentrytype character varying(4000),
	ordernumber character varying(4000),
	journalentrynumber character varying(4000),
	journalentrydate character varying(4000),
	amount numeric(38,20),
	currency character varying(4000),
	dunninglevel character varying(4000),
	returndebitnote character varying(4000),
	creditcardchargeback character varying(4000),
	indebtcollection character varying(4000),
	id character varying(4000),
	date_created timestamp without time zone
);


truncate table import.vat_rates;

insert into import.vat_rates
select *
from public.dblink(
	'dv_dwh',
	'
	select
		country_code_iso,
		year_month,
		vat_rate
	from dwh.vat_rates
	'
)
as t1 (
	country_code_iso character(2),
	year_month character(7),
	vat_rate numeric
);


truncate table import.calendar;

insert into import.calendar
select *
from public.dblink(
	'dv_dwh',
	'
	select
		date,
		year,
		year_season,
		year_quarter,
		year_month,
		year_week,
		season_number,
		season,
		season_de,
		season_einkauf,
		month,
		week,
		day_of_month,
		day_of_week,
		day_name,
		month_name,
		last_day_of_month,
		last_day_of_week,
		business_day,
		working_days,
		next_ship_day
	from dwh.calendar
	'
)
as t1 (
	date date,
	year integer,
	year_season character(9),
	year_quarter character(7),
	year_month character(7),
	year_week character(7),
	season_number integer,
	season character(2),
	season_de character(2),
	season_einkauf character(4),
	month integer,
	week integer,
	day_of_month integer,
	day_of_week integer,
	day_name character(9),
	month_name character(9),
	last_day_of_month date,
	last_day_of_week date,
	business_day date,
	working_days smallint,
	next_ship_day date
);


truncate table import.historical_exchange_rates;

insert into import.historical_exchange_rates
select *
from public.dblink(
	'dv_dwh',
	'
	select
		date,
		currency_code,
		exchange_rate
	from dwh.historical_exchange_rates
	'
)
as t1 (
	date date,
	currency_code character(3),
	exchange_rate numeric
);


truncate table import.order_position_fixed_purchase_prices;

insert into import.order_position_fixed_purchase_prices
select *
from public.dblink(
	'dv_dwh',
	'
	select
		order_position_id,
		purchase_price_fixed
	from dwh.order_position_fixed_purchase_prices
	'
)
as t1 (
	order_position_id integer,
	purchase_price_fixed double precision
);

select public.dblink_disconnect('dv_dwh');
select public.dblink_disconnect('postgres');
