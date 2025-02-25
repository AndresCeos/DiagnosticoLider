import { useRef, useState } from "react";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import emailjs from 'emailjs-com';
import './FormularioRadar.css';
import {base64Image} from './image';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const EncuestaSatisfaccion = () =>{
  // const [responses, setResponses] = useState(Array(Object.values(categories).flat().length).fill(0));
  const [clientData, setClientData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    empresa: '',
    tamano: '',
    tipo: '',
    edad: '',
    sector: '',
  });
  const [respuestas, setRespuestas] = useState({
    calidad: '',
    experienciaComunicacion: '',
    capacidadRespuesta: '',
    satisfaccionGeneral: '',
    recomendacion: '',
    impactoPositivo: '',
    continuidad: '',
    relevanciaServicios: '',
    comentarios: ''
  });
  const preguntas = [
    "¿Cómo calificaría la calidad general de nuestros servicios de comunicación?",
    "¿Cómo ha sido su experiencia con la comunicación con nuestro equipo?",
    "¿Cómo evalúa nuestra capacidad de respuesta a sus problemas y consultas?",
    "¿Qué tan satisfecho/a está con Líder Empresarial en general?",
    "¿Qué tan probable es que recomiendes Líder Empresarial a tus amigos, compañeros de trabajo o familiares?",
    "¿Ha notado un impacto positivo en su negocio desde que empezó a trabajar con nosotros?",
    "¿Cómo evaluaría la posibilidad de dar continuidad a su plan de comunicación actual con Líder Empresarial en el siguiente año?",
    "En una escala del 1 al 10, ¿qué tan relevantes y estratégicos considera que son nuestros servicios para el éxito y crecimiento de su negocio?",
    "¿Tiene algún comentario adicional sobre cómo podemos mejorar nuestros servicios?",
  ];
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRespuestas((prevRespuestas) => ({
      ...prevRespuestas,
      [name]: value
    }));
  };

  const handleClientDataChange = (e) => {
    const { name, value } = e.target;
    setClientData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let validationErrors = {};
    Object.keys(clientData).forEach((key) => {
      if (!clientData[key]) {
        validationErrors[key] = 'Este campo es obligatorio';
      }
    });
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const resetForm = () => {
    setRespuestas({ calidad: '',experienciaComunicacion: '', capacidadRespuesta: '', satisfaccionGeneral: '', recomendacion: '', impactoPositivo: '', continuidad: '', relevanciaServicios: '', comentarios: ''  })
    setClientData({ nombre: '', correo: '', telefono: '', empresa: '', tamano: '', tipo: '', edad: '',sector: '' });
    setErrors({});
  };

  const sendEmail = async () => {
    if (!validateForm()) return;

    const emailParams = {
      to_email: 'alan@ceosnm.com',
      subject: 'Encuesta de Satisfacción de Clientes sobre su experiencia de compra',
      nombre: clientData.nombre,
      correo: clientData.correo,
      telefono: clientData.telefono,
      empresa: clientData.empresa,
      tamano: clientData.tamano,
      tipo: clientData.tipo,
      edad: clientData.edad,
      sector: clientData.sector,
      pregunta1: `${preguntas[0]}: ${respuestas.calidad}`,
      pregunta2: `${preguntas[1]}: ${respuestas.experienciaComunicacion}`,
      pregunta3: `${preguntas[2]}: ${respuestas.capacidadRespuesta}`,
      pregunta4: `${preguntas[3]}: ${respuestas.satisfaccionGeneral}`,
      pregunta5: `${preguntas[4]}: ${respuestas.recomendacion}`,
      pregunta6: `${preguntas[5]}: ${respuestas.impactoPositivo}`,
      pregunta7: `${preguntas[6]}: ${respuestas.continuidad}`,
      pregunta8: `${preguntas[7]}: ${respuestas.relevanciaServicios}`,
      pregunta9: `${preguntas[8]}: ${respuestas.comentarios}`
    };

    // Convertir el documento PDF a Blob para enviarlo como archivo adjunto

    emailjs.send('service_njtd0us', 'template_xdc198d', emailParams, 'OyC263ffjG5XLjOYY')
      .then((result) => {
        alert('Correo enviado exitosamente');
      }, (error) => {
        alert('Hubo un error al enviar el correo: ' + error.text);
      });
      sendToGoogleSheets(emailParams);
  };

  const sendToGoogleSheets = () =>{

    const formData = new FormData(document.getElementById('formClientId'));
    formData.append("calidad",respuestas.calidad);
    formData.append("experienciaComunicacion",respuestas.experienciaComunicacion);
    formData.append("capacidadRespuesta",respuestas.capacidadRespuesta);
    formData.append("satisfaccionGeneral",respuestas.satisfaccionGeneral);
    formData.append("recomendacion",respuestas.recomendacion);
    formData.append("impactoPositivo",respuestas.impactoPositivo);
    formData.append("continuidad", respuestas.continuidad);
    formData.append("relevanciaServicios", respuestas.relevanciaServicios);
    formData.append("comentarios", respuestas.comentarios);
    formData.append("sector", respuestas.sector);
    console.log(formData)
    fetch("https://script.google.com/macros/s/AKfycbyZRm19tn74RPCCYJDya5fdfwg6d6tAWiXaDfqaSeFUlFa2l9YZrLgNKjwUxZ7NmYg8/exec",{
      method: "POST",
      body: formData
    }
    )
  }

  const exportToPDF = () => {
    const doc = new jsPDF({ format: 'a4', unit: 'mm' });
    let yPosition = 10;

    // Base64 del logo (asegúrate de reemplazar esto con el base64 generado)
    const logoBase64 = base64Image; // Recorta aquí por legibilidad

    // Agregar logotipo al PDF
    doc.addImage(logoBase64, 'PNG', 10, 10, 50, 20); // Ajusta la posición y el tamaño según lo necesites
    yPosition += 30; // Ajustar el yPosition para dejar espacio para el logotipo

    // Título
    doc.setFontSize(12);
    doc.text('Encuesta de Satisfacción de Clientes sobre su experiencia de compra', 10, yPosition);
    yPosition += 10;

    // Información del cliente
    doc.setFontSize(10);
    const clientInfo = [
        `Nombre: ${clientData.nombre}`,
        `Correo: ${clientData.correo}`,
        `Teléfono: ${clientData.telefono}`,
        `Empresa: ${clientData.empresa}`,
        `Tamaño de la organización: ${clientData.tamano}`,
        `Tipo de empresa: ${clientData.tipo}`,
        `Edad de la empresa: ${clientData.edad}`,
        `Sector: ${clientData.sector}`,
    ];

    clientInfo.forEach(info => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 10;
        }
        doc.text(info, 10, yPosition);
        yPosition += 10;
    });

    const resposes = [
        `${preguntas[0]}: ${respuestas.calidad}`,
        `${preguntas[1]}: ${respuestas.experienciaComunicacion}`,
        `${preguntas[2]}: ${respuestas.capacidadRespuesta}`,
        `${preguntas[3]}: ${respuestas.satisfaccionGeneral}`,
        `${preguntas[4]}: ${respuestas.recomendacion}`,
        `${preguntas[5]}: ${respuestas.impactoPositivo}`,
        `${preguntas[6]}: ${respuestas.continuidad}`,
        `${preguntas[7]}: ${respuestas.relevanciaServicios}`,
        `${preguntas[8]}: ${respuestas.comentarios}`,
    ];
    doc.setFontSize(8);
    resposes.forEach(info => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 10;
        }
        doc.text(info, 10, yPosition);
        yPosition += 10;
    })
    const fileName = `resutados_satisfaccion_${clientData.empresa || 'empresa'}.pdf`;
    doc.save(fileName);

};

