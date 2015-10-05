-- Name: views.billing_data
-- Created: 2015-04-24 18:17:11
-- Updated: 2015-04-24 18:17:11

CREATE view views.billing_data
as
/*This view has credit card information if customer entered during registration*/
SELECT 
  bd.id,
  bd.credit_card_brand,
  bd.credit_card_expires,
  bd.credit_card_number,
  bd.customer_id,type,
  bd.bank_account_holder,
  bd.bank_account_number,
  bd.bank_code,
  bd.bank_due_date,
  bd.bank_name,
  bd.bank_payer_note,
  bt.date_credit_card_entered
FROM "postgres"."billing_data" bd
/*this join gets the credit card entered date, we don't have this detail in billing data*/
LEFT JOIN
(
  SELECT 
    billing_data_id,
    MIN(date_credit_card_entered) as date_credit_card_entered 
  FROM
  (
    select
      bt.billing_data_id,
      MIN(bt.date_created) OVER (PARTITION BY bt.billing_data_id) AS date_credit_card_entered
    FROM postgres.billing_transaction bt
  )a
  GROUP BY 1
)bt on bt.billing_data_id=bd.id


