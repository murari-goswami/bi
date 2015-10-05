-- Name: views.article_own_stock
-- Created: 2015-04-24 18:23:01
-- Updated: 2015-08-07 10:58:59

CREATE view views.article_own_stock
AS
select 
	op.article_id,
	sa.pic2,
	sa.pic3,
	sa.pic4,
	sa.pic5,
	sa.amidala_check,
	
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 4 THEN quantity ELSE 0 END) AS Int_4, 
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 4 THEN quantity*op.retail_price ELSE 0 END) AS Int_4_vk_wert, 
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 4 THEN quantity*op.retail_price_euro ELSE 0 END) AS Int_4_vk_wert_euro,
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 4 THEN quantity*op.purchase_price ELSE 0 END) AS Int_4_ek_wert,
	
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 8 THEN quantity ELSE 0 END) AS Placed_8, 
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 8 THEN quantity*op.retail_price ELSE 0 END) AS Placed_8_vk_wert,
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 8 THEN quantity*op.retail_price_euro ELSE 0 END) AS Placed_8_vk_wert_euro,
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 8 THEN quantity*op.purchase_price ELSE 0 END) AS Placed_8_ek_wert,
	
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 16 and co.state != 16 THEN quantity ELSE 0 END) AS Picked_16,
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 16 and co.state != 16 THEN quantity*op.retail_price ELSE 0 END) AS Picked_16_vk_wert,
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 16 and co.state != 16 THEN quantity*op.retail_price_euro ELSE 0 END) AS Picked_16_vk_wert_euro,
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 16 and co.state != 16 THEN quantity*op.purchase_price ELSE 0 END) AS Picked_16_ek_wert,
	
	SUM(CASE WHEN op.stock_location_id=2 and op.state=16 and co.state = 20 THEN quantity ELSE 0 END) AS PO_20,
	SUM(CASE WHEN op.stock_location_id=2 and op.state=16 and co.state = 20 THEN quantity*op.retail_price ELSE 0 END) AS PO_20_vk_wert,
	SUM(CASE WHEN op.stock_location_id=2 and op.state=16 and co.state = 20 THEN quantity*op.retail_price_euro ELSE 0 END) AS PO_20_vk_wert_euro,
	SUM(CASE WHEN op.stock_location_id=2 and op.state=16 and co.state = 20 THEN quantity*op.purchase_price ELSE 0 END) AS PO_20_ek_wert,
	
	SUM(CASE WHEN op.stock_location_id=2 and op.state=16 and co.state = 24 THEN quantity ELSE 0 END) AS SO_24,
	SUM(CASE WHEN op.stock_location_id=2 and op.state=16 and co.state = 24 THEN quantity*op.retail_price ELSE 0 END) AS SO_24_vk_wert,
	SUM(CASE WHEN op.stock_location_id=2 and op.state=16 and co.state = 24 THEN quantity*op.retail_price_euro ELSE 0 END) AS SO_24_vk_wert_euro,
	SUM(CASE WHEN op.stock_location_id=2 and op.state=16 and co.state = 24 THEN quantity*op.purchase_price ELSE 0 END) AS SO_24_ek_wert,
	
	SUM(CASE WHEN op.stock_location_id=2 and op.state=32 and co.state = 32 THEN quantity ELSE 0 END) AS Stocked_32,
	SUM(CASE WHEN op.stock_location_id=2 and op.state=32 and co.state = 32 THEN quantity*op.retail_price ELSE 0 END) AS Stocked_32_vk_wert,
	SUM(CASE WHEN op.stock_location_id=2 and op.state=32 and co.state = 32 THEN quantity*op.retail_price_euro ELSE 0 END) AS Stocked_32_vk_wert_euro,
	SUM(CASE WHEN op.stock_location_id=2 and op.state=32 and co.state = 32 THEN quantity*op.purchase_price ELSE 0 END) AS Stocked_32_ek_wert,
	
	SUM(CASE WHEN op.stock_location_id=2 and op.state=64 and co.state = 64 THEN quantity ELSE 0 END) AS Packed_64,
	SUM(CASE WHEN op.stock_location_id=2 and op.state=64 and co.state = 64 THEN quantity*op.retail_price ELSE 0 END) AS Packed_64_vk_wert,
	SUM(CASE WHEN op.stock_location_id=2 and op.state=64 and co.state = 64 THEN quantity*op.retail_price_euro ELSE 0 END) AS Packed_64_vk_wert_euro,
	SUM(CASE WHEN op.stock_location_id=2 and op.state=64 and co.state = 64 THEN quantity*op.purchase_price ELSE 0 END) AS Packed_64_ek_wert,
	
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 128 THEN quantity ELSE 0 END) AS Sent_128,
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 128 THEN quantity*op.retail_price ELSE 0 END) AS Sent_128_vk_wert,
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 128 THEN quantity*op.retail_price_euro ELSE 0 END) AS Sent_128_vk_wert_euro,
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 128 THEN quantity*op.purchase_price ELSE 0 END) AS Sent_128_ek_wert,
	
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 256 THEN quantity ELSE 0 END) AS Arrived_256, 
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 256 THEN quantity*op.retail_price ELSE 0 END) AS Arrived_256_vk_wert,
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 256 THEN quantity*op.retail_price_euro ELSE 0 END) AS Arrived_256_vk_wert_euro,
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 256 THEN quantity*op.purchase_price ELSE 0 END) AS Arrived_256_ek_wert,
	
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 384 THEN quantity ELSE 0 END) AS ReturnedOnline_384, 
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 384 THEN quantity*op.retail_price ELSE 0 END) AS ReturnedOnline_384_vk_wert,
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 384 THEN quantity*op.retail_price_euro ELSE 0 END) AS ReturnedOnline_384_vk_wert_euro, 
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 384 THEN quantity*op.purchase_price ELSE 0 END) AS ReturnedOnline_384_ek_wert,
	
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 512 THEN quantity ELSE 0 END) AS Returned_512, 
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 512 THEN quantity*op.retail_price ELSE 0 END) AS Returned_512_vk_wert, 
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 512 THEN quantity*op.retail_price_euro ELSE 0 END) AS Returned_512_vk_wert_euro,
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 512 THEN quantity*op.purchase_price ELSE 0 END) AS Returned_512_ek_wert,
	
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 1024 THEN quantity ELSE 0 END) AS Completed_1024, 
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 1024 THEN quantity*op.retail_price ELSE 0 END) AS Completed_1024_vk_wert,
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 1024 THEN quantity*op.retail_price_euro ELSE 0 END) AS Completed_1024_vk_wert_euro, 
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 1024 THEN quantity*op.purchase_price ELSE 0 END) AS Completed_1024_ek_wert,
	
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 2048 THEN quantity ELSE 0 END) AS Canceled_2048, 
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 2048 THEN quantity*op.retail_price ELSE 0 END) AS Canceled_2048_vk_wert, 
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 2048 THEN quantity*op.retail_price_euro ELSE 0 END) AS Canceled_2048_vk_wert_euro,
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 2048 THEN quantity*op.purchase_price ELSE 0 END) AS Canceled_2048_ek_wert,
	
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 1536 THEN quantity ELSE 0 END) AS Lost_1536, 
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 1536 THEN quantity*op.retail_price ELSE 0 END) AS Lost_1536_vk_wert, 
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 1536 THEN quantity*op.retail_price_euro ELSE 0 END) AS Lost_1536_vk_wert_euro, 
	SUM(CASE WHEN op.stock_location_id=2 and op.state = 1536 THEN quantity*op.purchase_price ELSE 0 END) AS Lost_1536_ek_wert,
	
	MIN(CASE WHEN co.order_state='Outfittery Order' THEN cast(op.date_created  AS date) ELSE NULL END) AS first_order_date,
	MAX(CASE WHEN co.order_state='Outfittery Order' THEN cast(op.date_created  AS date) ELSE NULL END) AS last_order_date,
	MIN(CASE WHEN co.order_state='Outfittery Order' THEN cast(op.date_returned AS date) ELSE NULL END) AS first_date_returned, 
	MAX(CASE WHEN co.order_state='Outfittery Order' THEN cast(op.date_returned AS date) ELSE NULL END) AS last_date_returned, 
	MIN(CASE WHEN co.order_state='Outfittery Order' THEN cast(op.date_shipped  AS date) ELSE NULL END) AS first_date_shipped, 
	MAX(CASE WHEN co.order_state='Outfittery Order' THEN cast(op.date_shipped  AS date) ELSE NULL END) AS last_date_shipped,
    SUM(CASE WHEN co.order_state='Outfittery Order' THEN op.quantity ELSE 0 END) AS quantity
FROM views.order_position op
LEFT JOIN views.customer_order co on co.id=op.order_id
LEFT JOIN views.article sa on sa.article_id=op.article_id
WHERE sa.supplier_id = 15
GROUP BY 1,2,3,4,5,6


