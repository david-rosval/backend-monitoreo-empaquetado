import admin from 'firebase-admin'; // Firebase Admin SDK

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Función para enviar notificaciones con Firebase
export async function sendNotification(title, body) {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      topic: process.env.MESSAGING_TOPIC,
    };
    const response = await admin.messaging().send(message);
    console.log('Notificación enviada:', response);
  } catch (error) {
    console.error('Error al enviar la notificación:', error);
  }
}

/* const message = {
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
  }); */