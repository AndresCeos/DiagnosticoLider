import { useState } from "react";
import './FormularioRadar.css';
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import {base64Image} from './image';
import { put } from "@vercel/blob";



export default function BriefFormulario() {
  const [formData, setFormData] = useState({
    tipoContenido: [],
    empresa: "",
    sector: "",
    liderNombre: "",
    trayectoriaAcademica: "",
    trayectoriaProfesional: "",
    historiaEmpresa: "",
    productosServicios: "",
    mensajePrincipal: "",
    reconocimientoActual: "",
    diferenciador: "",
    competidores: "",
    logros: "",
    mediosPublicitarios: "",
    mercadoObjetivo: "",
    redesSociales: [],
    facebook:"",
    instagram: "",
    tiktok: "",
    linkedin: "",
    twitter: "",
    paginaweb: "",
    instalacionesFotos: false,
    fotosIncluidas: false,
    vendedor:"",
    otherVendedor: "",
  
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "tipoContenido" || name === "redesSociales") {
        setFormData((prev) => ({
          ...prev,
          [name]: checked ? [...prev[name], value] : prev[name].filter((item) => item !== value),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    }
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const exportToPDF = async () => {
    try {
      const doc = new jsPDF({ format: 'a4', unit: 'mm' });
      let yPosition = 10;
      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];


      const date = new Date();
      const formattedDate = `${date.getDate()}-${meses[date.getMonth()]}-${date.getFullYear()}`;
      const formateDateTitle = `${date.getDate()} de ${meses[date.getMonth()]} del ${date.getFullYear()}`;
  
      // Logo
      doc.addImage(base64Image, 'PNG', 10, yPosition, 50, 20);
      yPosition += 30;
  
      // Título
      doc.setFontSize(12);
      const titleLines = doc.splitTextToSize(`Brief del Servicio - ${formateDateTitle}`, 190);
      titleLines.forEach(line => {
        if (yPosition > 280) { doc.addPage(); yPosition = 10; }
        doc.text(line, 10, yPosition);
        yPosition += 10;
      });
  
      // Información del cliente
      doc.setFontSize(10);
      const clientInfo = [
        { label: "Tipo de contenido deseado", value: formData.tipoContenido.join(", ") },
        { label: "Nombre de la empresa", value: formData.empresa },
        { label: "Sector o giro de la empresa", value: formData.sector },
        { label: "Nombre y cargo del lider o director", value: formData.liderNombre },
        { label: "Vendedor", value: formData.vendedor === "other" ? formData.otherVendedor : formData.vendedor },
        { label: "Trayectoria academica", value: formData.trayectoriaAcademica },
        { label: "Trayectoria profesional", value: formData.trayectoriaProfesional },
        { label: "Historia de la empresa", value: formData.historiaEmpresa },
        { label: "Productos y servicios", value: formData.productosServicios },
        { label: "Mensaje principal", value: formData.mensajePrincipal },
        { label: "Reconocimiento actual", value: formData.reconocimientoActual },
        { label: "Diferenciador", value: formData.diferenciador },
        { label: "Competidores", value: formData.competidores },
        { label: "Logros", value: formData.logros },
        { label: "Medios publicitarios", value: formData.mediosPublicitarios },
        { label: "Mercado objetivo", value: formData.mercadoObjetivo },
        { label: "Redes sociales", value: formData.redesSociales.join(", ") },
        { label: "Facebook", value: formData.facebook },
        { label: "Instagram", value: formData.instagram },
        { label: "Tiktok", value: formData.tiktok },
        { label: "Linkedin", value: formData.linkedin },
        { label: "Twitter", value: formData.twitter },
        { label: "Pagina web", value: formData.paginaweb },
        { label: "Instalaciones fotos", value: formData.instalacionesFotos },
        { label: "Fotos incluidas", value: formData.fotosIncluidas },
    ];
  
      clientInfo.forEach(({ label, value }) => {
        // Verificar espacio en página
        if (yPosition > 280) { 
          doc.addPage(); 
          yPosition = 10; 
        }
  
        // Formatear label
        doc.setFont("helvetica", "bold");
        const fullLabel = `${label}: `;
        const labelWidth = doc.getTextWidth(fullLabel);
        
        // Dibujar label y subrayado
        doc.text(fullLabel, 10, yPosition);
        doc.setLineWidth(0.1);
        doc.line(10, yPosition + 1, 10 + labelWidth, yPosition + 1);
  
        // Manejar valor multilínea
        doc.setFont("helvetica", "normal");
        const maxValueWidth = 190 - labelWidth;  // Ancho disponible para el valor
        const valueLines = doc.splitTextToSize(value, maxValueWidth);
  
        valueLines.forEach((line, index) => {
          if (index === 0) {
            // Primera línea al lado del label
            doc.text(line, 10 + labelWidth, yPosition);
          } else {
            // Líneas siguientes debajo del label
            yPosition += 5;
            if (yPosition > 280) { 
              doc.addPage(); 
              yPosition = 10; 
            }
            doc.text(line, 10, yPosition);
          }
        });
  
        // Actualizar posición Y
        yPosition += (valueLines.length > 1) ? (5 * valueLines.length) : 5;
      });
      const pdfBlob = doc.output('blob');

      const { url } = await put(`brief/${formattedDate}_${formData.vendedor === "other" ? formData.otherVendedor : formData.vendedor}_Brief del Servicio.pdf`, pdfBlob, {
        access: 'public',
        token: "vercel_blob_rw_KwdI4XyihBuH5ui9_aAvPjetIZhwukC2fUsDQO0zsf8zRVd" // Token seguro desde variables de entorno
      }).then(() => {
        Swal.fire({
          title: 'Formulario enviado',
          text: 'Datos enviados con éxito',
          icon: 'success',
          confirmButtonText: 'Cerrar'
        })
      });

      return url;
      // doc.save(`${formattedDate}_Brief del Servicio.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    exportToPDF();

  };

  return (
    <div className="formulario-radar-container">
      <div className="my-3 flex justify-center">
        <img className='w-[200px]' src='logo.webp' alt='logo' />
      </div>
      <h2 className="formulario-title" style={{ color: "black", textAlign: "center" }}>Brief del Servicio</h2>
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-4 formulario-form">
        <div className="client-data-container">
          <h3 className="client-data-title">INFORMACIÓN GENERAL</h3>
          <div className="client-data-field">
            <label>Tipo de contenido deseado:</label>
            {["Portada", "Publireportaje", "Nota digital"].map((item) => (
              <div key={item} className="flex items-center">
                <input type="checkbox" style={{ width: "50px" }} name="tipoContenido" value={item} onChange={handleChange} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="client-data-field">
            <label>Nombre de la empresa</label>
            <input name="empresa" type="text" onChange={handleChange} maxLength={50} required />
          </div>
          <div className="client-data-field">
            <label>Sector o giro de la empresa</label>
            <input name="sector" type="text" placeholder="" onChange={handleChange} maxLength={50} required />
          </div>
          <div className="client-data-field">
            <label>Nombre y cargo del líder o director</label>
            <input name="liderNombre" type="text" placeholder="" onChange={handleChange} maxLength={50} required />
          </div>
          <div className="client-data-field">
            <label>Vendedor</label>
            <select name="vendedor" onChange={handleChange} required>
              <option value="" disabled selected   >Seleccione una opción</option>
              <option value="Alejandra Ávila" >Alejandra Ávila</option>
              <option value="Cassandra Trejo" >Cassandra Trejo</option>
              <option value="Claudio Ruiz" >Claudio Ruiz</option>
              <option value="Gabriela Carrillo" >Gabriela Carrillo</option>
              <option value="Jackeline Barba" >Jackeline Barba</option>
              <option value="Luis Fernando" >Luis Fernando Macias</option>
              <option value="Lyly Escobedo" >Lyly Escobedo</option>
              <option value="Mayra Vargas" >Mayra Vargas</option>
              <option value="Otro" >Otro</option>
            </select>
            {formData.vendedor === "Otro"  &&  (
              <input name="otherVendedor" className="mt-2" type="text" placeholder="" onChange={handleChange} maxLength={50} required />
            )}
          </div>
        </div>

        <div className="client-data-container">
          <h3 className="client-data-title">INFORMACIÓN DEL LÍDER</h3>
          <div className="client-data-field">
            <label>Trayectoria académica (carreras, posgrados, instituciones)</label>
            <textarea className="textareabrief" name="trayectoriaAcademica" placeholder="" onChange={handleChange} required maxLength={200} ></textarea>
            <span className="text-xs text-gray-500">Máximo 200 caracteres</ span>
          </div>
          <div className="client-data-field">
            <label>Trayectoria profesional (cargos e instituciones donde ha trabajado)</label>
            <textarea className="textareabrief" name="trayectoriaProfesional" placeholder="" onChange={handleChange} maxLength={200} required ></textarea>
            <span className="text-xs text-gray-500">Máximo 200 caracteres</ span>
          </div>
        </div>

        <div className="client-data-container">
          <h3 className="client-data-title">INFORMACIÓN DE LA EMPRESA</h3>
          <div className="client-data-field">
            <label>Breve historia de la empresa</label>
            <textarea className="textareabrief" name="historiaEmpresa" placeholder="" onChange={handleChange} maxLength={250} required ></textarea>
            <span className="text-xs text-gray-500">Máximo 250 caracteres</ span>
          </div>
          <div className="client-data-field">
            <label>Productos o servicio que ofrecen (descripción breve de cada uno)</label>
            <textarea className="textareabrief" name="productosServicios" placeholder="" onChange={handleChange} maxLength={250} required ></textarea>
            <span className="text-xs text-gray-500">Máximo 250 caracteres</ span>
          </div>
        </div>

        <div className="client-data-container">
          <h3 className="client-data-title">ENFOQUE DEL ARTÍCULO</h3>
          <div className="client-data-field">
            <label>¿Qué mensaje principal quieres comunicar?</label>
            <textarea className="textareabrief" name="mensajePrincipal" placeholder="" onChange={handleChange} maxLength={250}required ></textarea>
            <span className="text-xs text-gray-500">Máximo 250 caracteres</ span>
          </div>
          <div className="client-data-field">
            <label>¿Cómo conocen actualmente tu empresa en el mercado?</label>
            <textarea className="textareabrief" name="reconocimientoActual" placeholder="" onChange={handleChange} maxLength={200} required ></textarea>
            <span className="text-xs text-gray-500">Máximo 200 caracteres</ span>
          </div>
          <div className="client-data-field">
            <label>¿Cuál es el principal diferenciador o ventaja competitiva de tu empresa?</label>
            <textarea className="textareabrief" name="diferenciador" placeholder="" onChange={handleChange} maxLength={200} required ></textarea>
            <span className="text-xs text-gray-500">Máximo 200 caracteres</ span>
          </div>
          <div className="client-data-field">
            <label>¿Quiénes son tus competidores directos?</label>
            <textarea className="textareabrief" name="competidores" placeholder="" onChange={handleChange} maxLength={100} required ></textarea>
            <span className="text-xs text-gray-500">Máximo 100 caracteres</ span>
          </div>
          <div className="client-data-field">
            <label>¿Qué logros recientes de la empresa te gustaría destacar?</label>
            <textarea className="textareabrief" name="logros" placeholder="" onChange={handleChange} maxLength={250} required ></textarea>
            <span className="text-xs text-gray-500">Máximo 250 caracteres</ span>
          </div>
          <div className="client-data-field">
            <label>¿Qué medios publicitarios has usado recientemente?</label>
            <textarea className="textareabrief" name="mediosPublicitarios" placeholder="" onChange={handleChange} maxLength={100} required ></textarea>
            <span className="text-xs text-gray-500">Máximo 100 caracteres</ span>
          </div>
          <div className="client-data-field">
            <label>¿A qué cliente o mercado te gustaría llegar?</label>
            <textarea className="textareabrief" name="mercadoObjetivo" placeholder="" onChange={handleChange} maxLength={100} required ></textarea>
            <span className="text-xs text-gray-500">Máximo 100 caracteres</ span>
          </div>
        </div>

        <div className="client-data-container">
          <h3 className="client-data-title">MEDIOS DIGITALES</h3>
          <div className="client-data-field">
            <label>¿Tienes redes sociales? (Marca las que uses y proporciona los enlaces):</label>
            {["facebook", "instagram", "tiktok", "twitter", "linkedIn", "paginaweb"].map((item) => (
              <div key={item} className="flex pb-5 items-baseline">
                <div><input type="checkbox" style={{ width: "50px" }}  name="redesSociales" value={item} onChange={handleChange} /> {item}</div>
                <input type="text" name={item} placeholder="Enlace" maxLength={50} onChange={handleChange} style={{ width: "50%", marginLeft: "10px" }} disabled={!formData.redesSociales.includes(item)}/>
              </div>
            ))}
          </div>
        </div>

        <div className="client-data-container">
          <h3 className="client-data-title">INFORMACIÓN TÉCNICA</h3>
          <div>
            <label>¿Tienes instalaciones que puedan usarse para fotos?</label>
            <input  className="client-data-field" type="checkbox" name="instalacionesFotos" onChange={handleChange} /> Sí
          </div>
          <div>
            <label>¿Tienes fotos para incluir?</label>
            <input  className="client-data-field" type="checkbox" name="fotosIncluidas" onChange={handleChange} /> Sí
          </div>
          {/*formData.fotosIncluidas && (
            <div className="client-data-field">
            <label>Subir archivos (PDF, JPEG, PNG, AI, PSD, máx. 5MB)</label>
            <input type="file" name="archivos" multiple accept=".pdf,.jpeg,.jpg,.png,.ai,.psd" onChange={handleChange} />
          </div>
          )*/}

        </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Enviar</button>
    </form>
    </div>
  );
}
