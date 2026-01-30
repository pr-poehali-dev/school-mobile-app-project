import json
import os
import secrets
import string
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для управления классами и их кодами доступа"""
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
            params = event.get('queryStringParameters', {})
            class_code = params.get('code') if params else None
            
            if class_code:
                cur.execute(f"""
                    SELECT id, name, access_code, created_at
                    FROM {schema}.classes
                    WHERE access_code = '{class_code.upper()}'
                """)
                class_row = cur.fetchone()
                
                if class_row:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'class': dict(class_row)}, default=str),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Класс не найден'}),
                        'isBase64Encoded': False
                    }
            else:
                cur.execute(f"SELECT id, name, access_code, created_at FROM {schema}.classes ORDER BY name")
                classes = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'classes': [dict(c) for c in classes]}, default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            class_name = body.get('name', '').strip()
            access_code = body.get('access_code', '').strip().upper()
            
            if not class_name:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Название класса обязательно'}),
                    'isBase64Encoded': False
                }
            
            if not access_code:
                access_code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))
            
            cur.execute(f"""
                INSERT INTO {schema}.classes (name, access_code)
                VALUES ('{class_name}', '{access_code}')
                RETURNING id, name, access_code
            """)
            
            new_class = cur.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'class': dict(new_class)}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            class_id = body.get('id')
            new_code = body.get('access_code', '').strip().upper()
            
            if not class_id or not new_code:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID и код обязательны'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f"""
                UPDATE {schema}.classes
                SET access_code = '{new_code}'
                WHERE id = {class_id}
                RETURNING id, name, access_code
            """)
            
            updated_class = cur.fetchone()
            
            if updated_class:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'class': dict(updated_class)}),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Класс не найден'}),
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
