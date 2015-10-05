SELECT count(*)
FROM public.address ship_add
WHERE ship_add.id IN
    (SELECT co.shipping_address_id
     FROM public.customer_order co
     WHERE co.date_created > '2015-08-01');


SELECT count(*)
FROM public.audit_log al
WHERE CAST(al.persisted_object_id as bigint) in
    (SELECT co.id
     FROM public.customer_order co
     WHERE co.date_created > '2015-08-01');


SELECT count(*)
FROM public.customer_order co
WHERE co.date_created > '2015-08-01';


SELECT count(*)
FROM public.customer_subscription cl
WHERE cl.customer_id IN
    (SELECT p.id
     FROM public.principal p
     WHERE p.id IN
         (SELECT co.customer_id
          FROM public.customer_order co
          WHERE co.date_created > '2015-08-01'));


SELECT count(*)
FROM public.doc_data_manifest_shipping dd_ms
WHERE dd_ms.orderid IN
    (SELECT cast(co.id AS varchar)
     FROM public.customer_order co
     WHERE co.date_created > '2015-08-01');


SELECT count(*)
FROM public.doc_data_shipment_confirmation dd_sc
WHERE dd_sc.orderid IN
    (SELECT cast(co.id AS varchar)
     FROM public.customer_order co
     WHERE co.date_created > '2015-08-01');


SELECT count(*)
FROM public.order_cancellation can
WHERE can.order_id IN
    (SELECT co.id
     FROM public.customer_order co
     WHERE co.date_created > '2015-08-01');


SELECT count(*)
FROM public.order_cancellation_reason ocr
WHERE ocr.id IN
    (SELECT can.order_cancellation_reason_id
     FROM public.order_cancellation can
     WHERE can.order_id IN
         (SELECT co.id
          FROM public.customer_order co
          WHERE co.date_created > '2015-08-01'));


SELECT count(*)
FROM public.order_position op
WHERE op.order_id IN
    (SELECT co.id
     FROM public.customer_order co
     WHERE co.date_created > '2015-08-01');


SELECT count(*)
FROM public.preview pr
WHERE pr.order_id IN
    (SELECT co.id
     FROM public.customer_order co
     WHERE co.date_created > '2015-08-01');


SELECT count(*)
FROM public.principal p
WHERE p.id IN
    (SELECT co.customer_id
     FROM public.customer_order co
     WHERE co.date_created > '2015-08-01');


SELECT count(*)
FROM public.profile pr
WHERE pr.id IN
    (SELECT p.profile_id
     FROM public.principal p
     WHERE p.id IN
         (SELECT co.customer_id
          FROM public.customer_order co
          WHERE co.date_created > '2015-08-01'));


SELECT count(*)
FROM public.supplier_article sa
WHERE sa.article_id IN
    (SELECT op.article_id
     FROM public.order_position op
     WHERE op.order_id IN
         (SELECT co.id
          FROM public.customer_order co
          WHERE co.date_created > '2015-08-01'));


SELECT count(*)
FROM public.userconnection uc
WHERE uc.userid IN
    (SELECT p.email
     FROM public.principal p
     WHERE p.id IN
         (SELECT co.customer_id
          FROM public.customer_order co
          WHERE co.date_created > '2015-08-01'));


SELECT count(*)
FROM public.voucher inv
WHERE inv.order_id IN
    (SELECT co.id
     FROM public.customer_order co
     WHERE co.date_created > '2015-08-01');

