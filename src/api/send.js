// api/list-files.js
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const date = new Date();
const formattedDate = `${date.getDate()}-${meses[date.getMonth()]}-${date.getFullYear()}`;

const RESEND_API_KEY = 're_iPq8aiTa_4zkvNjRyamE8YeBEx8K728U3';

export default async function handler(req,res) {
if(req.method !== 'POST') {
  try {
    const data =await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'no-reply@resend.dev',
          to: ['alejandra.avila@liderempresarial.com','Lci.Edgar.Perez@gmail.com','andres@ceosnm.com'] ,
          subject: 'Nueva Solicitud de Brief',
          html: '<h3>Brief del Servicio</h3>',
        attachments: [{ filename: `${formattedDate}_Brief del Servicio.pdf`, content: req.body }],
      }),
    });
    const result = await data.json();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
}
}