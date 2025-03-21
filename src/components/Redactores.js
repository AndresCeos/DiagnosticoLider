import { list } from '@vercel/blob';
import { useState, useEffect } from 'react';


export default function Redactores() {
    const [files, setFiles] = useState([]);


    useEffect(() => {
        listBriefFiles();
    }, []);
  
   const listBriefFiles = async () => {
    
        // Listar archivos con prefijo "brief/"
        const { blobs } = await list({
        token: "vercel_blob_rw_KwdI4XyihBuH5ui9_aAvPjetIZhwukC2fUsDQO0zsf8zRVd", // Token con permisos de lectura
        limit: 1000, // Máximo de archivos a listar
        headers: { 'Access-Control-Allow-Origin': '*',  }
        }).then(res => {
            console.log(res.json())
        }).catch(err => console.error(err));

        setFiles(blobs.map(blob => ({
            name: blob.pathname.replace('brief/', ''), // Remover prefijo de carpeta
            url: blob.url,
            size: blob.size,
            uploadedAt: blob.uploadedAt
            })));
        console.log(files);
    };
    return(
        <div>
            <h1>Documentos</h1>
            {files.length === 0 && <p>No hay archivos</p>}
            {files.map(file => (
                <div key={file.name}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                </a>
                </div>
            ))}
        </div>
    )
}

