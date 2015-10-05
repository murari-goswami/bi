/*
/home/hvulkundkar/snowplow-cron.log

Downloading Snowplow events...
  downloading files from s3://outfittery-snowplow-data/enriched/good/ to /tmp/snowplow/
(t0)    DOWNLOAD outfittery-snowplow-data/enriched/good/run=2015-09-15-04-02-19/part-00000 +-> /tmp/snowplow/run=2015-09-15-04-02-19/part-00000
(t1)    DOWNLOAD outfittery-snowplow-data/enriched/good/run=2015-09-15-04-02-19/part-00001 +-> /tmp/snowplow/run=2015-09-15-04-02-19/part-00001
      +/> /tmp/snowplow/run=2015-09-15-04-02-19/part-00001
      +/> /tmp/snowplow/run=2015-09-15-04-02-19/part-00000
Loading Snowplow events into My PostgreSQL database (PostgreSQL database)...
Opening database connection ...
Running COPY command with data from: /tmp/snowplow/run=2015-09-15-04-02-19/part-00001
Result of COPY is: PGRES_COMMAND_OK
Running COPY command with data from: /tmp/snowplow/run=2015-09-15-04-02-19/part-00000
Result of COPY is: PGRES_FATAL_ERROR
Archiving Snowplow events...
*/

/*
/home/hvulkundkar/snowplow/4-storage/storage-loader/lib/snowplow-storage-loader/postgres_loader.rb

        copy_statement = "COPY #{target[:table]} FROM STDIN WITH CSV ESCAPE E'#{ESCAPE_CHAR}' QUOTE E'#{QUOTE_CHAR}' DELIMITER '#{EVENT_FIELD_SEPARATOR}' NULL '#{NULL_STRING}'"

        status = []
        files.each do |file|
          begin
            puts "Running COPY command with data from: #{file}"
            buf = ''
            conn.transaction do
              conn.exec(copy_statement)
              begin
                File.open(file, 'r+') do |copy_data|
                  while copy_data.read( COPY_BUFFER_SIZE, buf )
                    until conn.put_copy_data( buf )
                      puts 'Waiting for connection to be writable'
                      sleep 0.1
                    end
                  end
                end
              rescue Errno => err
                errmsg = "#{err.class.name} while reading copy data: #{err.message}"
                conn.put_copy_end( errmsg )
                status = [file, err.class, err.message]
                break
              else
                conn.put_copy_end
                while res = conn.get_result
                  puts "Result of COPY is: #{res.res_status(res.result_status)}"
                end
              end
            end
          rescue PG::Error => err
            status = [file, err.class, err.message]
            break
          end
        end 
*/

-- Looking where the data is
show data_directory;
/*
# du -h /var/lib/postgresql/9.3/main/
757M    /var/lib/postgresql/9.3/main/base/638184107
23G     /var/lib/postgresql/9.3/main/base/451129179 -- atomic.events
139G    /var/lib/postgresql/9.3/main/base/16384

# df -h
Filesystem         Size  Used Avail Use% Mounted on
/dev/sda1          343G  190G  137G  59% /
*/

