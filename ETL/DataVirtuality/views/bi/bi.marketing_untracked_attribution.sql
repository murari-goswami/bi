-- Name: bi.marketing_untracked_attribution
-- Created: 2015-06-11 17:27:44
-- Updated: 2015-09-10 12:35:29

CREATE VIEW bi.marketing_untracked_attribution
AS

SELECT
   ba."date",
   ba.reporting_type,
   ba.domain,
   ba.marketing_channel,
   ba.incoming_orders_adjusted,
   ba.invoiced_orders_adjusted,
   ba.sales_kept_adjusted,
   ba.sales_sent_adjusted,
   ba.billing_total_adjusted,
   ba.billing_net_sales_adjusted

FROM
(
   SELECT
      ca."date",
      ca.reporting_type,
      ca.domain,
      ca.marketing_channel,


      SUM(
         CASE 
         WHEN COALESCE(ab.incoming_orders_not_untracked, 0) = 0 AND COALESCE(ab.incoming_orders_untracked, 0) != 0 THEN mo.monthly_incoming_first_orders_share * ab.incoming_orders_untracked
         WHEN COALESCE(ab.incoming_orders_not_untracked, 0) = 0 THEN 0
         WHEN ab.incoming_orders_untracked is null THEN at.incoming_orders
         ELSE at.incoming_orders + (at.incoming_orders / ab.incoming_orders_not_untracked) * ab.incoming_orders_untracked
      END) AS incoming_orders_adjusted,

      SUM(
         CASE 
         WHEN COALESCE(ab.invoiced_orders_not_untracked, 0) = 0 AND COALESCE(ab.invoiced_orders_untracked, 0) != 0 THEN mo.monthly_invoiced_first_orders_share * ab.invoiced_orders_untracked
         WHEN COALESCE(ab.invoiced_orders_not_untracked, 0) = 0 THEN 0
         WHEN ab.invoiced_orders_untracked is null THEN at.invoiced_orders
         ELSE at.invoiced_orders + (at.invoiced_orders / ab.invoiced_orders_not_untracked) * ab.invoiced_orders_untracked
      END) AS invoiced_orders_adjusted,
      
      SUM(
         CASE 
         WHEN COALESCE(ab.sales_kept_not_untracked, 0) = 0 AND COALESCE(ab.sales_kept_untracked, 0) != 0 THEN mo.monthly_sales_kept_share * ab.sales_kept_untracked
         WHEN COALESCE(ab.sales_kept_not_untracked, 0) = 0 THEN 0
         WHEN ab.sales_kept_untracked is null THEN at.sales_kept
         ELSE at.sales_kept + (at.sales_kept / ab.sales_kept_not_untracked) * ab.sales_kept_untracked
      END) AS sales_kept_adjusted,

      SUM(
         CASE 
         WHEN COALESCE(ab.sales_sent_not_untracked, 0) = 0 AND COALESCE(ab.sales_sent_untracked, 0) != 0 THEN mo.monthly_sales_sent_share * ab.sales_sent_untracked
         WHEN COALESCE(ab.sales_sent_not_untracked, 0) = 0 THEN 0
         WHEN ab.sales_sent_untracked is null THEN at.sales_sent
         ELSE at.sales_sent + (at.sales_sent / ab.sales_sent_not_untracked) * ab.sales_sent_untracked
      END) AS sales_sent_adjusted,

      SUM(
         CASE 
         WHEN COALESCE(ab.billing_total_not_untracked, 0) = 0 AND COALESCE(ab.billing_total_untracked, 0) != 0 THEN mo.monthly_billing_total_share * ab.billing_total_untracked
         WHEN COALESCE(ab.billing_total_not_untracked, 0) = 0 THEN 0
         WHEN ab.billing_total_untracked is null THEN at.billing_total
         ELSE at.billing_total + (at.billing_total / ab.billing_total_not_untracked) * ab.billing_total_untracked
      END) AS billing_total_adjusted,

      SUM(
         CASE 
         WHEN COALESCE(ab.billing_net_sales_not_untracked, 0) = 0 AND COALESCE(ab.billing_net_sales_untracked, 0) != 0 THEN mo.monthly_billing_net_sales_share * ab.billing_net_sales_untracked
         WHEN COALESCE(ab.billing_net_sales_not_untracked, 0) = 0 THEN 0
         WHEN ab.billing_net_sales_untracked is null THEN at.billing_net_sales
         ELSE at.billing_net_sales + (at.billing_net_sales / ab.billing_net_sales_not_untracked) * ab.billing_net_sales_untracked
      END) AS billing_net_sales_adjusted

   FROM
   (
   SELECT
         rt.reporting_type,
         c.date,
         c.year_month,
         x.domain,
         x.marketing_channel
      FROM dwh.calendar c 
      CROSS JOIN (SELECT domain, marketing_channel FROM bi.marketing_order_attribution_aggregated GROUP BY 1,2) x
      CROSS JOIN (SELECT 'date_incoming' as reporting_type UNION SELECT 'date_invoiced' as reporting_type) rt
      WHERE c.date > '2012'
      AND c.date < CURDATE()
   ) ca

   /* These are the tracked orders and will serve as the starting point for the calculation  */ 
   LEFT JOIN
   (
      SELECT
         ag.reporting_type,
         ag."date",
         ag.domain,
         ag.marketing_channel,
         SUM(incoming_first_orders) as incoming_orders,
         SUM(invoiced_first_orders) as invoiced_orders,
         SUM(sales_sent) as sales_sent,
         SUM(sales_kept) as sales_kept,
         SUM(billing_total) as billing_total,
         SUM(billing_net_sales) as billing_net_sales
      FROM bi.marketing_order_attribution_aggregated ag
      WHERE marketing_channel != 'Untracked'
      GROUP BY 1,2,3,4
   ) at ON ca.date = at.date AND ca.domain = at.domain AND ca.reporting_type = at.reporting_type AND at.marketing_channel = ca.marketing_channel


   /* daily totals for calculation */
   LEFT JOIN
   (
      SELECT
         ag.reporting_type,
         ag."date",
         ag.domain,
         SUM(CASE WHEN mi.marketing_channel_group = 'Untracked' THEN incoming_first_orders ELSE null END) as incoming_orders_untracked,
         SUM(CASE WHEN mi.marketing_channel_group = 'Untracked' THEN invoiced_first_orders ELSE null END) as invoiced_orders_untracked,
         SUM(CASE WHEN mi.marketing_channel_group != 'Untracked' THEN incoming_first_orders ELSE null END) as incoming_orders_not_untracked,
         SUM(CASE WHEN mi.marketing_channel_group != 'Untracked' THEN invoiced_first_orders ELSE null END) as invoiced_orders_not_untracked,
         SUM(CASE WHEN mi.marketing_channel_group = 'Untracked' THEN sales_kept ELSE null END) as sales_kept_untracked,
         SUM(CASE WHEN mi.marketing_channel_group != 'Untracked' THEN sales_kept ELSE null END) as sales_kept_not_untracked,
         SUM(CASE WHEN mi.marketing_channel_group = 'Untracked' THEN sales_sent ELSE null END) as sales_sent_untracked,
         SUM(CASE WHEN mi.marketing_channel_group != 'Untracked' THEN sales_sent ELSE null END) as sales_sent_not_untracked,
         SUM(CASE WHEN mi.marketing_channel_group = 'Untracked' THEN billing_total ELSE null END) as billing_total_untracked,
         SUM(CASE WHEN mi.marketing_channel_group != 'Untracked' THEN billing_total ELSE null END) as billing_total_not_untracked,
         SUM(CASE WHEN mi.marketing_channel_group = 'Untracked' THEN billing_net_sales ELSE null END) as billing_net_sales_untracked,
         SUM(CASE WHEN mi.marketing_channel_group != 'Untracked' THEN billing_net_sales ELSE null END) as billing_net_sales_not_untracked
      FROM 
      (
         SELECT 
            reporting_type,
            "date",
            domain,
            marketing_channel,
            SUM(incoming_first_orders) as incoming_first_orders,
            SUM(invoiced_first_orders) as invoiced_first_orders,
            SUM(sales_sent) as sales_sent,
            SUM(sales_kept) as sales_kept,
            SUM(billing_net_sales) as billing_net_sales,
            SUM(billing_total) as billing_total
         FROM bi.marketing_order_attribution_aggregated
         GROUP BY 1,2,3,4
      ) ag
      LEFT JOIN dwh.marketing_investor_reporting_brand_factors mi ON mi.marketing_channel = ag.marketing_channel AND mi.domain = ag.domain
      GROUP BY 1,2,3
   ) ab ON ca.date = ab.date AND ca.domain = ab.domain AND ca.reporting_type = ab.reporting_type

   LEFT JOIN
   (
   /* When there are only untracked orders on a certain day, these orders can't be distributed by daily share and will be distributed by monthly share */
      SELECT
         mc.reporting_type,
         mc.year_month,
         mc.domain,
         mc.marketing_channel,
         CASE WHEN COALESCE(mt.invoiced_first_orders_monthly, 0) = 0 THEN 0 ELSE mc.invoiced_first_orders_monthly / mt.invoiced_first_orders_monthly END as monthly_invoiced_first_orders_share,
         CASE WHEN COALESCE(mt.incoming_first_orders_monthly, 0) = 0 THEN 0 ELSE mc.incoming_first_orders_monthly / mt.incoming_first_orders_monthly END as monthly_incoming_first_orders_share,
         CASE WHEN COALESCE(mt.sales_sent_monthly, 0) = 0 THEN 0 ELSE mc.sales_sent_monthly / mt.sales_sent_monthly END as monthly_sales_sent_share,
         CASE WHEN COALESCE(mt.sales_kept_monthly, 0) = 0 THEN 0 ELSE mc.sales_kept_monthly / mt.sales_kept_monthly END as monthly_sales_kept_share,
         CASE WHEN COALESCE(mt.billing_net_sales_monthly, 0) = 0 THEN 0 ELSE mc.billing_net_sales_monthly / mt.billing_net_sales_monthly END as monthly_billing_net_sales_share,
         CASE WHEN COALESCE(mt.billing_total_monthly, 0) = 0 THEN 0 ELSE  mc.billing_total_monthly / mt.billing_total_monthly END as monthly_billing_total_share
      FROM
      (
         SELECT 
            reporting_type,
            c.year_month,
            domain,
            marketing_channel,
            SUM(incoming_first_orders) as incoming_first_orders_monthly,
            SUM(invoiced_first_orders) as invoiced_first_orders_monthly,
            SUM(sales_sent) as sales_sent_monthly,
            SUM(sales_kept) as sales_kept_monthly,
            SUM(billing_net_sales) as billing_net_sales_monthly,
            SUM(billing_total) as billing_total_monthly
         FROM bi.marketing_order_attribution_aggregated ag
         LEFT JOIN dwh.calendar c ON c."date" = ag."date"
         WHERE marketing_channel != 'Untracked'
         GROUP BY 1,2,3,4
      ) mc
      LEFT JOIN
      (
         SELECT 
            reporting_type,
            c.year_month,
            domain,
            SUM(incoming_first_orders) as incoming_first_orders_monthly,
            SUM(invoiced_first_orders) as invoiced_first_orders_monthly,
            SUM(sales_sent) as sales_sent_monthly,
            SUM(sales_kept) as sales_kept_monthly,
            SUM(billing_net_sales) as billing_net_sales_monthly,
            SUM(billing_total) as billing_total_monthly
         FROM bi.marketing_order_attribution_aggregated ag
         LEFT JOIN dwh.calendar c ON c."date" = ag."date"
         WHERE marketing_channel != 'Untracked'
         GROUP BY 1,2,3
      ) mt ON mt.reporting_type = mc.reporting_type AND mt.year_month = mc.year_month AND mt.domain = mc.domain
   ) mo ON mo.reporting_type = ca.reporting_type AND mo.year_month = ca.year_month AND mo.domain = ca.domain AND mo.marketing_channel = ca.marketing_channel
   GROUP BY 1,2,3,4
) ba
WHERE COALESCE(ba.incoming_orders_adjusted, 0) != 0 OR COALESCE(ba.invoiced_orders_adjusted, 0) != 0


