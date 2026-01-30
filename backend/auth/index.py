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
            
            elif action == 'register_teacher':
                username = body.get('username', '')
                password = body.get('password', '')
                class_name = body.get('class_name', '')
                
                if not username or not password or not class_name:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Необходимы все поля'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(f"SELECT id FROM {schema}.classes WHERE name = '{class_name}'")
                class_row = cur.fetchone()
                
                if not class_row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Класс не найден'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hashlib.sha256(password.encode()).hexdigest()
                
                cur.execute(f"""
                    INSERT INTO {schema}.users (username, password_hash, role, class_id)
                    VALUES ('{username}', '{password_hash}', 'teacher', {class_row['id']})
                    RETURNING id
                """)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': 'Учитель зарегистрирован'}),
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