-- Create the new table
CREATE TABLE atomic.events_fix_urlscheme
(
  app_id character varying(255),
  platform character varying(255),
  etl_tstamp timestamp without time zone,
  collector_tstamp timestamp without time zone NOT NULL,
  dvce_tstamp timestamp without time zone,
  event character varying(128),
  event_id character(36) NOT NULL,
  txn_id integer,
  name_tracker character varying(128),
  v_tracker character varying(100),
  v_collector character varying(100) NOT NULL,
  v_etl character varying(100) NOT NULL,
  user_id character varying(255),
  user_ipaddress character varying(45),
  user_fingerprint character varying(50),
  domain_userid character varying(36),
  domain_sessionidx smallint,
  network_userid character varying(38),
  geo_country character(2),
  geo_region character(2),
  geo_city character varying(75),
  geo_zipcode character varying(15),
  geo_latitude double precision,
  geo_longitude double precision,
  geo_region_name character varying(100),
  ip_isp character varying(100),
  ip_organization character varying(100),
  ip_domain character varying(100),
  ip_netspeed character varying(100),
  page_url text,
  page_title character varying(2000),
  page_referrer text,
  page_urlscheme character varying(255), -- Increased from 16
  page_urlhost character varying(255),
  page_urlport integer,
  page_urlpath character varying(3000),
  page_urlquery character varying(6000),
  page_urlfragment character varying(3000),
  refr_urlscheme character varying(255), -- Increased from 16, value "tctmwu.ortp.esceteadst"
  refr_urlhost character varying(255),
  refr_urlport integer,
  refr_urlpath character varying(6000),
  refr_urlquery character varying(6000),
  refr_urlfragment character varying(3000),
  refr_medium character varying(25),
  refr_source character varying(50),
  refr_term character varying(255),
  mkt_medium character varying(255),
  mkt_source character varying(5000), -- Was increased from 255 before?
  mkt_term character varying(255),
  mkt_content character varying(500),
  mkt_campaign character varying(255),
  contexts json,
  se_category character varying(1000),
  se_action character varying(1000),
  se_label character varying(1000),
  se_property character varying(1000),
  se_value double precision,
  unstruct_event json,
  tr_orderid character varying(255),
  tr_affiliation character varying(255),
  tr_total numeric(18,2),
  tr_tax numeric(18,2),
  tr_shipping numeric(18,2),
  tr_city character varying(255),
  tr_state character varying(255),
  tr_country character varying(255),
  ti_orderid character varying(255),
  ti_sku character varying(255),
  ti_name character varying(255),
  ti_category character varying(255),
  ti_price numeric(18,2),
  ti_quantity integer,
  pp_xoffset_min integer,
  pp_xoffset_max integer,
  pp_yoffset_min integer,
  pp_yoffset_max integer,
  useragent character varying(1000),
  br_name character varying(50),
  br_family character varying(50),
  br_version character varying(50),
  br_type character varying(50),
  br_renderengine character varying(50),
  br_lang character varying(255),
  br_features_pdf boolean,
  br_features_flash boolean,
  br_features_java boolean,
  br_features_director boolean,
  br_features_quicktime boolean,
  br_features_realplayer boolean,
  br_features_windowsmedia boolean,
  br_features_gears boolean,
  br_features_silverlight boolean,
  br_cookies boolean,
  br_colordepth character varying(12),
  br_viewwidth integer,
  br_viewheight integer,
  os_name character varying(50),
  os_family character varying(50),
  os_manufacturer character varying(50),
  os_timezone character varying(50),
  dvce_type character varying(50),
  dvce_ismobile boolean,
  dvce_screenwidth integer,
  dvce_screenheight integer,
  doc_charset character varying(128),
  doc_width integer,
  doc_height integer,
  tr_currency character(3),
  tr_total_base numeric(18,2),
  tr_tax_base numeric(18,2),
  tr_shipping_base numeric(18,2),
  ti_currency character(3),
  ti_price_base numeric(18,2),
  base_currency character(3),
  geo_timezone character varying(64),
  mkt_clickid character varying(128),
  mkt_network character varying(64),
  etl_tags character varying(500),
  dvce_sent_tstamp timestamp without time zone,
  refr_domain_userid character varying(36),
  refr_dvce_tstamp timestamp without time zone,
  derived_contexts json,
  domain_sessionid character(36),
  derived_tstamp timestamp without time zone
)
WITH (
  OIDS=FALSE
);

ALTER TABLE atomic.events_fix_urlscheme
OWNER TO snowplow;

-- Now copy into new from old table 
insert into atomic.events_fix_urlscheme
select * from atomic.events;

-- Checking
select count(*) from atomic.events_fix_urlscheme; -- 15253080
select count(*) from atomic.events; -- 15253080

-- Swap tables
ALTER TABLE atomic.events RENAME TO events_20150922_urlscheme_short;
ALTER TABLE atomic.events_fix_urlscheme RENAME TO events;

-- Creating a temp table to load the missing data
create table atomic.events_temp as select * from atomic.events limit 0;

-- Loading the missing data
COPY atomic.events_temp FROM '/tmp/part-00000' WITH CSV ESCAPE E'\x02' QUOTE E'\x01' DELIMITER E'\t' NULL '';

/*
SQL Error [22001]: ERROR: value too long for type character varying(16)
  Where: COPY events_test, line 111255, column refr_urlscheme: "tctmwu.ortp.esceteadst"
  org.postgresql.util.PSQLException: ERROR: value too long for type character varying(16)
  Where: COPY events_test, line 111255, column refr_urlscheme: "tctmwu.ortp.esceteadst"
*/

-- Checking the loaded data
select count(*), min(collector_tstamp), max(collector_tstamp) from atomic.events_temp;

-- Cheching dupicates
select count(*) from (select event_id, count(*) from atomic.events_temp group by 1 having count(*) > 1) t;

-- Looking, how much we'll insert
select count(*) from atomic.events_temp
where event_id not in (
	select event_id
	from atomic.events
	where collector_tstamp >= '2015-09-14'
		and collector_tstamp < '2015-09-15'
);

-- Inserting the missing data
insert into atomic.events
select * from atomic.events_temp
where event_id not in (
	select event_id from atomic.events
	where collector_tstamp >= '2015-09-14'
		and collector_tstamp < '2015-09-15'
);

-- Dropping the temp table
drop table atomic.events_temp;
