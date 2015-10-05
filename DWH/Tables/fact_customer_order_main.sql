
-- ETL code for loading dwh.customer_order_apr_aug to dwh.fact_customer_order_main

drop table if exists dwh.batch;

create table dwh.batch as
select
    getdate() as batch_date,
    0 as batch_number
;

-- Generating DDL for all required tables, only run if the tables don't exist yet
/*
drop table if exists dwh.fact_customer_order_pk_lookup;

create table dwh.fact_customer_order_pk_lookup (
    entity_bk varchar(max) not null distkey,
    entity_key bigint not null identity
);

drop table if exists dwh.fact_customer_order_main_batch_info;

create table dwh.fact_customer_order_main_batch_info (
    entity_key bigint not null distkey,
    is_inferred smallint not null default 0,
    hash varchar(40),
    batch_date timestamp not null,
    batch_number bigint not null
);

drop table if exists dwh.fact_customer_order_main;

create table dwh.fact_customer_order_main (
    entity_key bigint distkey,
    order_id int8,
    parent_order_id_key bigint,
    parent_order_id int8,
    customer_id int8,
    preview_id int8,
    customer_preview_id int8,
    campaign_id int8,
    stylist_id int4,
    invoice_number int8,
    sales_channel varchar(255),
    sales_channel_special varchar(255),
    box_type varchar(4000),
    order_type varchar(4000),
    order_type_completed varchar(4000),
    order_state varchar(4000),
    order_state_number int4,
    revenue_state varchar(4000),
    kept_state varchar(4000),
    order_sales_stage varchar(4000),
    is_real_order varchar(4000),
    payment_type varchar(4000),
    payment_state varchar(4000),
    cancellation_reason varchar(255),
    pre_pay int4,
    arvato_result varchar(4000),
    arvato_score int4,
    sales_maximum_type varchar(255),
    sales_maximum numeric(38,20),
    ops_check varchar(1300),
    given_to_debt_collection bool,
    currency_code varchar(255),
    vat_percentage numeric(38,20),
    exchange_rate numeric(38,20),
    discount_type int4,
    discount_total numeric(38,20),
    discount_goodwill numeric(38,20),
    discount_marketing numeric(38,20),
    discount_paid_voucher numeric(38,20),
    articles_picked int8,
    articles_sent int8,
    articles_kept int8,
    articles_returned int8,
    sales_picked numeric(38,20),
    sales_sent numeric(38,20),
    sales_kept numeric(38,20),
    sales_returned numeric(38,20),
    billing_total numeric(38,20),
    billing_received numeric(38,20),
    billing_open numeric(38,20),
    billing_vat numeric(38,20),
    billing_net_sales numeric(38,20),
    cost_picked float8,
    cost_sent float8,
    cost_returned float8,
    cost_kept float8,
    own_stock_articles_sent int8,
    own_stock_articles_returne int8,
    own_stock_articles_kept int8,
    own_stock_sales_sent numeric(38,20),
    own_stock_sales_returned numeric(38,20),
    own_stock_sales_kept numeric(38,20),
    own_stock_cost_sent float8,
    own_stock_cost_returned float8,
    own_stock_cost_kept float8,
    partner_articles_sent int8,
    partner_articles_returned int8,
    partner_articles_kept int8,
    partner_sales_sent numeric(38,20),
    partner_sales_returned numeric(38,20),
    partner_sales_kept numeric(38,20),
    partner_cost_sent float8,
    partner_cost_returned float8,
    partner_cost_kept float8,
    own_stock_sales_kept_wo_ph numeric(38,20),
    own_stock_cost_kept_wo_ph float8,
    paul_hunter_sales_kept numeric(38,20),
    paul_hunter_cost_kept float8,
    date_created_key bigint,
    date_created timestamp,
    date_preview_created_key bigint,
    date_preview_created timestamp,
    date_incoming_key bigint,
    date_incoming timestamp,
    date_cancelled_key bigint,
    date_cancelled timestamp,
    date_prepay_to_credit_card_key bigint,
    date_prepay_to_credit_card timestamp,
    date_phone_call timestamp,
    date_phone_call_current timestamp,
    date_phone_call_original timestamp,
    date_next_contact date,
    date_stylist_picked timestamp,
    date_arvato_accepted timestamp,
    date_submitted timestamp,
    date_invoiced timestamp,
    date_shipped timestamp,
    date_shipped_internal timestamp,
    date_return_reminder timestamp,
    date_returned_online timestamp,
    date_return_registration timestamp,
    date_returned timestamp,
    date_completed timestamp,
    date_first_reminder timestamp,
    date_first_warning timestamp,
    date_second_warning timestamp,
    date_third_warning timestamp,
    date_given_to_debt_collect timestamp,
    date_paid timestamp,
    date_nps_submitted timestamp,
    aftership_return_confirmat varchar(4000),
    shipping_address_meets_bil varchar(4000),
    shipping_city varchar(4000),
    shipping_country varchar(4000),
    shipping_street varchar(4000),
    shipping_street_number varchar(255),
    shipping_zip varchar(255),
    shipping_first_name varchar(4000),
    shipping_last_name varchar(4000),
    shipping_co varchar(4000),
    billing_city varchar(4000),
    billing_country varchar(4000),
    billing_street varchar(4000),
    billing_street_number varchar(255),
    billing_zip varchar(255),
    billing_first_name varchar(4000),
    billing_last_name varchar(4000),
    billing_co varchar(4000),
    all_order_count int4,
    real_order_count int4,
    follow_on_count int4,
    all_order_count_completed int4,
    real_order_count_completed int4,
    customer_message_content varchar(500),
    inactive_reasons varchar(255),
    not_reached bool,
    wrong_phone_number bool,
    call_cancelled bool,
    call_confirmed bool,
    new_phone_appointment bool,
    calendar_full bool,
    nps_score int4,
    nps_customer_comment varchar(4000)
);

drop table if exists dwh.fact_customer_order_main_history;

create table dwh.fact_customer_order_main_history (
    -- History part
    is_inferred smallint default 0,
    hash varchar(40),
    batch_date timestamp,
    batch_number bigint,
    batch_date_new timestamp,
    batch_number_new bigint,
    -- Main part 
    entity_key bigint distkey,
    order_id int8,
    parent_order_id_key bigint,
    parent_order_id int8,
    customer_id int8,
    preview_id int8,
    customer_preview_id int8,
    campaign_id int8,
    stylist_id int4,
    invoice_number int8,
    sales_channel varchar(255),
    sales_channel_special varchar(255),
    box_type varchar(4000),
    order_type varchar(4000),
    order_type_completed varchar(4000),
    order_state varchar(4000),
    order_state_number int4,
    revenue_state varchar(4000),
    kept_state varchar(4000),
    order_sales_stage varchar(4000),
    is_real_order varchar(4000),
    payment_type varchar(4000),
    payment_state varchar(4000),
    cancellation_reason varchar(255),
    pre_pay int4,
    arvato_result varchar(4000),
    arvato_score int4,
    sales_maximum_type varchar(255),
    sales_maximum numeric(38,20),
    ops_check varchar(1300),
    given_to_debt_collection bool,
    currency_code varchar(255),
    vat_percentage numeric(38,20),
    exchange_rate numeric(38,20),
    discount_type int4,
    discount_total numeric(38,20),
    discount_goodwill numeric(38,20),
    discount_marketing numeric(38,20),
    discount_paid_voucher numeric(38,20),
    articles_picked int8,
    articles_sent int8,
    articles_kept int8,
    articles_returned int8,
    sales_picked numeric(38,20),
    sales_sent numeric(38,20),
    sales_kept numeric(38,20),
    sales_returned numeric(38,20),
    billing_total numeric(38,20),
    billing_received numeric(38,20),
    billing_open numeric(38,20),
    billing_vat numeric(38,20),
    billing_net_sales numeric(38,20),
    cost_picked float8,
    cost_sent float8,
    cost_returned float8,
    cost_kept float8,
    own_stock_articles_sent int8,
    own_stock_articles_returne int8,
    own_stock_articles_kept int8,
    own_stock_sales_sent numeric(38,20),
    own_stock_sales_returned numeric(38,20),
    own_stock_sales_kept numeric(38,20),
    own_stock_cost_sent float8,
    own_stock_cost_returned float8,
    own_stock_cost_kept float8,
    partner_articles_sent int8,
    partner_articles_returned int8,
    partner_articles_kept int8,
    partner_sales_sent numeric(38,20),
    partner_sales_returned numeric(38,20),
    partner_sales_kept numeric(38,20),
    partner_cost_sent float8,
    partner_cost_returned float8,
    partner_cost_kept float8,
    own_stock_sales_kept_wo_ph numeric(38,20),
    own_stock_cost_kept_wo_ph float8,
    paul_hunter_sales_kept numeric(38,20),
    paul_hunter_cost_kept float8,
    date_created_key bigint,
    date_created timestamp,
    date_preview_created_key bigint,
    date_preview_created timestamp,
    date_incoming_key bigint,
    date_incoming timestamp,
    date_cancelled_key bigint,
    date_cancelled timestamp,
    date_prepay_to_credit_card_key bigint,
    date_prepay_to_credit_card timestamp,
    date_phone_call timestamp,
    date_phone_call_current timestamp,
    date_phone_call_original timestamp,
    date_next_contact date,
    date_stylist_picked timestamp,
    date_arvato_accepted timestamp,
    date_submitted timestamp,
    date_invoiced timestamp,
    date_shipped timestamp,
    date_shipped_internal timestamp,
    date_return_reminder timestamp,
    date_returned_online timestamp,
    date_return_registration timestamp,
    date_returned timestamp,
    date_completed timestamp,
    date_first_reminder timestamp,
    date_first_warning timestamp,
    date_second_warning timestamp,
    date_third_warning timestamp,
    date_given_to_debt_collect timestamp,
    date_paid timestamp,
    date_nps_submitted timestamp,
    aftership_return_confirmat varchar(4000),
    shipping_address_meets_bil varchar(4000),
    shipping_city varchar(4000),
    shipping_country varchar(4000),
    shipping_street varchar(4000),
    shipping_street_number varchar(255),
    shipping_zip varchar(255),
    shipping_first_name varchar(4000),
    shipping_last_name varchar(4000),
    shipping_co varchar(4000),
    billing_city varchar(4000),
    billing_country varchar(4000),
    billing_street varchar(4000),
    billing_street_number varchar(255),
    billing_zip varchar(255),
    billing_first_name varchar(4000),
    billing_last_name varchar(4000),
    billing_co varchar(4000),
    all_order_count int4,
    real_order_count int4,
    follow_on_count int4,
    all_order_count_completed int4,
    real_order_count_completed int4,
    customer_message_content varchar(500),
    inactive_reasons varchar(255),
    not_reached bool,
    wrong_phone_number bool,
    call_cancelled bool,
    call_confirmed bool,
    new_phone_appointment bool,
    calendar_full bool,
    nps_score int4,
    nps_customer_comment varchar(4000)
);
*/

