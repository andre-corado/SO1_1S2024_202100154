# Proyecto Final


# Documentación

## Introducción

¡Prepárate para una experiencia única en el mundo de la música guatemalteca! Estamos lanzando un emocionante proyecto destinado a revolucionar la forma en que votamos por nuestras bandas favoritas. ¿Qué encontrarás en esta travesía musical? Un sistema de votación diseñado para impulsar el talento local, con archivos de votos que surcan el espacio digital hacia servicios como grpc y wasm, listos para ser encolados y procesados con precisión. Y no te pierdas el emocionante ritmo de nuestros consumidores, que están en constante vigilancia, asegurando que cada voto llegue a la base de datos en Redis. ¿El resultado final? Fascinantes dashboards que muestran el pulso del concurso en tiempo real, junto con una base de datos en MongoDB llena de historias por descubrir, todo a través de una aplicación web dinámica y envolvente. ¿Listo para vivir la emoción de la música guatemalteca como nunca antes?


## Objetivos

- Realizar el sistempa implementando una arquitectura de microservicios con Kubernetes.

- Comunicar diferentes servicios mediante sistemas de mensajería.

- Utilizar Grafana para visualizar datos en tiempo real.

## Descrición de cada tecnología utilizada

### **Kubernetes**

Kubernetes es un sistema de código abierto para la automatización del despliegue, escalado y manejo de aplicaciones en contenedores. Originalmente fue diseñado por Google y ahora es mantenido por la Cloud Native Computing Foundation.

### **Dockers**

Docker es un proyecto de código abierto que automatiza el despliegue de aplicaciones dentro de contenedores de software, proporcionando una capa adicional de abstracción y automatización de virtualización a nivel de sistema operativo en Linux.

### **gRPC**

gRPC es un sistema de comunicación de código abierto desarrollado por Google que permite la comunicación entre servicios en diferentes lenguajes y plataformas.

### **Redis**

Redis es una base de datos en memoria de código abierto que se utiliza como base de datos, caché y agente de mensajes.

### **MongoDB**

MongoDB es una base de datos de documentos de código abierto y sin esquemas que proporciona alta disponibilidad, escalabilidad y rendimiento.

### **Grafana**

Grafana es una plataforma de análisis y visualización de código abierto que permite a los usuarios crear, explorar y compartir paneles y gráficos de datos en tiempo real.

### **Apache Kafka**

Es una plataforma de transmisión de eventos distribuida que se utiliza para la construcción de aplicaciones en tiempo real y la transmisión de datos en tiempo real.

Permite a los usuarios publicar, suscribirse, almacenar y procesar flujos de registros en tiempo real.

En este proyecto se utilizó Kafka para la comunicación entre los productores y consumidores de votos.

### **Ingress**

Ingress es una API de Kubernetes que administra el acceso externo a los servicios en un clúster, típicamente HTTP.

En el proyecto recibe el tráfico de Locust y distribuye las peticiones a los pods de los generadores de votos. 

## Descripción de cada deployment y service de K8S

1. Ingress

Cuenta con dos endpoints, con el fin de redigir el tráfico de mensajería hacia alguno de los servicios, uno para el servicio de Rust y otro para el servicio de GRPC. 

2. Producer Rust

Este servicio se encarga de recibir los votos de Locust, y enviarlos al servicio de Kafka. 

Hace uso de un deployment y un service, hace uso de clusterIP para la comunicación interna.

3. Producer GRPC

Este servicio se encarga de recibir los votos de Locust, y enviarlos al servicio de Kafka.

Hace uso de un deployment y un service, hace uso de clusterIP para la comunicación interna.

4. Kafka

Este servicio se encarga de recibir los votos de los servicios de Rust y GRPC, y enviarlos al servicio del consumer, o dependiendo el auto scaling, a los consumers. 

5. Consumer

Este servicio se encarga de recibir los votos de Kafka, los interpreta para almacenarlos en las bases de datos de Redis y MongoDB.

Hace uso de un deployment y un service, hace uso de clusterIP para la comunicación interna. Adicional, se utilizó autoscaling para escalar el número de pods dependiendo la carga de trabajo.

6. Redis

Este servicio se encarga de almacenar los votos de los consumidores de manera que puedan ser visualizados en tiempo real. 

Hace uso de loadBalancer para la comunicación externa.

7. MongoDB

Este servicio se encarga de almacenar los votos de los consumidores de manera que puedan ser visualizados en tiempo real.

Hace uso de loadBalancer para la comunicación externa.

8. Grafana

Este servicio se encarga de visualizar los votos de los consumidores en tiempo real. 



## Conclusiones

- Kubernetes permite la orquestación de contenedores de manera eficiente, permitiendo la escalabilidad y la alta disponibilidad de los servicios.

- Kafka es una herramienta muy útil para la comunicación entre servicios, permitiendo la transmisión de eventos en tiempo real.

- Redis y MongoDB son bases de datos muy útiles para almacenar datos en tiempo real.
  
- Grafana es una herramienta muy útil para visualizar datos en tiempo real, haciendo uso de dashboards personalizados.

- La arquitectura de microservicios permite la escalabilidad y la alta disponibilidad de los servicios, permitiendo la comunicación entre ellos de manera eficiente.

- La comunicación entre servicios mediante sistemas de mensajería permite la transmisión de eventos en tiempo real, permitiendo la comunicación entre los servicios de manera eficiente.

  

