-- Table: customer_order

-- DROP TABLE customer_order;

CREATE TABLE customer_order
(
  id bigint NOT NULL,
  version bigint NOT NULL DEFAULT (0)::bigint,
  belonging_questionnaire_session_id bigint,
  billing_address_id bigint,
  customer_id bigint NOT NULL,
  date_created timestamp with time zone NOT NULL,
  gtc_accepted boolean NOT NULL,
  last_updated timestamp with time zone NOT NULL,
  shipping_address_id bigint NOT NULL,
  shipping_address_meets_billing_address boolean,
  state integer NOT NULL DEFAULT 8,
  payment_method bigint NOT NULL DEFAULT 1,
  payment_state integer NOT NULL DEFAULT 8,
  total_amount_basket_purchase_gross numeric(19,2) NOT NULL DEFAULT 0,
  total_amount_basket_retail_gross numeric(19,2) NOT NULL DEFAULT 0,
  total_amount_billed_discount numeric(19,2) NOT NULL DEFAULT 0,
  total_amount_billed_purchase_gross numeric(19,2) NOT NULL DEFAULT 0,
  total_amount_billed_retail_gross numeric(19,2) NOT NULL DEFAULT 0,
  total_amount_net real DEFAULT 0,
  parent_order_id bigint,
  date_billed timestamp with time zone,
  date_payed timestamp with time zone,
  date_returned timestamp with time zone,
  date_shipped timestamp with time zone,
  total_amount_reserved numeric(19,2) DEFAULT 0,
  comment text,
  sales_channel character varying(255),
  phone_date timestamp with time zone,
  stylelist_id integer,
  discount_type integer NOT NULL DEFAULT 2,
  discount_content integer NOT NULL DEFAULT 0,
  total_amount_billed_discount_percentage numeric(19,2) NOT NULL DEFAULT 0,
  total_amount_billed_discount_absolute numeric(19,2) NOT NULL DEFAULT 0,
  date_completed timestamp with time zone,
  billing_data_id bigint,
  campaign_id bigint,
  additional_info hstore DEFAULT ''::hstore,
  additional_info_map bytea,
  date_first_reminder timestamp with time zone,
  date_first_dunning timestamp with time zone,
  date_second_dunning timestamp with time zone,
  total_amount_payed numeric(19,2) NOT NULL DEFAULT 0,
  date_encashment timestamp with time zone,
  date_returned_online timestamp with time zone,
  currency_code character varying(255) DEFAULT 'EUR'::character varying,
  date_earliest_delivery timestamp with time zone,
  date_submitted timestamp with time zone,
  logistics_processor character varying(6),
  vat_percentage numeric(19,3) DEFAULT 19,
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
  total_goodwill_credit numeric(19,2) DEFAULT 0,
  max_total_amount_billed_retail_gross numeric(19,2),
  max_total_amount_billed_retail_gross_origin character varying(255),
  marketing_campaign character varying(255),
  date_return_registration timestamp with time zone,
  CONSTRAINT order_pkey PRIMARY KEY (id),
  CONSTRAINT fk651874ea89e1ed9 FOREIGN KEY (shipping_address_id)
      REFERENCES address (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk651874ea9044a18 FOREIGN KEY (belonging_questionnaire_session_id)
      REFERENCES questionnaire_session (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk651874ebbf3c7ec FOREIGN KEY (billing_address_id)
      REFERENCES address (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk651874ed18c684c FOREIGN KEY (customer_id)
      REFERENCES principal (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk86db8bad211373bd FOREIGN KEY (parent_order_id)
      REFERENCES customer_order (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk86db8badcb2305e2 FOREIGN KEY (stylelist_id)
      REFERENCES principal (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fkc5d2731a4bab2bc8 FOREIGN KEY (billing_data_id)
      REFERENCES billing_data (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fkf495eb851da04477 FOREIGN KEY (campaign_id)
      REFERENCES campaign (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "phoneDate_stylelist_key" UNIQUE (stylelist_id, phone_date)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE customer_order
  OWNER TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT ALL ON TABLE customer_order TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT SELECT ON TABLE customer_order TO datavirtuality;
GRANT SELECT ON TABLE customer_order TO "ps-app-coruscant";
GRANT SELECT ON TABLE customer_order TO "ps-app-curuscant2";
GRANT SELECT ON TABLE customer_order TO monitoring;
GRANT SELECT ON TABLE customer_order TO staging_db_syncer;

-- Index: customer_order_belonging_questionnaire_session_id

-- DROP INDEX customer_order_belonging_questionnaire_session_id;

CREATE INDEX customer_order_belonging_questionnaire_session_id
  ON customer_order
  USING btree
  (belonging_questionnaire_session_id);

-- Index: customer_order_billing_address_id

-- DROP INDEX customer_order_billing_address_id;

CREATE INDEX customer_order_billing_address_id
  ON customer_order
  USING btree
  (billing_address_id);

-- Index: customer_order_billing_data_id

-- DROP INDEX customer_order_billing_data_id;

CREATE INDEX customer_order_billing_data_id
  ON customer_order
  USING btree
  (billing_data_id);

-- Index: customer_order_campaign_id

-- DROP INDEX customer_order_campaign_id;

CREATE INDEX customer_order_campaign_id
  ON customer_order
  USING btree
  (campaign_id);

-- Index: customer_order_customer_id

-- DROP INDEX customer_order_customer_id;

CREATE INDEX customer_order_customer_id
  ON customer_order
  USING btree
  (customer_id);

-- Index: customer_order_shipping_address_id

-- DROP INDEX customer_order_shipping_address_id;

CREATE INDEX customer_order_shipping_address_id
  ON customer_order
  USING btree
  (shipping_address_id);

-- Index: customer_order_stylelist_id

-- DROP INDEX customer_order_stylelist_id;

CREATE INDEX customer_order_stylelist_id
  ON customer_order
  USING btree
  (stylelist_id);

