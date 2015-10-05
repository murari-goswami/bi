-- Table: userconnection

-- DROP TABLE userconnection;

CREATE TABLE userconnection
(
  userid character varying(255) NOT NULL,
  providerid character varying(255) NOT NULL,
  provideruserid character varying(255) NOT NULL,
  accesstoken character varying(1024) NOT NULL,
  displayname character varying(255),
  expiretime bigint,
  imageurl character varying(255),
  profileurl character varying(255),
  rank bigint NOT NULL,
  refreshtoken character varying(255),
  secret character varying(255),
  CONSTRAINT userconnection_pkey PRIMARY KEY (userid, providerid, provideruserid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE userconnection
  OWNER TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT ALL ON TABLE userconnection TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT SELECT ON TABLE userconnection TO datavirtuality;
GRANT SELECT ON TABLE userconnection TO "ps-app-coruscant";
GRANT SELECT ON TABLE userconnection TO "ps-app-curuscant2";
GRANT SELECT ON TABLE userconnection TO monitoring;
GRANT SELECT ON TABLE userconnection TO staging_db_syncer;
