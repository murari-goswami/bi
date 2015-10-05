-- Table: dwh.calendar

-- DROP TABLE dwh.calendar;

CREATE TABLE dwh.calendar
(
  date date NOT NULL,
  year integer,
  year_season character(9),
  year_quarter character(7),
  year_month character(7),
  year_week character(7),
  season_number integer,
  season character(2),
  season_de character(2),
  season_einkauf character(4),
  month integer,
  week integer,
  day_of_month integer,
  day_of_week integer,
  day_name character(9),
  month_name character(9),
  last_day_of_month date,
  last_day_of_week date,
  business_day date,
  working_days smallint,
  next_ship_day date,
  CONSTRAINT calendar_pkey PRIMARY KEY (date)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE dwh.calendar
  OWNER TO postgres;
