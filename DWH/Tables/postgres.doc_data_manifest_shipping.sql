-- Table: doc_data_manifest_shipping

-- DROP TABLE doc_data_manifest_shipping;

CREATE TABLE doc_data_manifest_shipping
(
  id bigint NOT NULL,
  version bigint NOT NULL,
  cod_amount character varying(50),
  collo_number character varying(50) NOT NULL,
  date_created timestamp with time zone NOT NULL,
  date_processed timestamp with time zone,
  last_updated timestamp with time zone NOT NULL,
  line_number character varying(255) NOT NULL,
  orderid character varying(20) NOT NULL,
  outfittery_article_number character varying(20) NOT NULL,
  processing_reason text,
  processing_result integer NOT NULL,
  processing_state integer NOT NULL,
  quantity character varying(50) NOT NULL,
  receiver_address1 character varying(50) NOT NULL,
  receiver_address2 character varying(50) NOT NULL,
  receiver_city character varying(50) NOT NULL,
  receiver_company character varying(50) NOT NULL,
  receiver_country_code character varying(2) NOT NULL,
  receiver_name character varying(50) NOT NULL,
  receiver_zip_code character varying(10) NOT NULL,
  return_track_and_trace_number character varying(255),
  shipping_date character varying(255) NOT NULL,
  track_and_trace_number character varying(50) NOT NULL,
  transport_company character varying(50) NOT NULL,
  used_invoice_number character varying(50) NOT NULL,
  CONSTRAINT doc_data_manifest_shipping_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE doc_data_manifest_shipping
  OWNER TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT ALL ON TABLE doc_data_manifest_shipping TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT SELECT ON TABLE doc_data_manifest_shipping TO datavirtuality;
GRANT SELECT ON TABLE doc_data_manifest_shipping TO "ps-app-coruscant";
GRANT SELECT ON TABLE doc_data_manifest_shipping TO "ps-app-curuscant2";
GRANT SELECT ON TABLE doc_data_manifest_shipping TO monitoring;
GRANT SELECT ON TABLE doc_data_manifest_shipping TO staging_db_syncer;