drop table if exists dwh.fact_customer_order_main_stage1;

create table dwh.fact_customer_order_main_stage1 as
select 
    order_id,
    parent_order_id,
    customer_id,
    preview_id,
    customer_preview_id,
    campaign_id,
    stylist_id,
    invoice_number,
    sales_channel,
    sales_channel_special,
    box_type,
    order_type,
    order_type_completed,
    order_state,
    order_state_number,
    revenue_state,
    kept_state,
    order_sales_stage,
    is_real_order,
    payment_type,
    payment_state,
    cancellation_reason,
    pre_pay,
    arvato_result,
    arvato_score,
    sales_maximum_type,
    sales_maximum,
    ops_check,
    given_to_debt_collection,
    currency_code,
    vat_percentage,
    exchange_rate,
    discount_type,
    discount_total,
    discount_goodwill,
    discount_marketing,
    discount_paid_voucher,
    articles_picked,
    articles_sent,
    articles_kept,
    articles_returned,
    sales_picked,
    sales_sent,
    sales_kept,
    sales_returned,
    billing_total,
    billing_received,
    billing_open,
    billing_vat,
    billing_net_sales,
    cost_picked,
    cost_sent,
    cost_returned,
    cost_kept,
    own_stock_articles_sent,
    own_stock_articles_returne,
    own_stock_articles_kept,
    own_stock_sales_sent,
    own_stock_sales_returned,
    own_stock_sales_kept,
    own_stock_cost_sent,
    own_stock_cost_returned,
    own_stock_cost_kept,
    partner_articles_sent,
    partner_articles_returned,
    partner_articles_kept,
    partner_sales_sent,
    partner_sales_returned,
    partner_sales_kept,
    partner_cost_sent,
    partner_cost_returned,
    partner_cost_kept,
    own_stock_sales_kept_wo_ph,
    own_stock_cost_kept_wo_ph,
    paul_hunter_sales_kept,
    paul_hunter_cost_kept,
    date_created,
    date_preview_created,
    date_incoming,
    date_cancelled,
    date_prepay_to_credit_card,
    date_phone_call,
    date_phone_call_current,
    date_phone_call_original,
    date_next_contact,
    date_stylist_picked,
    date_arvato_accepted,
    date_submitted,
    date_invoiced,
    date_shipped,
    date_shipped_internal,
    date_return_reminder,
    date_returned_online,
    date_return_registration,
    date_returned,
    date_completed,
    date_first_reminder,
    date_first_warning,
    date_second_warning,
    date_third_warning,
    date_given_to_debt_collect,
    date_paid,
    date_nps_submitted,
    aftership_return_confirmat,
    shipping_address_meets_bil,
    shipping_city,
    shipping_country,
    shipping_street,
    shipping_street_number,
    shipping_zip,
    shipping_first_name,
    shipping_last_name,
    shipping_co,
    billing_city,
    billing_country,
    billing_street,
    billing_street_number,
    billing_zip,
    billing_first_name,
    billing_last_name,
    billing_co,
    all_order_count,
    real_order_count,
    follow_on_count,
    all_order_count_completed,
    real_order_count_completed,
    customer_message_content,
    inactive_reasons,
    not_reached,
    wrong_phone_number,
    call_cancelled,
    call_confirmed,
    new_phone_appointment,
    calendar_full,
    nps_score,
    nps_customer_comment,
    nvl(order_id || '','') as entity_bk, 
    nvl(parent_order_id || '','') as parent_order_id_fact_customer_order_bk,
    nvl(to_char(date_created,'YYYYMMDD') || '','') as date_created_dim_calendar_bk,
    nvl(to_char(date_preview_created,'YYYYMMDD') || '','') as date_preview_created_dim_calendar_bk,
    nvl(to_char(date_incoming,'YYYYMMDD') || '','') as date_incoming_dim_calendar_bk,
    nvl(to_char(date_cancelled,'YYYYMMDD') || '','') as date_cancelled_dim_calendar_bk,
    nvl(to_char(date_prepay_to_credit_card,'YYYYMMDD') || '','') as date_prepay_to_credit_card_dim_calendar_bk,
    func_sha1( 
        nvl(order_id || '','') ||
        nvl(parent_order_id || '','') ||
        nvl(customer_id || '','') ||
        nvl(preview_id || '','') ||
        nvl(customer_preview_id || '','') ||
        nvl(campaign_id || '','') ||
        nvl(stylist_id || '','') ||
        nvl(invoice_number || '','') ||
        nvl(sales_channel || '','') ||
        nvl(sales_channel_special || '','') ||
        nvl(box_type || '','') ||
        nvl(order_type || '','') ||
        nvl(order_type_completed || '','') ||
        nvl(order_state || '','') ||
        nvl(order_state_number || '','') ||
        nvl(revenue_state || '','') ||
        nvl(kept_state || '','') ||
        nvl(order_sales_stage || '','') ||
        nvl(is_real_order || '','') ||
        nvl(payment_type || '','') ||
        nvl(payment_state || '','') ||
        nvl(cancellation_reason || '','') ||
        nvl(pre_pay || '','') ||
        nvl(arvato_result || '','') ||
        nvl(arvato_score || '','') ||
        nvl(sales_maximum_type || '','') ||
        nvl(sales_maximum || '','') ||
        nvl(ops_check || '','') ||
        nvl(given_to_debt_collection || '','') ||
        nvl(currency_code || '','') ||
        nvl(vat_percentage || '','') ||
        nvl(exchange_rate || '','') ||
        nvl(discount_type || '','') ||
        nvl(discount_total || '','') ||
        nvl(discount_goodwill || '','') ||
        nvl(discount_marketing || '','') ||
        nvl(discount_paid_voucher || '','') ||
        nvl(articles_picked || '','') ||
        nvl(articles_sent || '','') ||
        nvl(articles_kept || '','') ||
        nvl(articles_returned || '','') ||
        nvl(sales_picked || '','') ||
        nvl(sales_sent || '','') ||
        nvl(sales_kept || '','') ||
        nvl(sales_returned || '','') ||
        nvl(billing_total || '','') ||
        nvl(billing_received || '','') ||
        nvl(billing_open || '','') ||
        nvl(billing_vat || '','') ||
        nvl(billing_net_sales || '','') ||
        nvl(cost_picked || '','') ||
        nvl(cost_sent || '','') ||
        nvl(cost_returned || '','') ||
        nvl(cost_kept || '','') ||
        nvl(own_stock_articles_sent || '','') ||
        nvl(own_stock_articles_returne || '','') ||
        nvl(own_stock_articles_kept || '','') ||
        nvl(own_stock_sales_sent || '','') ||
        nvl(own_stock_sales_returned || '','') ||
        nvl(own_stock_sales_kept || '','') ||
        nvl(own_stock_cost_sent || '','') ||
        nvl(own_stock_cost_returned || '','') ||
        nvl(own_stock_cost_kept || '','') ||
        nvl(partner_articles_sent || '','') ||
        nvl(partner_articles_returned || '','') ||
        nvl(partner_articles_kept || '','') ||
        nvl(partner_sales_sent || '','') ||
        nvl(partner_sales_returned || '','') ||
        nvl(partner_sales_kept || '','') ||
        nvl(partner_cost_sent || '','') ||
        nvl(partner_cost_returned || '','') ||
        nvl(partner_cost_kept || '','') ||
        nvl(own_stock_sales_kept_wo_ph || '','') ||
        nvl(own_stock_cost_kept_wo_ph || '','') ||
        nvl(paul_hunter_sales_kept || '','') ||
        nvl(paul_hunter_cost_kept || '','') ||
        nvl(to_char(date_created,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_preview_created,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_incoming,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_cancelled,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_prepay_to_credit_card,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_phone_call,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_phone_call_current,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_phone_call_original,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_next_contact,'YYYYMMDD') || '','') ||
        nvl(to_char(date_stylist_picked,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_arvato_accepted,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_submitted,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_invoiced,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_shipped,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_shipped_internal,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_return_reminder,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_returned_online,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_return_registration,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_returned,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_completed,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_first_reminder,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_first_warning,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_second_warning,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_third_warning,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_given_to_debt_collect,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_paid,'YYYYMMDDHH24MISS') || '','') ||
        nvl(to_char(date_nps_submitted,'YYYYMMDDHH24MISS') || '','') ||
        nvl(aftership_return_confirmat || '','') ||
        nvl(shipping_address_meets_bil || '','') ||
        nvl(shipping_city || '','') ||
        nvl(shipping_country || '','') ||
        nvl(shipping_street || '','') ||
        nvl(shipping_street_number || '','') ||
        nvl(shipping_zip || '','') ||
        nvl(shipping_first_name || '','') ||
        nvl(shipping_last_name || '','') ||
        nvl(shipping_co || '','') ||
        nvl(billing_city || '','') ||
        nvl(billing_country || '','') ||
        nvl(billing_street || '','') ||
        nvl(billing_street_number || '','') ||
        nvl(billing_zip || '','') ||
        nvl(billing_first_name || '','') ||
        nvl(billing_last_name || '','') ||
        nvl(billing_co || '','') ||
        nvl(all_order_count || '','') ||
        nvl(real_order_count || '','') ||
        nvl(follow_on_count || '','') ||
        nvl(all_order_count_completed || '','') ||
        nvl(real_order_count_completed || '','') ||
        nvl(customer_message_content || '','') ||
        nvl(inactive_reasons || '','') ||
        nvl(not_reached || '','') ||
        nvl(wrong_phone_number || '','') ||
        nvl(call_cancelled || '','') ||
        nvl(call_confirmed || '','') ||
        nvl(new_phone_appointment || '','') ||
        nvl(calendar_full || '','') ||
        nvl(nps_score || '','') ||
        nvl(nps_customer_comment || '','')
    ) as hash,
    row_number() over (partition by entity_bk order by hash) as row_number
