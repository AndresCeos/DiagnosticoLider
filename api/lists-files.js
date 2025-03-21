// api/list-files.js
import { list } from '@vercel/blob';// Asegúrate de que la importación sea correcta



export async function GET(request) {
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
}
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
