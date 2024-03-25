import redis

# Conéctate a la instancia de Redis en la dirección IP proporcionada
r = redis.StrictRedis(host='10.39.81.227', port=6379, decode_responses=True)

# Suscribirse al canal "test"
p = r.pubsub()
p.subscribe('test')

print("Esperando mensajes...")

for message in p.listen():
    if message['type'] == 'message':
        data = message['data']
        print(f"Mensaje recibido: {data}")