const handleSubmit = (e) => {
  e.preventDefault();
  if (validateForm()) {
    exportToPDF();
  }
};
    return(
      <div className="formulario-radar-container">
        <div className="my-3 flex justify-center">
          <img className='w-[200px]' src='logo.webp' alt='logo' />
        </div>
        <h2 className="formulario-title">Encuesta de Satisfacción de Clientes sobre su experiencia de compra</h2>
        <form className="formulario-form" onSubmit={handleSubmit} id="formClientId">
          <div className="client-data-container">
            <h3 className="client-data-title">Registro de Cliente</h3>
            <div className="client-data-field">
              <label>Nombre:</label>
              <input type="text" name="nombre" value={clientData.nombre} onChange={handleClientDataChange} style={{ borderColor: errors.nombre ? 'red' : '#ccc' }} />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>
            <div className="client-data-field">
              <label>Correo:</label>
              <input type="email" name="correo" value={clientData.correo} onChange={handleClientDataChange} style={{ borderColor: errors.correo ? 'red' : '#ccc' }} />
              {errors.correo && <span className="error-message">{errors.correo}</span>}
            </div>
            <div className="client-data-field">
              <label>Teléfono:</label>
              <input type="text" name="telefono" value={clientData.telefono} onChange={handleClientDataChange} style={{ borderColor: errors.telefono ? 'red' : '#ccc' }} />
              {errors.telefono && <span className="error-message">{errors.telefono}</span>}
            </div>
            <div className="client-data-field">
              <label>Empresa:</label>
              <input type="text" name="empresa" value={clientData.empresa} onChange={handleClientDataChange} style={{ borderColor: errors.empresa ? 'red' : '#ccc' }} />
              {errors.empresa && <span className="error-message">{errors.empresa}</span>}
            </div>
            <div className="client-data-field">
              <label>Tamaño de la organización:</label>
              <select name="tamano" value={clientData.tamano} onChange={handleClientDataChange} style={{ borderColor: errors.tamano ? 'red' : '#ccc' }}>
                <option value="">Seleccione</option>
                <option value="Mipyme">Mipyme</option>
                <option value="Grande">Grande</option>
                <option value="Corporativo">Corporativo</option>
              </select>
              {errors.tamano && <span className="error-message">{errors.tamano}</span>}
            </div>
            <div className="client-data-field">
              <label>Tipo de empresa:</label>
              <select name="tipo" value={clientData.tipo} onChange={handleClientDataChange} style={{ borderColor: errors.tipo ? 'red' : '#ccc' }}>
                <option value="">Seleccione</option>
                <option value="Gobierno">Gobierno</option>
                <option value="Asociación">Asociación</option>
                <option value="Iniciativa privada">Iniciativa privada</option>
              </select>
              {errors.tipo && <span className="error-message">{errors.tipo}</span>}
            </div>
            <div className="client-data-field">
              <label>Edad de la empresa:</label>
              <select name="edad" value={clientData.edad} onChange={handleClientDataChange} style={{ borderColor: errors.edad ? 'red' : '#ccc' }}>
                <option value="">Seleccione</option>
                <option value="1 a 2 años">1 a 2 años</option>
                <option value="3 a 5 años">3 a 5 años</option>
                <option value="Más de 5 años">Más de 5 años</option>
              </select>
              {errors.edad && <span className="error-message">{errors.edad}</span>}
            </div>

            <div  className="client-data-field">
              <label  className="question-label">En qué sector opera su empresa</label>
              <select name="sector" value={clientData.sector} onChange={handleClientDataChange} style={{ borderColor: errors.sector ? 'red' : '#ccc' }}>
                <option value="">Seleccione</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Salud">Salud</option>
                <option value="Educación">Educación</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Manufactura">Manufactura</option>
                <option value="Comercio">Comercio</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.sector && <span className="error-message">{errors.sector}</span>}
            </div>


          </div>

          <div className="category-container">
            <div  className="question-container">
            <h3 className="client-data-title pb-5">Encuesta de Satisfacción de Clientes sobre su experiencia de compra</h3>
            <p className="my-5">¡Gracias por ser parte de la comunidad de Líder Empresarial! Para nosotros, es fundamental conocer tu opinión y mejorar continuamente la calidad de nuestros servicios. A través de esta breve encuesta de satisfacción, queremos entender mejor tu experiencia y cómo nuestros contenidos, servicios de publicidad y estrategias de comunicación han contribuido a tus objetivos. Tu retroalimentación nos ayudará a seguir ofreciendo soluciones estratégicas alineadas con tus necesidades. ¡Agradecemos mucho tu tiempo y colaboración!</p> 
            <div  className="question-container">
              <label className="question-label">1. ¿Cómo calificaría la calidad general de nuestros servicios de comunicación?</label>
              <div onChange={handleChange} className="radio-buttons modern-radio">
                {['Excelente', 'Buena', 'Regular', 'Mala', 'Muy mala'].map(option => (
                  <label key={option}>
                    <input type="radio" name="calidad" value={option} checked={respuestas.calidad === option} />
                    <span className="custom-radio"></span> {option}
                  </label>
                ))}
              </div>
            </div>
            <div  className="question-container">
              <label  className="question-label">2. ¿Cómo ha sido su experiencia con la comunicación con nuestro equipo?</label>
              <div onChange={handleChange} className="radio-buttons modern-radio">
                {['Muy satisfactoria', 'Satisfactoria', 'Neutral', 'Insatisfactoria', 'Muy insatisfactoria'].map(option => (
                  <label key={option}>
                    <input type="radio" name="experienciaComunicacion" value={option} checked={respuestas.experienciaComunicacion === option} /> 
                    <span className="custom-radio"></span> {option}
                  </label>
                ))}
              </div>
            </div>
            <div  className="question-container">
              <label  className="question-label">3. ¿Cómo evalúa nuestra capacidad de respuesta a sus problemas y consultas?</label>
              <div onChange={handleChange}  className="radio-buttons modern-radio">
                {['Muy rápida', 'Rápida', 'Adecuada', 'Lenta', 'Muy lenta'].map(option => (
                  <label key={option}>
                    <input type="radio" name="capacidadRespuesta" value={option} checked={respuestas.capacidadRespuesta === option} /> 
                    <span className="custom-radio"></span> {option}
                  </label>
                ))}
              </div>
            </div>
            <div  className="question-container">
              <label  className="question-label">4. ¿Qué tan satisfecho/a está con Líder Empresarial en general?</label>
              <div onChange={handleChange }  className="radio-buttons modern-radio">
                {['Muy satisfecho/a', 'Satisfecho/a', 'Neutral', 'Insatisfecho/a', 'Muy insatisfecho/a'].map(option => (
                  <label key={option}>
                    <input type="radio" name="satisfaccionGeneral" value={option} checked={respuestas.satisfaccionGeneral === option} /> 
                    <span className="custom-radio"></span> {option}
                  </label>
                ))}
              </div>
            </div>
            <div  className="question-container">
              <label className="question-label">5. ¿Qué tan probable es que recomiendes Líder Empresarial a tus amigos, compañeros de trabajo o familiares?</label>
              <div onChange={handleChange}  className="radio-buttons modern-radio">
                {[...Array(11).keys()].map(option => (
                  <label key={option}>
                    <input type="radio" name="recomendacion" value={option} checked={respuestas.recomendacion === String(option)} /> 
                    <span className="custom-radio"></span> {option}
                  </label>
                ))}
              </div>
            </div>
            <div  className="question-container">
              <label  className="question-label">6. ¿Ha notado un impacto positivo en su negocio desde que empezó a trabajar con nosotros?</label>
              <div onChange={handleChange}  className="radio-buttons modern-radio">
                {['Muy satisfecho/a', 'Satisfecho/a', 'Neutral', 'Insatisfecho/a', 'Muy insatisfecho/a'].map(option => (
                  <label key={option}>
                    <input type="radio" name="impactoPositivo" value={option} checked={respuestas.impactoPositivo === option} /> 
                    <span className="custom-radio"></span> {option}
                  </label>
                ))}
              </div>
            </div>
            <div  className="question-container">
              <label  className="question-label">7. ¿Cómo evaluaría la posibilidad de dar continuidad a su plan de comunicación actual con Líder Empresarial en el siguiente año?</label>
              <div onChange={handleChange}  className="radio-buttons modern-radio">
                {['Nada probable', 'Poco probable', 'Probable', 'Muy probable'].map(option => (
                  <label key={option}>
                    <input type="radio" name="continuidad" value={option} checked={respuestas.continuidad === option} /> 
                    <span className="custom-radio"></span> {option}
                  </label>
                ))}
              </div>
            </div>
            <div  className="question-container">
              <label  className="question-label">8. En una escala del 1 al 10, ¿qué tan relevantes y estratégicos considera que son nuestros servicios para el éxito y crecimiento de su negocio?</label>
              <div onChange={handleChange}  className="radio-buttons modern-radio">
                {[...Array(11).keys()].map(option => (
                  <label key={option}>
                    <input type="radio" name="relevanciaServicios" value={option} checked={respuestas.relevanciaServicios === String(option)} /> 
                    <span className="custom-radio"></span> {option}
                  </label>
                ))}
              </div>
            </div>
            <div  className="question-container textarea-container">
              <label  className="question-label" >9. ¿Tiene algún comentario adicional sobre cómo podemos mejorar nuestros servicios?</label>
              <textarea name="comentarios" value={respuestas.comentarios} onChange={handleChange} className="textarea" ></textarea>
            </div>
            </div>

          </div>
          <div className="button-container">
          <button type="button" className="reset-button" onClick={resetForm}>Reiniciar Formulario</button>
          <button type="submit" className="export-button" onClick={ () => exportToPDF()} >Exportar a PDF</button>
          <button type="button" className="export-button" onClick={() => sendEmail()}>Enviar Información</button>
        </div>
        </form>
        <div className="m-5">
         <p>¡Gracias por tomarte el tiempo de completar nuestra encuesta de satisfacción! Tu opinión es muy valiosa para nosotros y nos ayuda a seguir mejorando. Si tienes alguna sugerencia adicional, inquietud o queja, no dudes en contactarnos directamente.</p>
          <div className="flex flex-col">
            <span>Alejandra Ávila</span>
            <span>Directora Comercial</span>
            <span>Correo electrónico: alejandra.avila@liderempresarial.com</span>
            <span> Teléfono: (449) 106 85 88</span>
          </div>

          <p> Estamos aquí para escucharte y asegurarnos de que tu experiencia con Líder Empresarial sea siempre excelente. ¡Gracias por confiar en nosotros!</p>
        </div>
      </div>
    )
}

export default EncuestaSatisfaccion;