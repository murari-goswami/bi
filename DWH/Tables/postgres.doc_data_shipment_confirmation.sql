-- Table: doc_data_shipment_confirmation

-- DROP TABLE doc_data_shipment_confirmation;

CREATE TABLE doc_data_shipment_confirmation
(
  id bigint NOT NULL,
  version bigint NOT NULL,
  date_created timestamp with time zone NOT NULL,
  date_processed timestamp with time zone,
  last_updated timestamp with time zone NOT NULL,
  line_number character varying(255) NOT NULL,
  orderid character varying(20) NOT NULL,
  outfittery_article_number character varying(20) NOT NULL,
  processing_reason text,
  processing_result integer NOT NULL,
  processing_state integer NOT NULL,
  quantity_shipped character varying(50) NOT NULL,
  shipping_date character varying(255) NOT NULL,
  track_and_trace_number character varying(20),
  transport_company_code character varying(50) NOT NULL,
  CONSTRAINT doc_data_shipment_confirmation_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE doc_data_shipment_confirmation
  OWNER TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT ALL ON TABLE doc_data_shipment_confirmation TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT SELECT ON TABLE doc_data_shipment_confirmation TO datavirtuality;
GRANT SELECT ON TABLE doc_data_shipment_confirmation TO "ps-app-coruscant";
GRANT SELECT ON TABLE doc_data_shipment_confirmation TO "ps-app-curuscant2";
GRANT SELECT ON TABLE doc_data_shipment_confirmation TO monitoring;
GRANT SELECT ON TABLE doc_data_shipment_confirmation TO staging_db_syncer;