from (
    select 
        order_id,
        parent_order_id,
        customer_id,
        preview_id,
        customer_preview_id,
        campaign_id,
        stylist_id,
        invoice_number,
        sales_channel,
        sales_channel_special,
        box_type,
        order_type,
        order_type_completed,
        order_state,
        order_state_number,
        revenue_state,
        kept_state,
        order_sales_stage,
        is_real_order,
        payment_type,
        payment_state,
        cancellation_reason,
        pre_pay,
        arvato_result,
        arvato_score,
        sales_maximum_type,
        sales_maximum,
        ops_check,
        given_to_debt_collection,
        currency_code,
        vat_percentage,
        exchange_rate,
        discount_type,
        discount_total,
        discount_goodwill,
        discount_marketing,
        discount_paid_voucher,
        articles_picked,
        articles_sent,
        articles_kept,
        articles_returned,
        sales_picked,
        sales_sent,
        sales_kept,
        sales_returned,
        billing_total,
        billing_received,
        billing_open,
        billing_vat,
        billing_net_sales,
        cost_picked,
        cost_sent,
        cost_returned,
        cost_kept,
        own_stock_articles_sent,
        own_stock_articles_returne,
        own_stock_articles_kept,
        own_stock_sales_sent,
        own_stock_sales_returned,
        own_stock_sales_kept,
        own_stock_cost_sent,
        own_stock_cost_returned,
        own_stock_cost_kept,
        partner_articles_sent,
        partner_articles_returned,
        partner_articles_kept,
        partner_sales_sent,
        partner_sales_returned,
        partner_sales_kept,
        partner_cost_sent,
        partner_cost_returned,
        partner_cost_kept,
        own_stock_sales_kept_wo_ph,
        own_stock_cost_kept_wo_ph,
        paul_hunter_sales_kept,
        paul_hunter_cost_kept,
        date_created,
        date_preview_created,
        date_incoming,
        date_cancelled,
        date_prepay_to_credit_card,
        date_phone_call,
        date_phone_call_current,
        date_phone_call_original,
        date_next_contact,
        date_stylist_picked,
        date_arvato_accepted,
        date_submitted,
        date_invoiced,
        date_shipped,
        date_shipped_internal,
        date_return_reminder,
        date_returned_online,
        date_return_registration,
        date_returned,
        date_completed,
        date_first_reminder,
        date_first_warning,
        date_second_warning,
        date_third_warning,
        date_given_to_debt_collect,
        date_paid,
        date_nps_submitted,
        aftership_return_confirmat,
        shipping_address_meets_bil,
        shipping_city,
        shipping_country,
        shipping_street,
        shipping_street_number,
        shipping_zip,
        shipping_first_name,
        shipping_last_name,
        shipping_co,
        billing_city,
        billing_country,
        billing_street,
        billing_street_number,
        billing_zip,
        billing_first_name,
        billing_last_name,
        billing_co,
        all_order_count,
        real_order_count,
        follow_on_count,
        all_order_count_completed,
        real_order_count_completed,
        customer_message_content,
        inactive_reasons,
        not_reached,
        wrong_phone_number,
        call_cancelled,
        call_confirmed,
        new_phone_appointment,
        calendar_full,
        nps_score,
        nps_customer_comment
    from dwh.customer_order_apr_aug
    );


