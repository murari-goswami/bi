

/*
select * into dwh.o8_4_r_cust_ord from raw.customer_order limit 0;
select * into dwh.o8_4_r_cust_ord_articles from raw.customer_order_articles limit 0;
select * into dwh.o8_4_r_cust_ord_logistics from raw.customer_order_logistics limit 0;
select * into dwh.o8_4_r_cust_ord_state_num from raw.customer_order_state_number limit 0;
select * into dwh.o8_4_t_fin_an_cred_crd_cmp from tableau.finance_analyse_credit_card_campaign limit 0;
select * into dwh.o8_4_t_styl_ovw_dash_lv from tableau.stylist_overview_dashboard_live limit 0;
select * into dwh.o8_4_t_styl_ovw_dash_lv_tday from tableau.stylist_overview_dashboard_live_created_today limit 0;
select * into dwh.o8_4_t_styl_ovw_live from tableau.stylist_overview_live limit 0;
*/

delete from dwh.o8_4_r_cust_ord;
delete from dwh.o8_4_r_cust_ord_articles;
delete from dwh.o8_4_r_cust_ord_logistics;
delete from dwh.o8_4_r_cust_ord_state_num;
delete from dwh.o8_4_t_fin_an_cred_crd_cmp;
delete from dwh.o8_4_t_styl_ovw_dash_lv;
delete from dwh.o8_4_t_styl_ovw_dash_lv_tday;
delete from dwh.o8_4_t_styl_ovw_live;

insert into dwh.o8_4_r_cust_ord select * from raw.customer_order where order_id in (select order_id from dwh.change_orders_20150923);
insert into dwh.o8_4_r_cust_ord_articles select * from raw.customer_order_articles where order_id in (select order_id from dwh.change_orders_20150923);
insert into dwh.o8_4_r_cust_ord_logistics select * from raw.customer_order_logistics where order_id in (select order_id from dwh.change_orders_20150923);
insert into dwh.o8_4_r_cust_ord_state_num select * from raw.customer_order_state_number where order_id in (select order_id from dwh.change_orders_20150923);
insert into dwh.o8_4_t_fin_an_cred_crd_cmp select * from tableau.finance_analyse_credit_card_campaign where id in (select order_id from dwh.change_orders_20150923);
insert into dwh.o8_4_t_styl_ovw_dash_lv select * from tableau.stylist_overview_dashboard_live where order_id in (select order_id from dwh.change_orders_20150923);
insert into dwh.o8_4_t_styl_ovw_dash_lv_tday select * from tableau.stylist_overview_dashboard_live_created_today where order_id in (select order_id from dwh.change_orders_20150923);
insert into dwh.o8_4_t_styl_ovw_live select * from tableau.stylist_overview_live where order_id in (select order_id from dwh.change_orders_20150923);

select 'dwh.o8_4_r_cust_ord' as table_name, count(*) from dwh.o8_4_r_cust_ord union all
select 'dwh.o8_4_r_cust_ord_articles' as table_name, count(*) from dwh.o8_4_r_cust_ord_articles union all
select 'dwh.o8_4_r_cust_ord_logistics' as table_name, count(*) from dwh.o8_4_r_cust_ord_logistics union all
select 'dwh.o8_4_r_cust_ord_state_num' as table_name, count(*) from dwh.o8_4_r_cust_ord_state_num union all
select 'dwh.o8_4_t_fin_an_cred_crd_cmp' as table_name, count(*) from dwh.o8_4_t_fin_an_cred_crd_cmp union all
select 'dwh.o8_4_t_styl_ovw_dash_lv' as table_name, count(*) from dwh.o8_4_t_styl_ovw_dash_lv union all
select 'dwh.o8_4_t_styl_ovw_dash_lv_tday' as table_name, count(*) from dwh.o8_4_t_styl_ovw_dash_lv_tday union all
select 'dwh.o8_4_t_styl_ovw_live' as table_name, count(*) from dwh.o8_4_t_styl_ovw_live;



