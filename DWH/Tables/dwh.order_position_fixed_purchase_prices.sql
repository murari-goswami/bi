-- Table: dwh.order_position_fixed_purchase_prices

-- DROP TABLE dwh.order_position_fixed_purchase_prices;

CREATE TABLE dwh.order_position_fixed_purchase_prices
(
  order_position_id integer NOT NULL,
  purchase_price_fixed double precision,
  CONSTRAINT order_position_fixed_purchase_prices_pkey PRIMARY KEY (order_position_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE dwh.order_position_fixed_purchase_prices
  OWNER TO postgres;
