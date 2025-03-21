import { head, list } from '@vercel/blob';
import { useState, useEffect } from 'react';


export default function Redactores() {
    const [files, setFiles] = useState([]);


    useEffect(() => {
        listBriefFiles();
    }, []);
  
    const fetchFiles = async () => {
        try {
          const response = await fetch('/api/lists-files');
          if (!response.ok) throw new Error('Error al listar archivos');
          const data = await response.json();
          setFiles(data);
          console.log(data)
        } catch (error) {
          console.log();
        }
      };
   const listBriefFiles = async () => {
        // Aquí se construye la llamada a la API de Vercel Blob
        const  b  = await fetch('/api/lists-files', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            mode: 'no-cors'
        });
    
        // Listar archivos con prefijo "brief/"
         /*const b = await list({
            token: 'vercel_blob_rw_KwdI4XyihBuH5ui9_aAvPjetIZhwukC2fUsDQO0zsf8zRVd',
            limit: 1000 // Token con permisos de lectura
            }, {headers: {'Access-Control-Allow-Origin': '*'}, mode: 'no-cors'});*/

            setFiles(b);
        /*setFiles(blobs.map(blob => ({
            name: blob.pathname.replace('brief/', ''), // Remover prefijo de carpeta
            url: blob.url,
            size: blob.size,
            uploadedAt: blob.uploadedAt
            })));
        console.log(files);*/
    };
    console.log(files)
    
    return(
        <div>
            <h1>Documentos</h1>
            {files.length === 0 && <p>No hay archivos</p>}
            
        </div>
    )
}

