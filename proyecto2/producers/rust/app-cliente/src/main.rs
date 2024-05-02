use rocket::{routes, serde::json::Json};
use rocket::post;
use rocket::get;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use rocket::config::SecretKey;
use rocket_cors::{AllowedOrigins, CorsOptions};


#[derive(Debug, Serialize, Deserialize)]
struct Data {
    name: String,
    album: String,
    year: String,
    rank: String,
}


#[get("/")]
fn index() -> &'static str {
    "¡Hola, mundo!"
}

#[post("/rust", data = "<data>")]
async fn send_data(data: Json<Data>) -> String {
    let client = Client::new();
    let server_url = "http://localhost:8080/data";

    let json_string = format!(
        r#"{{"message":"Mensaje recibido!","content":{{"Nombre":"{}","Album":"{}","Año":"{}","Rank":"{}"}}}}"#,
        data.name, data.album, data.year, data.rank
    );
        let response: Result<reqwest::Response, reqwest::Error> = client.post(server_url).json(&data.into_inner()).send().await;
    match response {
        Ok(_) => json_string,
        Err(e) => format!("Failed to send data: {}", e),
    }
}

#[rocket::main]
async fn main() {
    // --------------------------------------------------------------------------
    let secret_key = SecretKey::generate(); // Genera una nueva clave secreta

    // Configuración de opciones CORS
    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())
        .to_cors()
        .expect("failed to create CORS fairing");

    let config = rocket::Config {
        address: "0.0.0.0".parse().unwrap(),
        port: 8000,
        secret_key: secret_key.unwrap(), // Desempaqueta la clave secreta generada
        ..rocket::Config::default()
    };
    //----------------------------------------------------------------------------
    //rocket::build().mount("/", routes![send_data]).launch().await.unwrap();
    rocket::custom(config)
    .attach(cors)
    .mount("/", rocket::routes![send_data])
    .mount("/", rocket::routes![index])
    .launch()
    .await
    .unwrap();
}