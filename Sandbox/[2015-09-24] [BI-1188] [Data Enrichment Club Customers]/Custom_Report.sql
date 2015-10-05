SELECT
  cu.customer_id,
  co.nb_orders,
  formatDouble(co.billing_total, '#,##0.00;($#,##0.00)') as billing_total,
  co.currency_code,
  cu.formal,
  cu.last_name,
  cu.first_name,
  ci.shipping_street,
  ci.shipping_street_number,
  ci.shipping_country,
  ci.city,
  ci.zip,
  cu.email,
  formatDouble(co.billing_recieved_total, '#,##0.00;($#,##0.00)') as billing_recieved_total,
  co.currency_code
FROM bi.customer cu
JOIN 
(
  SELECT
    distinct(customer_id) as "customer_id",
    currency_code,
    COUNT(DISTINCT order_id) as nb_orders,
    cast(SUM(CASE WHEN order_state= 'Completed' THEN billing_total ELSE 0 END) as double)as "billing_total",
    cast(SUM(CASE WHEN order_state= 'Completed' THEN billing_received ELSE NULL END) as double)as "billing_recieved_total"
  FROM bi.customer_order
  GROUP BY  customer_id, currency_code
) co on cu.customer_id=co.customer_id
LEFT JOIN
(
  SELECT
    ab.customer_id,
    ab.shipping_street,
    ab.shipping_street_number,
    ab.shipping_city as city,
    ab.shipping_zip as zip,
    ab.shipping_country as shipping_country
  FROM
  (
    SELECT 
      co.customer_id,
      co.shipping_street,
      co.shipping_street_number,
      co.shipping_city,
      co.shipping_zip,
      co.shipping_country,
      rank() OVER (PARTITION BY co.customer_id ORDER BY co.date_created DESC) as rank
    FROM bi.customer_order co
    WHERE date_invoiced is not null
  ) ab
  WHERE rank = 1
) ci ON ci.customer_id = cu.customer_id
where cu.customer_id in (5066732,6137814,9290260,10432055,12436517,12452255,13669070,28189900,38244208,39655962,41198476,43026326,49809160,55576042,57980715,58319754,60200632,72393299,98141047,129079506,134593042,138692976,141938750,174821712,188396112,203663823,204307932,205955509,206124566,206891407,207235505,208295196,209830662,209903354,213669425,213849716,215048634,215333043,215480313,215774223,216208553,217164809,220610730,222358475,222489729,224690559,225593394,228075619,228257389,229068676,235611862,237198864,244192949) 
AND cu.user_type != 'Test User';