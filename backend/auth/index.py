import json
import os
import hashlib
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для авторизации учителей и админов"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
            action = event.get('queryStringParameters', {}).get('action', '')
            
            if action == 'list_teachers':
                cur.execute(f"""
                    SELECT u.id, u.username, u.full_name, u.subject, u.class_id, c.name as class_name
                    FROM {schema}.users u
                    LEFT JOIN {schema}.classes c ON u.class_id = c.id
                    WHERE u.role = 'teacher'
                    ORDER BY c.name, u.full_name
                """)
                
                teachers = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'teachers': [dict(t) for t in teachers]}),
                    'isBase64Encoded': False
                }
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'login':
                username = body.get('username', '')
                password = body.get('password', '')
                
                if not username or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Необходимы username и password'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hashlib.sha256(password.encode()).hexdigest()
                
                cur.execute(f"""
                    SELECT u.id, u.username, u.role, u.class_id, c.name as class_name
                    FROM {schema}.users u
                    LEFT JOIN {schema}.classes c ON u.class_id = c.id
                    WHERE u.username = '{username}' AND u.password_hash = '{password_hash}'
                """)
                
                user = cur.fetchone()
                
                if user:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'success': True,
                            'user': dict(user)
                        }),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверный логин или пароль'}),
                        'isBase64Encoded': False
                    }
            
            elif action == 'create_teacher':
                username = body.get('username', '')
                password = body.get('password', '')
                full_name = body.get('full_name', '')
                subject = body.get('subject', '')
                class_id = body.get('class_id')
                
                if not username or not password or not full_name or not class_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Необходимы все поля'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(f"SELECT id FROM {schema}.users WHERE username = '{username}'")
                if cur.fetchone():
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пользователь с таким логином уже существует'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hashlib.sha256(password.encode()).hexdigest()
                
                cur.execute(f"""
                    INSERT INTO {schema}.users (username, password_hash, role, class_id, full_name, subject)
                    VALUES ('{username}', '{password_hash}', 'teacher', {class_id}, '{full_name}', '{subject}')
                    RETURNING id
                """)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': 'Учитель создан'}),
                    'isBase64Encoded': False
                }
            
            elif action == 'delete_teacher':
                teacher_id = body.get('teacher_id')
                
                if not teacher_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Необходим teacher_id'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(f"DELETE FROM {schema}.users WHERE id = {teacher_id} AND role = 'teacher'")
                
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