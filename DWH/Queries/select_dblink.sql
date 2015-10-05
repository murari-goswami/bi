TRUNCATE TABLE stage.postgres_address;

INSERT INTO stage.postgres_address
SELECT *
FROM dblink(
	'hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>',
	'
	SELECT *
	FROM public.address ship_add
	WHERE ship_add.id IN
		(SELECT co.shipping_address_id
		 FROM public.customer_order co
		 WHERE co.date_created > ''2015-08-01'')
	'
)
AS t1 (
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


TRUNCATE TABLE stage.postgres_audit_log;

INSERT INTO stage.postgres_audit_log
SELECT *
FROM dblink(
	'hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>',
	'
	SELECT *
	FROM public.audit_log al
	WHERE CAST(al.persisted_object_id as bigint) in
		(SELECT co.id
		 FROM public.customer_order co
		 WHERE co.date_created > ''2015-08-01'')
	'
)
AS t1 (
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


TRUNCATE TABLE stage.postgres_customer_order;

INSERT INTO stage.postgres_customer_order
SELECT *
FROM dblink(
	'hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>',
	'
	SELECT *
	FROM public.customer_order co
	WHERE co.date_created > ''2015-08-01''
	'
)
AS t1 (
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
	additional_info hstore,
	additional_info_map bytea,
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


TRUNCATE TABLE stage.postgres_customer_subscription;

INSERT INTO stage.postgres_customer_subscription
SELECT *
FROM dblink(
	'hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>',
	'
	SELECT *
	FROM public.customer_subscription cl
	WHERE cl.customer_id IN
		(SELECT p.id
		 FROM public.principal p
		 WHERE p.id IN
			 (SELECT co.customer_id
				FROM public.customer_order co
				WHERE co.date_created > ''2015-08-01''))
	'
)
AS t1 (
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


TRUNCATE TABLE stage.postgres_doc_data_manifest_shipping;

INSERT INTO stage.postgres_doc_data_manifest_shipping
SELECT *
FROM dblink(
	'hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>',
	'
	SELECT *
	FROM public.doc_data_manifest_shipping dd_ms
	WHERE dd_ms.orderid IN
		(SELECT cast(co.id AS varchar)
		 FROM public.customer_order co
		 WHERE co.date_created > ''2015-08-01'')
	'
)
AS t1 (
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


TRUNCATE TABLE stage.postgres_doc_data_shipment_confirmation;

INSERT INTO stage.postgres_doc_data_shipment_confirmation
SELECT *
FROM dblink(
	'hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>',
	'
	SELECT *
	FROM public.doc_data_shipment_confirmation dd_sc
	WHERE dd_sc.orderid IN
		(SELECT cast(co.id AS varchar)
		 FROM public.customer_order co
		 WHERE co.date_created > ''2015-08-01'')
	'
)
AS t1 (
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


TRUNCATE TABLE stage.postgres_order_cancellation;

INSERT INTO stage.postgres_order_cancellation
SELECT *
FROM dblink(
	'hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>',
	'
	SELECT *
	FROM public.order_cancellation can
	WHERE can.order_id IN
		(SELECT co.id
		 FROM public.customer_order co
		 WHERE co.date_created > ''2015-08-01'')
	'
)
AS t1 (
	id bigint,
	version bigint,
	date_created timestamp without time zone,
	order_id bigint,
	order_cancellation_reason_id bigint
);


TRUNCATE TABLE stage.postgres_order_cancellation_reason;

INSERT INTO stage.postgres_order_cancellation_reason
SELECT *
FROM dblink(
	'hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>',
	'
	SELECT *
	FROM public.order_cancellation_reason ocr
	WHERE ocr.id IN
		(SELECT can.order_cancellation_reason_id
		 FROM public.order_cancellation can
		 WHERE can.order_id IN
			 (SELECT co.id
				FROM public.customer_order co
				WHERE co.date_created > ''2015-08-01''))
	'
)
AS t1 (
	id bigint,
	version bigint,
	reason character varying(255),
	reference_key character varying(255)
);


TRUNCATE TABLE stage.postgres_order_position;

INSERT INTO stage.postgres_order_position
SELECT *
FROM dblink(
	'hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>',
	'
	SELECT *
	FROM public.order_position op
	WHERE op.order_id IN
		(SELECT co.id
		 FROM public.customer_order co
		 WHERE co.date_created > ''2015-08-01'')
	'
)
AS t1 (
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


TRUNCATE TABLE stage.postgres_preview;

INSERT INTO stage.postgres_preview
SELECT *
FROM dblink(
	'hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>',
	'
	SELECT *
	FROM public.preview pr
	WHERE pr.order_id IN
		(SELECT co.id
		 FROM public.customer_order co
		 WHERE co.date_created > ''2015-08-01'')
	'
)
AS t1 (
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


TRUNCATE TABLE stage.postgres_principal;

INSERT INTO stage.postgres_principal
SELECT *
FROM dblink(
	'hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>',
	'
	SELECT *
	FROM public.principal p
	WHERE p.id IN
		(SELECT co.customer_id
		 FROM public.customer_order co
		 WHERE co.date_created > ''2015-08-01'')
	'
)
AS t1 (
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
	photo bytea,
	mail_password character varying(255),
	referred_by_id bigint,
	balance_strategy_resolver_string character varying(255),
	mails_halt_to timestamp with time zone,
	credit integer,
	data hstore,
	default_page character varying(255),
	stylelist_id bigint,
	additional_info hstore,
	social_info hstore,
	favourite_preview_id bigint,
	callable boolean,
	balancer_enabled boolean,
	national_id character varying(12),
	formal boolean,
	in_debt_collection boolean,
	no_callable boolean,
	guest_account boolean
);


TRUNCATE TABLE stage.postgres_profile;

INSERT INTO stage.postgres_profile
SELECT *
FROM dblink(
	'hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>',
	'
	SELECT *
	FROM public.profile pr
	WHERE pr.id IN
		(SELECT p.profile_id
		 FROM public.principal p
		 WHERE p.id IN
			 (SELECT co.customer_id
				FROM public.customer_order co
				WHERE co.date_created > ''2015-08-01''))
	'
)
AS t1 (
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
	buying_problems bytea,
	newsletter_accepted boolean,
	preferred_brand_other character varying(255),
	spending_budget_for_jeans integer,
	spending_budget_for_shirts integer,
	spending_budget_for_shoes integer,
	branch_working_in_other character varying(255),
	trousers_size_length character varying(255),
	trousers_size_width character varying(255),
	photo bytea,
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


TRUNCATE TABLE stage.postgres_supplier_article;

INSERT INTO stage.postgres_supplier_article
SELECT *
FROM dblink(
	'hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>',
	'
	SELECT *
	FROM public.supplier_article sa
	WHERE sa.article_id IN
		(SELECT op.article_id
		 FROM public.order_position op
		 WHERE op.order_id IN
			 (SELECT co.id
				FROM public.customer_order co
				WHERE co.date_created > ''2015-08-01''))
	'
)
AS t1 (
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
	data hstore,
	active boolean,
	ean character varying(13),
	image_url character varying(256),
	partner_shop_url character varying(256),
	manufacturer_sku character varying(255)
);


TRUNCATE TABLE stage.postgres_userconnection;

INSERT INTO stage.postgres_userconnection
SELECT *
FROM dblink(
	'hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>',
	'
	SELECT *
	FROM public.userconnection uc
	WHERE uc.userid IN
		(SELECT p.email
		 FROM public.principal p
		 WHERE p.id IN
			 (SELECT co.customer_id
				FROM public.customer_order co
				WHERE co.date_created > ''2015-08-01''))
	'
)
AS t1 (
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


TRUNCATE TABLE stage.postgres_voucher;

INSERT INTO stage.postgres_voucher
SELECT *
FROM dblink(
	'hostaddr=188.40.103.75 port=5432 dbname=paul-production user=datavirtuality password=<password>',
	'
	SELECT *
	FROM public.voucher inv
	WHERE inv.order_id IN
		(SELECT co.id
		 FROM public.customer_order co
		 WHERE co.date_created > ''2015-08-01'')
	'
)
AS t1 (
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






-- DWH

TRUNCATE TABLE datamart.arvato_payments;

INSERT INTO datamart.arvato_payments
SELECT *
FROM dblink(
	'hostaddr=10.0.0.54 port=5432 dbname=dv_r172 user=postgres password=<password>',
	'
	SELECT *
	FROM dwh.arvato_payments
	'
)
AS t1 (
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


TRUNCATE TABLE datamart.vat_rates;

INSERT INTO datamart.vat_rates
SELECT *
FROM dblink(
	'hostaddr=10.0.0.54 port=5432 dbname=dv_r172 user=postgres password=<password>',
	'
	SELECT *
	FROM dwh.vat_rates
	'
)
AS t1 (
  country_code_iso character(2),
  year_month character(7),
  vat_rate numeric
);


TRUNCATE TABLE datamart.calendar;

INSERT INTO datamart.calendar
SELECT *
FROM dblink(
	'hostaddr=10.0.0.54 port=5432 dbname=dv_r172 user=postgres password=<password>',
	'
	SELECT *
	FROM dwh.calendar
	'
)
AS t1 (
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


TRUNCATE TABLE datamart.historical_exchange_rates;

INSERT INTO datamart.historical_exchange_rates
SELECT *
FROM dblink(
	'hostaddr=10.0.0.54 port=5432 dbname=dv_r172 user=postgres password=<password>',
	'
	SELECT *
	FROM dwh.historical_exchange_rates
	'
)
AS t1 (
  date date,
  currency_code character(3),
  exchange_rate numeric
);


TRUNCATE TABLE datamart.order_position_fixed_purchase_prices;

INSERT INTO datamart.order_position_fixed_purchase_prices
SELECT *
FROM dblink(
	'hostaddr=10.0.0.54 port=5432 dbname=dv_r172 user=postgres password=<password>',
	'
	SELECT *
	FROM dwh.order_position_fixed_purchase_prices
	'
)
AS t1 (
  order_position_id integer,
  purchase_price_fixed double precision
);
