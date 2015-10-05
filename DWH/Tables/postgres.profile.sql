-- Table: profile

-- DROP TABLE profile;

CREATE TABLE profile
(
  id bigint NOT NULL,
  version bigint NOT NULL DEFAULT (0)::bigint,
  branch_working_in character varying(255),
  date_of_birth timestamp with time zone,
  height_in_cm integer,
  phone_number character varying(255),
  preferred_brand character varying(255),
  preferred_contact_channel character varying(5),
  preferred_contact_time character varying(255),
  shirt_size character varying(255),
  shoe_size character varying(255),
  trousers_size character varying(255),
  weight_in_kg integer,
  buying_problem_other character varying(255),
  buying_problems bytea,
  newsletter_accepted boolean NOT NULL DEFAULT false,
  preferred_brand_other character varying(255),
  spending_budget_for_jeans integer,
  spending_budget_for_shirts integer,
  spending_budget_for_shoes integer,
  branch_working_in_other character varying(255),
  trousers_size_length character varying(255),
  trousers_size_width character varying(255),
  photo bytea,
  spending_budget_for_sakkos integer,
  date_created timestamp with time zone,
  last_updated timestamp with time zone,
  referral character varying(255),
  date_newsletter_confirmed timestamp with time zone,
  send_to_external_questionnaire boolean NOT NULL DEFAULT false,
  preferred_language character varying(255) NOT NULL DEFAULT 'de'::character varying,
  collar_size character varying(50),
  spending_budget_for_shirts_from bigint,
  spending_budget_for_shirts_to bigint,
  spending_budget_for_jeans_from bigint,
  spending_budget_for_jeans_to bigint,
  spending_budget_for_shoes_from bigint,
  spending_budget_for_shoes_to bigint,
  spending_budget_for_sakkos_from bigint,
  spending_budget_for_sakkos_to bigint,
  favorite_jeans_brand character varying(255),
  favorite_jeans_fit character varying(255),
  shirt_size_fit integer,
  jeans_width_fit integer,
  salesforce_migrated_at timestamp with time zone,
  subscribed_to_newsletter boolean,
  subscribed_to_stylist_emails boolean,
  subscribed_to_sms boolean,
  CONSTRAINT profile_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE profile
  OWNER TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT ALL ON TABLE profile TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT SELECT ON TABLE profile TO datavirtuality;
GRANT SELECT ON TABLE profile TO "ps-app-coruscant";
GRANT SELECT ON TABLE profile TO "ps-app-curuscant2";
GRANT SELECT ON TABLE profile TO monitoring;
GRANT SELECT ON TABLE profile TO staging_db_syncer;
