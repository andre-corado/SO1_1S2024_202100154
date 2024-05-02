use rocket::response::status::BadRequest;
use rocket::serde::json::{json, Value as JsonValue};
use rocket::serde::json::Json;
use rocket::config::SecretKey;
use rocket_cors::{AllowedOrigins, CorsOptions};
use rdkafka::producer::{FutureRecord, FutureProducer};
use rdkafka::util::Timeout;


#[derive(rocket::serde::Deserialize, Clone)]
struct Data {
    name: String,
    album: String,
    year: String,
    rank: String,
}

#[rocket::post("/data", data = "<data>")]
fn receive_data(data: Json<Data>) -> Result<String, BadRequest<String>> {
    let received_data = data.clone().into_inner();
    let message = json!({
        "message": format!("Received data: Nombre: {}, Album: {}, Año: {}, Rank: {}", received_data.name, received_data.album, received_data.year, received_data.rank)
    });
    // Enviar mensaje a Kafka
    send_kafka(data);
    Ok(message.to_string())
}



// KAFKA -----------------------------------------------------------------------
// Función para enviar mensajes a un tópico de Kafka
async fn send_kafka(data: Json<Data>) {
    // Configura la configuración del cliente Kafka
    let producer: FutureProducer = rdkafka::config::ClientConfig::new()
        .set("bootstrap.servers", "cluster-p2-kafka-bootstrap:9092")
        .set("message.timeout.ms", "2000")
        .create()
    .expect("Producer creation error");

    // Formato del mensaje a enviar
    let payload: String = format!("{},{},{},{}", data.name, data.album, data.year, data.rank);
    let topic = "my-topic";
    let delivery_status = producer.send(
            FutureRecord::<String, _>::to(&topic)
                .payload(&payload.as_bytes().to_vec()),
            Timeout::Never,
        ).await;


    // Verificar el estado de entrega del mensaje
    match delivery_status {
        Ok(delivery_result) => {
            println!("Mensaje enviado con éxito: {:?}", delivery_result);
        }
        Err((err, _msg)) => {
            eprintln!("Error al enviar el mensaje: {:?}", err);
        }
    }
}



#[rocket::main]
async fn main() {
    let secret_key = SecretKey::generate(); // Genera una nueva clave secreta

    // Configuración de opciones CORS
    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())
        .to_cors()
        .expect("failed to create CORS fairing");

    let config = rocket::Config {
        address: "0.0.0.0".parse().unwrap(),
        port: 8080,
        secret_key: secret_key.unwrap(), // Desempaqueta la clave secreta generada
        ..rocket::Config::default()
    };

    // Montar la aplicación Rocket con el middleware CORS
    rocket::custom(config)
        .attach(cors)
        .mount("/", rocket::routes![receive_data])
        .launch()
        .await
        .unwrap();
}