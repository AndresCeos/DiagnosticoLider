import { list } from '@vercel/blob';
import { useState, useEffect } from 'react';


export default function Redactores() {
    const [files, setFiles] = useState([]);


    useEffect(() => {
        listBriefFiles();
    }, []);

    const listBriefFiles = async () => {
    try {
        // Listar archivos con prefijo "brief/"
        const { blobs } = await list({
        prefix: 'brief/',
        token: "vercel_blob_rw_KwdI4XyihBuH5ui9_aAvPjetIZhwukC2fUsDQO0zsf8zRVd", // Token con permisos de lectura
        limit: 1000 // Máximo de archivos a listar
        });

        setFiles(blobs);

        // Mapear resultados a formato útil
        /*return blobs.map(blob => ({
        name: blob.pathname.replace('brief/', ''), // Remover prefijo de carpeta
        url: blob.url,
        size: blob.size,
        uploadedAt: blob.uploadedAt
        }));*/


    } catch (error) {
        console.error('Error al listar archivos:', error);
        throw error;
    }
    };
    return(
        <div>
            <h1>Documentos</h1>
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