-- Inferred entities loading start

-- Inferred entity: fact_customer_order

drop table if exists dwh.fact_customer_order_inferred_stage;

create table dwh.fact_customer_order_inferred_stage as
select
    p.entity_key, -- Not null if entity exists, but was not loaded to this entity suffix before
    s1.parent_order_id_fact_customer_order_bk as entity_bk 
from dwh.fact_customer_order_main_stage1 s1
    left join dwh.fact_customer_order_pk_lookup p
        on p.entity_bk = s1.parent_order_id_fact_customer_order_bk
    left join dwh.fact_customer_order_batch_info bi
        on bi.entity_key = p.entity_key
where s1.row_number = 1
    and bi.entity_key is null -- Entity either completely new or was not loaded to this entity suffix before
group by 1,2
;

insert into dwh.fact_customer_order_pk_lookup (entity_bk)
select i.entity_bk
from dwh.fact_customer_order_inferred_stage i
where i.entity_key is null -- Entity is completely new
;

analyze dwh.fact_customer_order_pk_lookup;

insert into dwh.fact_customer_order_batch_info (
    entity_key,
    is_inferred,
    hash,
    batch_date,
    batch_number
)
select
    p.entity_key, -- Using just generated or already exising key which was not loaded to this entity suffix before
    1 as is_inferred,
    'dwh.fact_customer_order_main' as hash,
    b.batch_date,
    b.batch_number
