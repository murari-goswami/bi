-- Name: raw.stock_sales_order_header
-- Created: 2015-04-24 18:17:55
-- Updated: 2015-04-24 18:17:55

CREATE VIEW raw.stock_sales_order_header AS

SELECT
	id AS stock_sales_order_header_id,
	affiliateid AS affiliate_id,
	CAST(orderid AS LONG) AS order_id,
	CAST(customerid AS LONG) AS customer_id,
	parseTimestamp(date_created, 'yyyy-MM-dd HH:mm:ss.S') as date_stock_sales_order_header_created,
	parseTimestamp(last_updated, 'yyyy-MM-dd HH:mm:ss.S') as last_updated,
	LEFT(banking_information, 12) as banking_information,
	country_code,
	currency_code,
	invoice_number,
	/*----customer information----*/
	"name" AS customer_name,
	order_date,
	"e_mail"  AS customer_email,
	payment_method,
	preferred_language,
	salutation,
	/*----shipping information----*/
	shipping_code,
	city,
	street_address1,
	zip_code
FROM 
	postgres.doc_data_sales_order_header


