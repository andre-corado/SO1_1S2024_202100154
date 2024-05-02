use rocket::response::status::BadRequest;
use rocket::serde::json::{json, Value as JsonValue};
use rocket::serde::json::Json;
use rocket::config::SecretKey;
use rocket_cors::{AllowedOrigins, CorsOptions};
use rdkafka::producer::{Producer, FutureProducer};
use rdkafka::util::get_rdkafka_version;
use rdkafka::config::ClientConfig;


#[derive(rocket::serde::Deserialize)]
struct Data {
    name: String,
    album: String,
    year: String,
    rank: String,
}

#[rocket::post("/data", data = "<data>")]
fn receive_data(data: Json<Data>) -> Result<String, BadRequest<String>> {
    let received_data = data.into_inner();
    let response = JsonValue::from(json!({
        "message": format!("Received data: Nombre: {}, Album: {}, Año: {}, Rank: {}", received_data.name, received_data.album, received_data.year, received_data.rank)
    }));
    // Enviar mensaje a Kafka
    send_kafka().await;
    Ok(response.to_string())
}


// KAFKA -----------------------------------------------------------------------
// Función para enviar mensajes a un tópico de Kafka
async fn send_kafka() {
    // Configura la configuración del cliente Kafka
    let mut producer = ClientConfig::new()
        .set("bootstrap.servers", "cluster-p2-kafka-bootstrap:9092")
        .set("message.timeout.ms", "2000")
        .create::<FutureProducer>()
        .expect("Producer creation error");

    // Envia un mensaje al topic 'my-topic'
    producer.send_copy::<str, str>("my-topic", Some("key"), Some("value"), None, None)
        .await
        .expect("Failed to produce message")
        .unwrap();
}



#[rocket::main]
async fn main() {
    let secret_key = SecretKey::generate(); // Genera una nueva clave secreta
    let version = get_rdkafka_version();

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