from dwh.fact_customer_order_inferred_stage i
    left join dwh.fact_customer_order_pk_lookup p
        on p.entity_bk = i.entity_bk
    cross join dwh.batch b
;

analyze dwh.fact_customer_order_batch_info;

insert into dwh.fact_customer_order (
    entity_key 
)
select
    p.entity_key 
from dwh.fact_customer_order_inferred_stage i
    join dwh.fact_customer_order_pk_lookup p
        on p.entity_bk = i.entity_bk
;

analyze dwh.fact_customer_order;


-- Inferred entities loading end


-- Generating keys for new entities, populating the lookup

drop table if exists dwh.fact_customer_order_main_pk_batch_info_stage;

create table dwh.fact_customer_order_main_pk_batch_info_stage as
select
    s1.entity_bk,
    p.entity_key, -- Will be null for new entities
    bi.is_inferred as is_inferred_old,
    0 as is_inferred,
    bi.hash as hash_old, -- Saving old hash and batch information for updated entities
    s1.hash,
    bi.batch_date as batch_date_old,
    bi.batch_number as batch_number_old,
    b.batch_date,
    b.batch_number
from dwh.fact_customer_order_main_stage1 s1
    left join dwh.fact_customer_order_pk_lookup p
        on p.entity_bk = s1.entity_bk
    left join dwh.fact_customer_order_main_batch_info bi
        on bi.entity_key = p.entity_key
    cross join dwh.batch b
where s1.row_number = 1
    and ((p.entity_key is null)    -- New entity
        or (bi.entity_key is null) -- Entity key exists, but not in this entity subname (sattelite)
        or (bi.is_inferred = 1)     -- This entity subname was loaded, but as inferred
        or (bi.hash != s1.hash))    -- This entity subname was loaded, but the attributes changed
;

-- Inserting new entities to PK Lookup, generating keys

insert into dwh.fact_customer_order_pk_lookup (entity_bk)
select ps.entity_bk
from dwh.fact_customer_order_main_pk_batch_info_stage ps
where ps.entity_key is null
;

analyze dwh.fact_customer_order_pk_lookup;

-- Inserting Batch information and Hash for new entities

insert into dwh.fact_customer_order_main_batch_info (
    entity_key,
    is_inferred,
    hash,
    batch_date,
    batch_number
)
select
    p.entity_key,
    ps.is_inferred,
    ps.hash,
    ps.batch_date,
    ps.batch_number
from dwh.fact_customer_order_main_pk_batch_info_stage ps
    join dwh.fact_customer_order_pk_lookup p
        on p.entity_bk = ps.entity_bk
where ps.batch_number_old is null -- This entity subname wasn't loaded before
;

-- Updating Batch information and Hash for changed entities

update dwh.fact_customer_order_main_batch_info
set
    is_inferred = ps.is_inferred,
    hash = ps.hash,
    batch_date = ps.batch_date,
    batch_number = ps.batch_number
