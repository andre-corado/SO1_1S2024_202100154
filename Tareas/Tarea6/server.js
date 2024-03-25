const Redis = require('ioredis');

const client = new Redis({
  host: '10.39.81.227',
  port: 6379, // Puerto predeterminado de Redis
  connectTimeout: 5000, // 10 segundos
});

client.on('connect', () => {
  console.log('Conectado a Redis');
});


function publish() {
    // Publicar un mensaje en el canal "test"
    client.publish('test', JSON.stringify({ msg: 'Hola a todos' }))
    .then(() => {
        console.log('Mensaje publicado con éxito');
    })
    .catch((err) => {
        console.error('Error al publicar el mensaje:', err);
    });

}

setInterval(publish, 3000);
