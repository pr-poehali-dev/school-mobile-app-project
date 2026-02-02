import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для управления расписанием учителя"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA')
    
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            user_id = event.get('queryStringParameters', {}).get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Необходим user_id'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f"""
                SELECT ts.id, ts.day_of_week, ts.lesson_number, ts.subject, 
                       ts.class_id, c.name as class_name
                FROM {schema}.teacher_schedule ts
                LEFT JOIN {schema}.classes c ON ts.class_id = c.id
                WHERE ts.user_id = {user_id}
                ORDER BY 
                    CASE ts.day_of_week
                        WHEN 'Понедельник' THEN 1
                        WHEN 'Вторник' THEN 2
                        WHEN 'Среда' THEN 3
                        WHEN 'Четверг' THEN 4
                        WHEN 'Пятница' THEN 5
                        ELSE 6
                    END,
                    ts.lesson_number
            """)
            
            schedule = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'schedule': [dict(s) for s in schedule]}),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            day_of_week = body.get('day_of_week')
            lesson_number = body.get('lesson_number')
            subject = body.get('subject')
            class_id = body.get('class_id')
            
            if not user_id or not day_of_week or not lesson_number or not subject:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Необходимы user_id, day_of_week, lesson_number, subject'}),
                    'isBase64Encoded': False
                }
            
            class_id_str = str(class_id) if class_id else 'NULL'
            
            cur.execute(f"""
                INSERT INTO {schema}.teacher_schedule 
                (user_id, day_of_week, lesson_number, subject, class_id)
                VALUES ({user_id}, '{day_of_week}', {lesson_number}, '{subject}', {class_id_str})
                ON CONFLICT (user_id, day_of_week, lesson_number) 
                DO UPDATE SET subject = '{subject}', class_id = {class_id_str}
                RETURNING id
            """)
            
            result = cur.fetchone()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': result['id']}),
                'isBase64Encoded': False
            }
        
        if method == 'DELETE':
            body = json.loads(event.get('body', '{}'))
            schedule_id = body.get('id')
            
            if not schedule_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Необходим id'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f"SELECT id FROM {schema}.teacher_schedule WHERE id = {schedule_id}")
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