from dwh.fact_customer_order_main_pk_batch_info_stage ps
where ps.entity_key = dwh.fact_customer_order_main_batch_info.entity_key
    and ps.batch_number_old is not null -- This entity subname was already loaded
;

analyze dwh.fact_customer_order_main_batch_info;

-- Generating Stage2 table, similar to target table by structure

drop table if exists dwh.fact_customer_order_main_stage2;

create table dwh.fact_customer_order_main_stage2 as
select
    p.entity_key, 
    s1.order_id as order_id,
    p_parent_order_id_fact_customer_order.entity_key as parent_order_id_key,
    s1.parent_order_id as parent_order_id,
    s1.customer_id as customer_id,
    s1.preview_id as preview_id,
    s1.customer_preview_id as customer_preview_id,
    s1.campaign_id as campaign_id,
    s1.stylist_id as stylist_id,
    s1.invoice_number as invoice_number,
    s1.sales_channel as sales_channel,
    s1.sales_channel_special as sales_channel_special,
    s1.box_type as box_type,
    s1.order_type as order_type,
    s1.order_type_completed as order_type_completed,
    s1.order_state as order_state,
    s1.order_state_number as order_state_number,
    s1.revenue_state as revenue_state,
    s1.kept_state as kept_state,
    s1.order_sales_stage as order_sales_stage,
    s1.is_real_order as is_real_order,
    s1.payment_type as payment_type,
    s1.payment_state as payment_state,
    s1.cancellation_reason as cancellation_reason,
    s1.pre_pay as pre_pay,
    s1.arvato_result as arvato_result,
    s1.arvato_score as arvato_score,
    s1.sales_maximum_type as sales_maximum_type,
    s1.sales_maximum as sales_maximum,
    s1.ops_check as ops_check,
    s1.given_to_debt_collection as given_to_debt_collection,
    s1.currency_code as currency_code,
    s1.vat_percentage as vat_percentage,
    s1.exchange_rate as exchange_rate,
    s1.discount_type as discount_type,
    s1.discount_total as discount_total,
    s1.discount_goodwill as discount_goodwill,
    s1.discount_marketing as discount_marketing,
    s1.discount_paid_voucher as discount_paid_voucher,
    s1.articles_picked as articles_picked,
    s1.articles_sent as articles_sent,
    s1.articles_kept as articles_kept,
    s1.articles_returned as articles_returned,
    s1.sales_picked as sales_picked,
    s1.sales_sent as sales_sent,
    s1.sales_kept as sales_kept,
    s1.sales_returned as sales_returned,
    s1.billing_total as billing_total,
    s1.billing_received as billing_received,
    s1.billing_open as billing_open,
    s1.billing_vat as billing_vat,
    s1.billing_net_sales as billing_net_sales,
    s1.cost_picked as cost_picked,
    s1.cost_sent as cost_sent,
    s1.cost_returned as cost_returned,
    s1.cost_kept as cost_kept,
    s1.own_stock_articles_sent as own_stock_articles_sent,
    s1.own_stock_articles_returne as own_stock_articles_returne,
    s1.own_stock_articles_kept as own_stock_articles_kept,
    s1.own_stock_sales_sent as own_stock_sales_sent,
    s1.own_stock_sales_returned as own_stock_sales_returned,
    s1.own_stock_sales_kept as own_stock_sales_kept,
    s1.own_stock_cost_sent as own_stock_cost_sent,
    s1.own_stock_cost_returned as own_stock_cost_returned,
    s1.own_stock_cost_kept as own_stock_cost_kept,
    s1.partner_articles_sent as partner_articles_sent,
    s1.partner_articles_returned as partner_articles_returned,
    s1.partner_articles_kept as partner_articles_kept,
    s1.partner_sales_sent as partner_sales_sent,
    s1.partner_sales_returned as partner_sales_returned,
    s1.partner_sales_kept as partner_sales_kept,
    s1.partner_cost_sent as partner_cost_sent,
    s1.partner_cost_returned as partner_cost_returned,
    s1.partner_cost_kept as partner_cost_kept,
    s1.own_stock_sales_kept_wo_ph as own_stock_sales_kept_wo_ph,
    s1.own_stock_cost_kept_wo_ph as own_stock_cost_kept_wo_ph,
    s1.paul_hunter_sales_kept as paul_hunter_sales_kept,
    s1.paul_hunter_cost_kept as paul_hunter_cost_kept,
    p_date_created_dim_calendar.entity_key as date_created_key,
    s1.date_created as date_created,
    p_date_preview_created_dim_calendar.entity_key as date_preview_created_key,
    s1.date_preview_created as date_preview_created,
    p_date_incoming_dim_calendar.entity_key as date_incoming_key,
    s1.date_incoming as date_incoming,
    p_date_cancelled_dim_calendar.entity_key as date_cancelled_key,
    s1.date_cancelled as date_cancelled,
    p_date_prepay_to_credit_card_dim_calendar.entity_key as date_prepay_to_credit_card_key,
    s1.date_prepay_to_credit_card as date_prepay_to_credit_card,
    s1.date_phone_call as date_phone_call,
    s1.date_phone_call_current as date_phone_call_current,
    s1.date_phone_call_original as date_phone_call_original,
    s1.date_next_contact as date_next_contact,
    s1.date_stylist_picked as date_stylist_picked,
    s1.date_arvato_accepted as date_arvato_accepted,
    s1.date_submitted as date_submitted,
    s1.date_invoiced as date_invoiced,
    s1.date_shipped as date_shipped,
    s1.date_shipped_internal as date_shipped_internal,
    s1.date_return_reminder as date_return_reminder,
    s1.date_returned_online as date_returned_online,
    s1.date_return_registration as date_return_registration,
    s1.date_returned as date_returned,
    s1.date_completed as date_completed,
    s1.date_first_reminder as date_first_reminder,
    s1.date_first_warning as date_first_warning,
    s1.date_second_warning as date_second_warning,
    s1.date_third_warning as date_third_warning,
    s1.date_given_to_debt_collect as date_given_to_debt_collect,
    s1.date_paid as date_paid,
    s1.date_nps_submitted as date_nps_submitted,
    s1.aftership_return_confirmat as aftership_return_confirmat,
    s1.shipping_address_meets_bil as shipping_address_meets_bil,
    s1.shipping_city as shipping_city,
    s1.shipping_country as shipping_country,
    s1.shipping_street as shipping_street,
    s1.shipping_street_number as shipping_street_number,
    s1.shipping_zip as shipping_zip,
    s1.shipping_first_name as shipping_first_name,
    s1.shipping_last_name as shipping_last_name,
    s1.shipping_co as shipping_co,
    s1.billing_city as billing_city,
    s1.billing_country as billing_country,
    s1.billing_street as billing_street,
    s1.billing_street_number as billing_street_number,
    s1.billing_zip as billing_zip,
    s1.billing_first_name as billing_first_name,
    s1.billing_last_name as billing_last_name,
    s1.billing_co as billing_co,
    s1.all_order_count as all_order_count,
    s1.real_order_count as real_order_count,
    s1.follow_on_count as follow_on_count,
    s1.all_order_count_completed as all_order_count_completed,
    s1.real_order_count_completed as real_order_count_completed,
    s1.customer_message_content as customer_message_content,
    s1.inactive_reasons as inactive_reasons,
    s1.not_reached as not_reached,
    s1.wrong_phone_number as wrong_phone_number,
    s1.call_cancelled as call_cancelled,
    s1.call_confirmed as call_confirmed,
    s1.new_phone_appointment as new_phone_appointment,
    s1.calendar_full as calendar_full,
    s1.nps_score as nps_score,
    s1.nps_customer_comment as nps_customer_comment
