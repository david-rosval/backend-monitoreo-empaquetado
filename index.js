import mqtt from 'mqtt'; // Librería MQTT
import admin from 'firebase-admin'; // Firebase Admin SDK
import dotenv from 'dotenv'; // Manejo de variables de entorno
//import fs from 'node:fs'; // Manejo de archivos

// Cargar variables de entorno
dotenv.config();

/* // Configurar Firebase
const serviceAccount = JSON.parse(
  await fs.promises.readFile(process.env.FIREBASE_KEY_PATH, 'utf-8')
); */

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Configuración del broker MQTT
const mqttOptions = {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
};

const client = mqtt.connect(process.env.MQTT_BROKER_URL, mqttOptions);

// Conexión al broker
client.on('connect', () => {
  console.log('Conectado al broker MQTT');
  client.subscribe(process.env.MQTT_TOPIC, (err) => {
    if (err) {
      console.error('Error al suscribirse al tópico:', err);
    } else {
      console.log(`Suscrito al tópico: ${process.env.MQTT_TOPIC}`);
    }
  });
});

// Recepción de mensajes
client.on('message', (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    console.log('Mensaje recibido:', payload);

    if (payload.contenedorLleno === true) {
      console.log('¡Contenedor lleno! Enviando notificación...');
      sendNotification('¡Contenedor lleno!', 'El contenedor ha alcanzado su capacidad máxima.');
    }
  } catch (err) {
    console.error('Error procesando el mensaje:', err);
  }
});

// Función para enviar notificaciones con Firebase
function sendNotification(title, body) {
  const message = {
    notification: {
      title,
      body,
    },
    topic: process.env.MESSAGING_TOPIC, 
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log('Notificación enviada:', response);
    })
    .catch((error) => {
      console.error('Error al enviar la notificación:', error);
    });
}
