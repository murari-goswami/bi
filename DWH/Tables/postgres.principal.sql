-- Table: principal

-- DROP TABLE principal;

CREATE TABLE principal
(
  id bigint NOT NULL,
  version bigint NOT NULL DEFAULT (0)::bigint,
  account_expired boolean NOT NULL,
  account_locked boolean NOT NULL,
  email character varying(255) NOT NULL,
  enabled boolean NOT NULL,
  password character varying(255) NOT NULL,
  password_expired boolean NOT NULL,
  class character varying(255) NOT NULL,
  first_name character varying(255),
  last_name character varying(255),
  postfix character varying(255),
  prefix character varying(255),
  profile_id bigint,
  salutation integer,
  gtc_accepted boolean,
  date_created timestamp with time zone,
  last_login timestamp with time zone,
  last_updated timestamp with time zone,
  last_accessed_ip character varying(100),
  token character varying(255),
  facebook_page character varying(255),
  telefon character varying(255),
  salesforce_id character varying(255),
  photo bytea,
  mail_password character varying(255) NOT NULL DEFAULT 0,
  referred_by_id bigint,
  balance_strategy_resolver_string character varying(255),
  mails_halt_to timestamp with time zone,
  credit integer DEFAULT 0,
  data hstore DEFAULT ''::hstore,
  default_page character varying(255) NOT NULL DEFAULT 'DE'::character varying,
  stylelist_id bigint,
  additional_info hstore DEFAULT ''::hstore,
  social_info hstore DEFAULT ''::hstore,
  favourite_preview_id bigint,
  callable boolean DEFAULT true,
  balancer_enabled boolean DEFAULT true,
  national_id character varying(12),
  formal boolean,
  in_debt_collection boolean,
  no_callable boolean,
  guest_account boolean,
  CONSTRAINT user_pkey PRIMARY KEY (id),
  CONSTRAINT fk36ebcb7b078788 FOREIGN KEY (profile_id)
      REFERENCES profile (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk41b20493dab85fa9 FOREIGN KEY (referred_by_id)
      REFERENCES principal (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk93fe702e33c87e58 FOREIGN KEY (favourite_preview_id)
      REFERENCES preview (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk93fe702ec79f107d FOREIGN KEY (stylelist_id)
      REFERENCES principal (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT principal_email_key UNIQUE (email)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE principal
  OWNER TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT ALL ON TABLE principal TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT SELECT ON TABLE principal TO datavirtuality;
GRANT SELECT ON TABLE principal TO "ps-app-coruscant";
GRANT SELECT ON TABLE principal TO "ps-app-curuscant2";
GRANT SELECT ON TABLE principal TO monitoring;
GRANT SELECT ON TABLE principal TO staging_db_syncer;

-- Index: idx_principal_token

-- DROP INDEX idx_principal_token;

CREATE UNIQUE INDEX idx_principal_token
  ON principal
  USING btree
  (token COLLATE pg_catalog."default");

-- Index: principal_class_idx

-- DROP INDEX principal_class_idx;

CREATE INDEX principal_class_idx
  ON principal
  USING btree
  (class COLLATE pg_catalog."default");

-- Index: principal_email_idx

-- DROP INDEX principal_email_idx;

CREATE INDEX principal_email_idx
  ON principal
  USING btree
  (email COLLATE pg_catalog."default");

-- Index: principal_profile_id

-- DROP INDEX principal_profile_id;

CREATE INDEX principal_profile_id
  ON principal
  USING btree
  (profile_id);

-- Index: principal_referred_by_id

-- DROP INDEX principal_referred_by_id;

CREATE INDEX principal_referred_by_id
  ON principal
  USING btree
  (referred_by_id);