from dwh.fact_customer_order_main_pk_batch_info_stage as ps    -- Only new, inferred or updated entities
    join dwh.fact_customer_order_main_stage1 as s1    -- Taking other columns from the source table
        on s1.entity_bk = ps.entity_bk
    join dwh.fact_customer_order_pk_lookup as p    -- Using just generated or already exising keys
        on p.entity_bk = ps.entity_bk 
    left join dwh.fact_customer_order_pk_lookup as p_parent_order_id_fact_customer_order
        on p_parent_order_id_fact_customer_order.entity_bk = s1.parent_order_id_fact_customer_order_bk
    left join dwh.dim_calendar_pk_lookup as p_date_created_dim_calendar
        on p_date_created_dim_calendar.entity_bk = s1.date_created_dim_calendar_bk
    left join dwh.dim_calendar_pk_lookup as p_date_preview_created_dim_calendar
        on p_date_preview_created_dim_calendar.entity_bk = s1.date_preview_created_dim_calendar_bk
    left join dwh.dim_calendar_pk_lookup as p_date_incoming_dim_calendar
        on p_date_incoming_dim_calendar.entity_bk = s1.date_incoming_dim_calendar_bk
    left join dwh.dim_calendar_pk_lookup as p_date_cancelled_dim_calendar
        on p_date_cancelled_dim_calendar.entity_bk = s1.date_cancelled_dim_calendar_bk
    left join dwh.dim_calendar_pk_lookup as p_date_prepay_to_credit_card_dim_calendar
        on p_date_prepay_to_credit_card_dim_calendar.entity_bk = s1.date_prepay_to_credit_card_dim_calendar_bk
where s1.row_number = 1
;

-- Inserting updated entities to History and deleting them from target table

insert into dwh.fact_customer_order_main_history
select
    ps.is_inferred_old as is_inferred,
    ps.hash_old as hash,
    ps.batch_date_old as batch_date,
    ps.batch_number_old as batch_number,
    ps.batch_date as batch_date_new,
    ps.batch_number as batch_number_new,
    t.*
from dwh.fact_customer_order_main t
    join dwh.fact_customer_order_main_pk_batch_info_stage ps
        on ps.entity_key = t.entity_key
where ps.batch_number_old is not null -- This entity suffix already existed
;

analyze dwh.fact_customer_order_main_history;

delete from dwh.fact_customer_order_main
where entity_key in ( -- or where exists
    select ps.entity_key
    from dwh.fact_customer_order_main_pk_batch_info_stage ps
    where ps.entity_key is not null
        and ps.batch_number_old is not null -- This entity suffix already existed
);

-- Inserting new, inferred and updated entities to the target table

