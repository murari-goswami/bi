-- Table: address

-- DROP TABLE address;

CREATE TABLE address
(
  id bigint NOT NULL,
  version bigint NOT NULL,
  city character varying(255) NOT NULL,
  co character varying(255),
  country character varying(255) NOT NULL,
  street character varying(255) NOT NULL,
  street_number character varying(255) NOT NULL,
  zip character varying(255) NOT NULL,
  first_name character varying(255) NOT NULL DEFAULT ''::character varying,
  last_name character varying(255) NOT NULL DEFAULT ''::character varying,
  salutation integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  default_address boolean NOT NULL DEFAULT false,
  co_type character varying(255),
  CONSTRAINT address_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE address
  OWNER TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT ALL ON TABLE address TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT SELECT ON TABLE address TO datavirtuality;
GRANT SELECT ON TABLE address TO "ps-app-coruscant";
GRANT SELECT ON TABLE address TO "ps-app-curuscant2";
GRANT SELECT ON TABLE address TO monitoring;
GRANT SELECT ON TABLE address TO staging_db_syncer;