/*
select * into dwh.bi_customer_order_logistics from bi.customer_order_logistics limit 0;
select * into dwh.bi_customer_order from bi.customer_order limit 0;
select * into dwh.tbl_billing_arvato_check from tableau.billing_arvato_check limit 0;
select * into dwh.tbl_bisdev_gift_orders from tableau.bisdev_gift_orders limit 0;
select * into dwh.tbl_bisdev_nps_reporting from tableau.bisdev_nps_reporting limit 0;
select * into dwh.tbl_busdev_ord_inac_onh_reas from tableau.busdev_orders_inactive_onhold_reasons limit 0;
select * into dwh.tbl_cvr_dash_ovw_sec from tableau.cvr_dashboard_overview_second_step limit 0;
select * into dwh.tbl_finance_sf_rep from tableau.finance_salesforce_reporting limit 0;
select * into dwh.tbl_management_order_type from tableau.management_order_type limit 0;
*/

delete from dwh.bi_customer_order_logistics;
delete from dwh.bi_customer_order;
delete from dwh.tbl_billing_arvato_check;
delete from dwh.tbl_bisdev_gift_orders;
delete from dwh.tbl_bisdev_nps_reporting;
delete from dwh.tbl_busdev_ord_inac_onh_reas;
delete from dwh.tbl_cvr_dash_ovw_sec;
delete from dwh.tbl_finance_sf_rep;
delete from dwh.tbl_management_order_type;

insert into dwh.bi_customer_order_logistics select * from bi.customer_order_logistics where order_id in (select order_id from dwh.change_orders_20150923);
insert into dwh.bi_customer_order select * from bi.customer_order where order_id in (select order_id from dwh.change_orders_20150923);
insert into dwh.tbl_billing_arvato_check select * from tableau.billing_arvato_check where order_id in (select order_id from dwh.change_orders_20150923);
insert into dwh.tbl_bisdev_gift_orders select * from tableau.bisdev_gift_orders where order_id in (select order_id from dwh.change_orders_20150923);
insert into dwh.tbl_bisdev_nps_reporting select * from tableau.bisdev_nps_reporting where order_id in (select order_id from dwh.change_orders_20150923);
insert into dwh.tbl_busdev_ord_inac_onh_reas select * from tableau.busdev_orders_inactive_onhold_reasons where order_id in (select order_id from dwh.change_orders_20150923);
insert into dwh.tbl_cvr_dash_ovw_sec select * from tableau.cvr_dashboard_overview_second_step where order_id in (select order_id from dwh.change_orders_20150923);
insert into dwh.tbl_finance_sf_rep select * from tableau.finance_salesforce_reporting where order_id in (select order_id from dwh.change_orders_20150923);
insert into dwh.tbl_management_order_type select * from tableau.management_order_type where order_id in (select order_id from dwh.change_orders_20150923);

select 'dwh.bi_customer_order_logistics' as table_name, count(*) from dwh.bi_customer_order_logistics union all
select 'dwh.bi_customer_order' as table_name, count(*) from dwh.bi_customer_order union all
select 'dwh.tbl_billing_arvato_check' as table_name, count(*) from dwh.tbl_billing_arvato_check union all
select 'dwh.tbl_bisdev_gift_orders' as table_name, count(*) from dwh.tbl_bisdev_gift_orders union all
select 'dwh.tbl_bisdev_nps_reporting' as table_name, count(*) from dwh.tbl_bisdev_nps_reporting union all
select 'dwh.tbl_busdev_ord_inac_onh_reas' as table_name, count(*) from dwh.tbl_busdev_ord_inac_onh_reas union all
select 'dwh.tbl_cvr_dash_ovw_sec' as table_name, count(*) from dwh.tbl_cvr_dash_ovw_sec union all
select 'dwh.tbl_finance_sf_rep' as table_name, count(*) from dwh.tbl_finance_sf_rep union all
select 'dwh.tbl_management_order_type' as table_name, count(*) from dwh.tbl_management_order_type;