insert into dwh.fact_customer_order_main ( 
    entity_key,
    order_id,
    parent_order_id_key,
    parent_order_id,
    customer_id,
    preview_id,
    customer_preview_id,
    campaign_id,
    stylist_id,
    invoice_number,
    sales_channel,
    sales_channel_special,
    box_type,
    order_type,
    order_type_completed,
    order_state,
    order_state_number,
    revenue_state,
    kept_state,
    order_sales_stage,
    is_real_order,
    payment_type,
    payment_state,
    cancellation_reason,
    pre_pay,
    arvato_result,
    arvato_score,
    sales_maximum_type,
    sales_maximum,
    ops_check,
    given_to_debt_collection,
    currency_code,
    vat_percentage,
    exchange_rate,
    discount_type,
    discount_total,
    discount_goodwill,
    discount_marketing,
    discount_paid_voucher,
    articles_picked,
    articles_sent,
    articles_kept,
    articles_returned,
    sales_picked,
    sales_sent,
    sales_kept,
    sales_returned,
    billing_total,
    billing_received,
    billing_open,
    billing_vat,
    billing_net_sales,
    cost_picked,
    cost_sent,
    cost_returned,
    cost_kept,
    own_stock_articles_sent,
    own_stock_articles_returne,
    own_stock_articles_kept,
    own_stock_sales_sent,
    own_stock_sales_returned,
    own_stock_sales_kept,
    own_stock_cost_sent,
    own_stock_cost_returned,
    own_stock_cost_kept,
    partner_articles_sent,
    partner_articles_returned,
    partner_articles_kept,
    partner_sales_sent,
    partner_sales_returned,
    partner_sales_kept,
    partner_cost_sent,
    partner_cost_returned,
    partner_cost_kept,
    own_stock_sales_kept_wo_ph,
    own_stock_cost_kept_wo_ph,
    paul_hunter_sales_kept,
    paul_hunter_cost_kept,
    date_created_key,
    date_created,
    date_preview_created_key,
    date_preview_created,
    date_incoming_key,
    date_incoming,
    date_cancelled_key,
    date_cancelled,
    date_prepay_to_credit_card_key,
    date_prepay_to_credit_card,
    date_phone_call,
    date_phone_call_current,
    date_phone_call_original,
    date_next_contact,
    date_stylist_picked,
    date_arvato_accepted,
    date_submitted,
    date_invoiced,
    date_shipped,
    date_shipped_internal,
    date_return_reminder,
    date_returned_online,
    date_return_registration,
    date_returned,
    date_completed,
    date_first_reminder,
    date_first_warning,
    date_second_warning,
    date_third_warning,
    date_given_to_debt_collect,
    date_paid,
    date_nps_submitted,
    aftership_return_confirmat,
    shipping_address_meets_bil,
    shipping_city,
    shipping_country,
    shipping_street,
    shipping_street_number,
    shipping_zip,
    shipping_first_name,
    shipping_last_name,
    shipping_co,
    billing_city,
    billing_country,
    billing_street,
    billing_street_number,
    billing_zip,
    billing_first_name,
    billing_last_name,
    billing_co,
    all_order_count,
    real_order_count,
    follow_on_count,
    all_order_count_completed,
    real_order_count_completed,
    customer_message_content,
    inactive_reasons,
    not_reached,
    wrong_phone_number,
    call_cancelled,
    call_confirmed,
    new_phone_appointment,
    calendar_full,
    nps_score,
    nps_customer_comment
)
select 
    entity_key,
    order_id,
    parent_order_id_key,
    parent_order_id,
    customer_id,
    preview_id,
    customer_preview_id,
    campaign_id,
    stylist_id,
    invoice_number,
    sales_channel,
    sales_channel_special,
    box_type,
    order_type,
    order_type_completed,
    order_state,
    order_state_number,
    revenue_state,
    kept_state,
    order_sales_stage,
    is_real_order,
    payment_type,
    payment_state,
    cancellation_reason,
    pre_pay,
    arvato_result,
    arvato_score,
    sales_maximum_type,
    sales_maximum,
    ops_check,
    given_to_debt_collection,
    currency_code,
    vat_percentage,
    exchange_rate,
    discount_type,
    discount_total,
    discount_goodwill,
    discount_marketing,
    discount_paid_voucher,
    articles_picked,
    articles_sent,
    articles_kept,
    articles_returned,
    sales_picked,
    sales_sent,
    sales_kept,
    sales_returned,
    billing_total,
    billing_received,
    billing_open,
    billing_vat,
    billing_net_sales,
    cost_picked,
    cost_sent,
    cost_returned,
    cost_kept,
    own_stock_articles_sent,
    own_stock_articles_returne,
    own_stock_articles_kept,
    own_stock_sales_sent,
    own_stock_sales_returned,
    own_stock_sales_kept,
    own_stock_cost_sent,
    own_stock_cost_returned,
    own_stock_cost_kept,
    partner_articles_sent,
    partner_articles_returned,
    partner_articles_kept,
    partner_sales_sent,
    partner_sales_returned,
    partner_sales_kept,
    partner_cost_sent,
    partner_cost_returned,
    partner_cost_kept,
    own_stock_sales_kept_wo_ph,
    own_stock_cost_kept_wo_ph,
    paul_hunter_sales_kept,
    paul_hunter_cost_kept,
    date_created_key,
    date_created,
    date_preview_created_key,
    date_preview_created,
    date_incoming_key,
    date_incoming,
    date_cancelled_key,
    date_cancelled,
    date_prepay_to_credit_card_key,
    date_prepay_to_credit_card,
    date_phone_call,
    date_phone_call_current,
    date_phone_call_original,
    date_next_contact,
    date_stylist_picked,
    date_arvato_accepted,
    date_submitted,
    date_invoiced,
    date_shipped,
    date_shipped_internal,
    date_return_reminder,
    date_returned_online,
    date_return_registration,
    date_returned,
    date_completed,
    date_first_reminder,
    date_first_warning,
    date_second_warning,
    date_third_warning,
    date_given_to_debt_collect,
    date_paid,
    date_nps_submitted,
    aftership_return_confirmat,
    shipping_address_meets_bil,
    shipping_city,
    shipping_country,
    shipping_street,
    shipping_street_number,
    shipping_zip,
    shipping_first_name,
    shipping_last_name,
    shipping_co,
    billing_city,
    billing_country,
    billing_street,
    billing_street_number,
    billing_zip,
    billing_first_name,
    billing_last_name,
    billing_co,
    all_order_count,
    real_order_count,
    follow_on_count,
    all_order_count_completed,
    real_order_count_completed,
    customer_message_content,
    inactive_reasons,
    not_reached,
    wrong_phone_number,
    call_cancelled,
    call_confirmed,
    new_phone_appointment,
    calendar_full,
    nps_score,
    nps_customer_comment
from dwh.fact_customer_order_main_stage2
;

analyze dwh.fact_customer_order_main;
