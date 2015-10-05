SELECT
    id AS experiment_id,
    description AS experiment_name,
	created AS date_test_start,
	CASE WHEN status = 'Archived' THEN last_modified
		 WHEN status = 'Paused' THEN last_modified
		 ELSE NULL
	END AS date_test_end
FROM stage.optimizely_experiments
