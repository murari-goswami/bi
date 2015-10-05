--$ sudo apt-get install mysql-server
--$ mysql -u root -p -e 'show databases;'

create database metadata_prod;
create database metadata_dev;

CREATE USER 'metadata'@'%' IDENTIFIED BY '<password>';
GRANT ALL PRIVILEGES ON metadata_prod.* TO 'metadata'@'%';
GRANT ALL PRIVILEGES ON metadata_dev.* TO 'metadata'@'%';
FLUSH PRIVILEGES;

/* Not needed anymore, we'll keep the scripts in files
DROP TABLE job_scripts;

CREATE TABLE job_scripts (
	script_name varchar(255) NOT NULL,
	script_text TEXT,
	CONSTRAINT job_scripts_pk PRIMARY KEY (script_name)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
*/

DROP TABLE job_dependencies;

CREATE TABLE job_dependencies (
	job_class varchar(255) NOT NULL DEFAULT 'ETL', -- To set dependencies between the same scripts with different parameters
	job_name varchar(255) DEFAULT 'psql_exec',
	script_name varchar(255),
	prev_job_class varchar(255) NOT NULL DEFAULT 'ETL',
	prev_job_name varchar(255) DEFAULT 'psql_exec',
	prev_script_name varchar(255),
	CONSTRAINT job_dependencies_pk PRIMARY KEY (job_class, job_name, script_name, prev_job_class, prev_job_name, prev_script_name)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE job_queue;

CREATE TABLE job_queue (
	id integer unsigned NOT NULL AUTO_INCREMENT,
	job_group integer unsigned NOT NULL DEFAULT 1, -- Number of a group (all scripts running in the scope of one day, for example)
	job_class varchar(255) NOT NULL DEFAULT 'ETL', -- Can be ETL_<country> to run the same script for different countries one after another
	job_name varchar(255) DEFAULT 'psql_exec', -- psql_exec, mysql_exec, mssql_exec, bash_exec, psql_to_email, psql_to_bash, bash_to_psql
	script_name varchar(255) NOT NULL DEFAULT '',
	priority integer NOT NULL DEFAULT 0, -- The bigger the priority, the earlier the script will start among other scripts scheduled for the same time
	run_interval varchar(255) DEFAULT NULL, -- hour, day, week, month, quarter, year, NULL (one-time)
	-- exceptions, custom rules?
	run_at timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
	last_run_from timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
	last_run_to timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
	max_attempts integer unsigned NOT NULL DEFAULT 0,
	attempts integer unsigned NOT NULL DEFAULT 0,
	status varchar(255) NOT NULL DEFAULT 'Pending',
	job_parameters varchar(255) DEFAULT '',
	job_results varchar(255) DEFAULT NULL,
	run_session varchar(255) DEFAULT '',
	CONSTRAINT job_queue_pk PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


insert into job_scripts values('test_script','insert into stage.a values (current_timestamp);');

delete from job_queue where script_name = 'test_script';

INSERT INTO job_queue (run_interval, job_group, run_at, job_name, script_name, job_parameters)
VALUES ('day', 1, '2015-09-27 23:40:00', 'psql_exec', 'test_script', '');

select * from job_scripts;
select * from job_queue;
