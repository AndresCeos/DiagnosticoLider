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
/*
export async function send(pdfBlob) {
  const resend = new Resend('re_iPq8aiTa_4zkvNjRyamE8YeBEx8K728U3');
      await resend.emails.send({
        from: 'no-reply@resend.dev',
        headers: { 'Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' },
        to: ['alejandra.avila@liderempresarial.com','Lci.Edgar.Perez@gmail.com','andres@ceosnm.com'] ,
        subject: 'Nueva Solicitud de Brief',
        html: '<h3>Brief del Servicio</h3>',
        attachments: [{ filename: `${formattedDate}_Brief del Servicio.pdf`, content: pdfBlob }]
      });
  }*/

/*export async function GET(request) {
   await list({
    token: 'vercel_blob_rw_KwdI4XyihBuH5ui9_aAvPjetIZhwukC2fUsDQO0zsf8zRVd',
    limit: 1000,
    prefix: 'brief/'
  }).then(blobs => {
    return (JSON.stringify(blobs), {
  })
  
}
  ).catch(error => { 
    return (JSON.stringify(error), {
      
    })
  })
}*/
/*export default async function handler(req, res) {
  // Manejo de preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  try {
    // Aquí se construye la llamada a la API de Vercel Blob
    // Verifica que la función 'list' acepte la configuración de headers.
    const { blobs }  = await list({
      // En lugar de pasar token directamente, usa una cabecera:
      headers: {
        "Authorization": `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` // Guarda tu token en una variable de entorno
      },
      limit: 1000
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ blobs });
  } catch (error) {
    console.error('Error al listar archivos:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: 'Error al listar archivos' });
  }
}*/
