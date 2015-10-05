'''
Get experiment data through the Optimizely API and write to staging DB.

environment variables needed:

OPTIMIZELY_TOKEN
DB_MLPG_POSTGRES_PORT_5432_TCP_ADDR
DB_MLPG_POSTGRES_PORT_5432_TCP_PORT
DB_MLPG_POSTGRES_USER
DB_MLPG_POSTGRES_PASSWORD
DB_MLPG_POSTGRES_DATABASE
'''

import os
import psycopg2
import requests
import dateutil.parser
import json
import sys
import logging
import datetime
from pkg_resources import resource_filename

log = logging.getLogger('stage_optimizely')
experiments_base_url = 'https://www.optimizelyapis.com/experiment/v1/'
filename_experiments_json = '/tmp/experiments.json'

def connect():
    info = {
        'host' : os.environ['DB_MLPG_POSTGRES_PORT_5432_TCP_ADDR'],
        'port' : os.environ['DB_MLPG_POSTGRES_PORT_5432_TCP_PORT'],
        'user' : os.environ['DB_MLPG_POSTGRES_USER'],
        'password'  : os.environ['DB_MLPG_POSTGRES_PASSWORD'],
        'dbname' : os.environ['DB_MLPG_POSTGRES_DATABASE']
    }
    return psycopg2.connect(**info)

def headers():
    '''
    Return HTML headers needed in every request to the Optimizely API.
    '''
    d = { 'Token' : os.environ['OPTIMIZELY_TOKEN']}
    return d

def save_json( obj, filename ):
    with open(filename,'w') as f:
        json.dump(obj, f)

def load_json( filename ):
    with open(filename,'r') as f:
        data = json.load(f)
    return data

def get_experiments( project_id = 655470451 ):
    log.info('Get experiments for project {0}'.format(project_id))
    url_schema = experiments_base_url + 'projects/{project_id}/experiments/'
    url = url_schema.format(project_id=project_id)
    r = requests.get(url, headers = headers())
    data = r.json()
    save_json(data, filename_experiments_json)
    return data

def load_experiments_copy():
    experiments = load_json(filename_experiments_json)
    return experiments

def stage_experiment( experiment, conn ):
    '''
    Insert an experiment into staging.
    '''
    columns = [ 'created',
                'description',
                'id',
                'is_multivariate',
                'last_modified',
                'status',
                'variation_ids',
                'shareable_results_link',
                'details',
                'percentage_included',
                'project_id' ]
    query_template = 'insert into stage.optimizely_experiments_updates ({columns}) values %s'
    query_template = query_template.format(columns = ', '.join(columns))
    record = tuple(experiment[c] for c in columns)
    cursor = conn.cursor()
    cursor.execute(query_template, [ record ])
    cursor.close()

def stage_experiments( experiments, conn ):
    '''
    Insert multiple experiments into staging.
    '''
    n = len(experiments)
    for i, experiment in enumerate(experiments):
        log.info('{0} of {1} (id:{2})'.format(i+1,n, experiment['id']))
        stage_experiment(experiment, conn)

def filter_experiments( experiments, days = 3 ):
    '''
    Return the experiments that were modified `days` ago or later.
    '''
    date_min = datetime.datetime.utcnow() - datetime.timedelta(days = days)
    result = []
    for experiment in experiments:
        last_modified = dateutil.parser.parse(experiment['last_modified'])
        last_modified = datetime.datetime.replace(last_modified, tzinfo = None)
        if last_modified >= date_min:
            result.append(experiment)
    return result

def get_experiment_results( experiment_id = 3586230183 ):
    '''
    Get the results for an experiment through the Optimizely API.
    '''
    url_schema = experiments_base_url + 'experiments/{experiment_id}/results'
    url = url_schema.format(experiment_id = experiment_id)
    r = requests.get(url, headers = headers())
    results = r.json()
    for result in results:
        result['experiment_id'] = experiment_id
    return results

def stage_results( results, conn ):
    '''
    Insert results of an experiment into staging
    '''
    columns = [ 'experiment_id',
                'baseline_id',
                'begin_time',
                'confidence',
                'conversion_rate',
                'conversions',
                'difference',
                'end_time',
                'goal_id',
                'goal_name',
                'improvement',
                'is_revenue',
                'status',
                'variation_id',
                'variation_name',
                'visitors' ]
    query_template = 'insert into stage.optimizely_results ({columns}) values {values}'
    query_template = query_template.format(columns = ', '.join(columns), values = '%s')

    cursor = conn.cursor()
    for result in results:
        record = tuple(result[c] for c in columns)
        cursor.execute(query_template, [ record ])
    cursor.close()

def setup_logging():
    '''
    Log to stderr.
    '''
    logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s', level=logging.DEBUG)
    log.setLevel(logging.INFO)

def main_experiments( experiments ):
    '''
    Insert all experiments into staging in a transction.
    '''
    conn = connect()
    try:
        stage_experiments(experiments, conn)
    except Exception as e:
        log.exception(e)
        conn.rollback()
        raise e
    else:
        conn.commit()
    finally:
        conn.close()

def main_results( experiments ):
    '''
    For each experiment get the results from Optimizely and
    write them to staging in a transaction, per experiment.
    '''
    conn = connect()
    n = len(experiments)
    for i, experiment in enumerate(experiments):
        log.info('Update results for experiement. {0} of {1}'.format(i+1, n))
        try:
            results = get_experiment_results(experiment['id'])
            stage_results(results, conn)
        except Exception as e:
            log.exception('Exception for experiment {0}'.format(experiment['id']))
        else:
            conn.commit()
    conn.close()

def main_program():
    experiments = get_experiments()
    # experiments = load_experiments_copy()

    main_experiments(experiments)

    experiments = filter_experiments(experiments)
    main_results(experiments)
    log.info('End with success')

def main():
    setup_logging()
    try:
        main_program()
    except Exception as e:
        log.exception(e)

if __name__ == '__main__':
    main()
