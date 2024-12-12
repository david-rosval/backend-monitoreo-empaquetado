import mqtt from 'mqtt'; // Librería MQTT
import { sendNotification } from '../firebase/firebase.js';
import { RegisteredPackage } from '../models/mongodb.js';
import connectDb from '../db/mongodb.js';

// Configuración del broker MQTT
const mqttOptions = {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
};

const client = mqtt.connect(process.env.MQTT_BROKER_URL, mqttOptions);

export function connectToBroker() {
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
  client.on('message', async (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      console.log('Mensaje recibido:', payload);

      // Registro en mongoDB
      const registeredPackage = {
        weight: payload.peso,
        isValid: payload.peso >= 25,
      };
      await connectDb()
      const paqueteRegistrado = await RegisteredPackage.create(registeredPackage);
      console.log('Paquete registrado con éxito en MongoDB:', paqueteRegistrado);

      // Envío de notificación
      if (payload.contenedorLleno === true) {
        console.log('¡Contenedor lleno! Enviando notificación...');
        await sendNotification('¡Contenedor lleno!', 'El contenedor ha alcanzado su capacidad máxima.');
      }
    } catch (err) {
      console.error('Error procesando el mensaje:', err);
    }
  });
}

