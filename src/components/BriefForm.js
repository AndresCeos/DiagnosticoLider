import { useState } from "react";
import './FormularioRadar.css';
import Swal from "sweetalert2";



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



  const handleSubmit = async (e) => {
    e.preventDefault();
    const formBody = {
      tipoContenido : formData.tipoContenido.join(", "),
      empresa : formData.empresa,
      sector : formData.sector,
      liderNombre : formData.liderNombre,
      trayectoriaAcademica : formData.trayectoriaAcademica,
      trayectoriaProfesional : formData.trayectoriaProfesional,
      historiaEmpresa : formData.historiaEmpresa,
      productosServicios : formData.productosServicios,
      mensajePrincipal : formData.mensajePrincipal,
      reconocimientoActual : formData.reconocimientoActual,
      diferenciador : formData.diferenciador,
      competidores : formData.competidores,
      logros : formData.logros,
      mediosPublicitarios : formData.mediosPublicitarios,
      mercadoObjetivo : formData.mercadoObjetivo,
      redesSociales : formData.redesSociales.join(", "),
      facebook : formData.facebook,
      instagram : formData.instagram,
      tiktok : formData.tiktok,
      linkedin : formData.linkedin,
      twitter : formData.twitter,
      paginaweb : formData.paginaweb,
      instalacionesFotos : formData.instalacionesFotos ? "Si" : "No",
      fotosIncluidas : formData.fotosIncluidas ? "Si" : "No",
    }



    const scriptURL = 'https://script.google.com/macros/s/AKfycbxkQln5F5agsy34MGDSVn_Snep7J9VpLDbwRJZtEtLRFmwHzbN8J4MRqoUOol4Pqmzt9g/exec';
    try{
    const response = await fetch(scriptURL, {
      method: 'POST',
      body: JSON.stringify(formBody),
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
    });
    const result = await response.json();
    console.log('Success:', result);
    } catch (error) {
      console.error('Error sending data to Google Sheets:', error);
    }
    Swal.fire({
      title: 'Formulario enviado',
      text: 'Datos enviados con éxito',
      icon: 'success',
      confirmButtonText: 'Cerrar'
    })

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
            <input name="empresa" type="text" onChange={handleChange} required />
          </div>
          <div className="client-data-field">
            <label>Sector o giro de la empresa</label>
            <input name="sector" type="text" placeholder="" onChange={handleChange} required />
          </div>
          <div className="client-data-field">
            <label>Nombre y cargo del líder o director</label>
            <input name="liderNombre" type="text" placeholder="" onChange={handleChange} required />
          </div>
        </div>

        <div className="client-data-container">
          <h3 className="client-data-title">INFORMACIÓN DEL LÍDER</h3>
          <div className="client-data-field">
            <label>Trayectoria académica (carreras, posgrados, instituciones)</label>
            <textarea className="textareabrief" name="trayectoriaAcademica" placeholder="" onChange={handleChange} required ></textarea>
          </div>
          <div className="client-data-field">
            <label>Trayectoria profesional (cargos e instituciones donde ha trabajado)</label>
            <textarea className="textareabrief" name="trayectoriaProfesional" placeholder="" onChange={handleChange} required ></textarea>
          </div>
        </div>

        <div className="client-data-container">
          <h3 className="client-data-title">INFORMACIÓN DE LA EMPRESA</h3>
          <div className="client-data-field">
            <label>Breve historia de la empresa</label>
            <textarea className="textareabrief" name="historiaEmpresa" placeholder="" onChange={handleChange} required ></textarea>
          </div>
          <div className="client-data-field">
            <label>Productos o servicio que ofrecen (descripción breve de cada uno)</label>
            <textarea className="textareabrief" name="productosServicios" placeholder="" onChange={handleChange} required ></textarea>
          </div>
        </div>

        <div className="client-data-container">
          <h3 className="client-data-title">ENFOQUE DEL ARTÍCULO</h3>
          <div className="client-data-field">
            <label>¿Qué mensaje principal quieres comunicar?</label>
            <textarea className="textareabrief" name="mensajePrincipal" placeholder="" onChange={handleChange} required ></textarea>
          </div>
          <div className="client-data-field">
            <label>¿Cómo conocen actualmente tu empresa en el mercado?</label>
            <textarea className="textareabrief" name="reconocimientoActual" placeholder="" onChange={handleChange} required ></textarea>
          </div>
          <div className="client-data-field">
            <label>¿Cuál es el principal diferenciador o ventaja competitiva de tu empresa?</label>
            <textarea className="textareabrief" name="diferenciador" placeholder="" onChange={handleChange} required ></textarea>
          </div>
          <div className="client-data-field">
            <label>¿Quiénes son tus competidores directos?</label>
            <textarea className="textareabrief" name="competidores" placeholder="" onChange={handleChange} required ></textarea>
          </div>
          <div className="client-data-field">
            <label>¿Qué logros recientes de la empresa te gustaría destacar?</label>
            <textarea className="textareabrief" name="logros" placeholder="" onChange={handleChange} required ></textarea>
          </div>
          <div className="client-data-field">
            <label>¿Qué medios publicitarios has usado recientemente?</label>
            <textarea className="textareabrief" name="mediosPublicitarios" placeholder="" onChange={handleChange} required ></textarea>
          </div>
          <div className="client-data-field">
            <label>¿A qué cliente o mercado te gustaría llegar?</label>
            <textarea className="textareabrief" name="mercadoObjetivo" placeholder="" onChange={handleChange} required ></textarea>
          </div>
        </div>

        <div className="client-data-container">
          <h3 className="client-data-title">MEDIOS DIGITALES</h3>
          <div className="client-data-field">
            <label>¿Tienes redes sociales? (Marca las que uses y proporciona los enlaces):</label>
            {["facebook", "instagram", "tiktok", "twitter", "linkedIn", "paginaweb"].map((item) => (
              <div key={item} className="flex pb-5 items-baseline">
                <div><input type="checkbox" style={{ width: "50px" }}  name="redesSociales" value={item} onChange={handleChange} /> {item}</div>
                <input type="text" name={item} placeholder="Enlace" onChange={handleChange} style={{ width: "50%", marginLeft: "10px" }} disabled={!formData.redesSociales.includes(item)}/>
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
