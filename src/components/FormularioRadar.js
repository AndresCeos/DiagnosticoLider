import React, { useState, useRef } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import emailjs from 'emailjs-com';
import './FormularioRadar.css';
import {base64Image} from './image';




ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);


const categories = {
  "Engagement y Comunicación": [
    '¿La empresa cuenta con al menos 3 redes sociales de las siguientes: como FB, IG, X, LinkedIn, TikTok)?',
    '¿En redes sociales se publica con frecuencia al menos 3 veces por semana?',
    '¿La empresa ha destinado presupuesto para el pago de pauta en redes sociales?',
    '¿El nivel de interacción al contenido de valor de los clientes es alta?',
    '¿Se cuenta con el diseño de una estrategia de comunicación enfocada en contenido de valor?'
  ],
  "Posicionamiento en Motores de Búsqueda (SEO)": [
    '¿La empresa cuenta con página web actualizada (al menos 1 año)?',
    '¿Conoce la visibilidad de su marca o página web en los motores de búsqueda?',
    '¿Conoce la autoridad de dominio de su página web?',
    '¿La página cuenta con una estrategia clara de SEO?',
    '¿La página refleja las historias de éxito y la trayectoria de las personas que laboran ahí?'
  ],
  "Reputación de Marca": [
    '¿La empresa conoce cuál es el sentimiento de marca de sus clientes? Positivo, negativo, neutral.',
    '¿La empresa analiza la percepción pública a través de reseñas, comentarios y menciones en medios?',
    '¿Conoce la tasa de retención de clientes que continúan eligiendo a su marca?',
    '¿Conoce el nivel de disposición de sus clientes para recomendar su marca a otros?',
    '¿Conoce el nivel de visibilidad de su marca dentro de su mercado objetivo?'
  ],
  "Publicidad Tradicional": [
    '¿La empresa ha destinado % de su presupuesto a la compra de publicidad tradicional?',
    '¿La empresa utiliza como medio de difusión patrocinios en eventos?',
    '¿La empresa pertenece a alguna comunidad/cámara empresarial?'
  ],
  "Tecnología e Innovación": [
    '¿Has escuchado hablar o utiliza alguna inteligencia artificial como herramienta de venta? ChatGPT, Gemini, Perplexity, etc.',
    '¿Tiene conocimiento de la huella digital de su empresa?'
  ]
};

const FormularioRadar = () =>{
  const [responses, setResponses] = useState(Array(Object.values(categories).flat().length).fill(0));
  const [clientData, setClientData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    empresa: '',
    tamano: '',
    tipo: '',
    edad: ''
  });
  const [errors, setErrors] = useState({});
  const chartRef = useRef();

  const handleChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = parseInt(value, 10);
    setResponses(newResponses);
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
    setResponses(Array(Object.values(categories).flat().length).fill(0));
    setClientData({ nombre: '', correo: '', telefono: '', empresa: '', tamano: '', tipo: '', edad: '' });
    setErrors({});
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      exportToPDF();
    }
  };

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
    doc.text('Evaluación Ejecutiva de la Empresa', 10, yPosition);
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
        `Edad de la empresa: ${clientData.edad}`
    ];

    clientInfo.forEach(info => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 10;
        }
        doc.text(info, 10, yPosition);
        yPosition += 10;
    });

    // Calificación por categoría
    Object.keys(categories).forEach((category, index) => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 10;
        }
        const start = index * categories[category].length;
        const end = start + categories[category].length;
        const categoryResponses = responses.slice(start, end);
        const averageScore = categoryResponses.reduce((acc, val) => acc + val, 0) / categories[category].length;
        doc.text(`${category}: ${averageScore.toFixed(2)}`, 10, yPosition);
        yPosition += 10;
    });

    // Respuestas completas a las preguntas
    if (yPosition > 270) {
        doc.addPage();
        yPosition = 10;
    }
    doc.text('Respuestas Completas:', 10, yPosition);
    yPosition += 10;

    Object.entries(categories).forEach(([category, questions], categoryIndex) => {
        questions.forEach((question, questionIndex) => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 10;
            }
            const response = responses[categoryIndex * questions.length + questionIndex] === 5 ? 'Sí' : 'No';
            doc.text(`${question}: ${response}`, 10, yPosition);
            yPosition += 10;
        });
    });

    // Exportar gráfica radial
    html2canvas(chartRef.current.canvas, { scale: 1 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.7);
        if (yPosition > 150) {
            doc.addPage();
            yPosition = 10;
        }
        doc.addImage(imgData, 'JPEG', 10, yPosition, 180, 100);
        const fileName = `evaluacion_${clientData.empresa || 'empresa'}.pdf`;
        doc.save(fileName);
    });
};



  const sendEmail = async () => {
    if (!validateForm()) return;

    const emailParams = {
      to_email: 'alan@ceosnm.com',
      subject: 'Evaluación Ejecutiva de la Empresa',
      nombre: clientData.nombre,
      correo: clientData.correo,
      telefono: clientData.telefono,
      empresa: clientData.empresa,
      tamano: clientData.tamano,
      tipo: clientData.tipo,
      edad: clientData.edad,
      categorias: Object.keys(categories).map((category, index) => {
        const start = index * categories[category].length;
        const end = start + categories[category].length;
        const categoryResponses = responses.slice(start, end);
        const averageScore = categoryResponses.reduce((acc, val) => acc + val, 0) / categories[category].length;
        return `${category}: ${averageScore.toFixed(2)}`;
      }).join('\n'),
      respuestas_completas: Object.entries(categories).map(([category, questions], categoryIndex) => {
        return questions.map((question, questionIndex) => {
          const response = responses[categoryIndex * questions.length + questionIndex] === 5 ? 'Sí' : 'No';
          return `${question}: ${response}`;
        }).join('\n');
      }).join('\n\n')
    };

    // Convertir el documento PDF a Blob para enviarlo como archivo adjunto

    emailjs.send('service_njtd0us', 'template_l70uzzm', emailParams, 'OyC263ffjG5XLjOYY')
      .then((result) => {
        alert('Correo enviado exitosamente');
      }, (error) => {
        alert('Hubo un error al enviar el correo: ' + error.text);
      });
      sendToGoogleSheets(emailParams);
  };
  const sendToGoogleSheets = () =>{
    const categorias = Object.keys(categories).map((category, index) => {
      const start = index * categories[category].length;
      const end = start + categories[category].length;
      const categoryResponses = responses.slice(start, end);
      const averageScore = categoryResponses.reduce((acc, val) => acc + val, 0) / categories[category].length;
      return averageScore.toFixed(2);
    })
    console.log(categorias)
    const formData = new FormData(document.getElementById('formClientId'));
    formData.append("Engagement",categorias[0]);
    formData.append("Posicionamiento",categorias[1]);
    formData.append("Reputacion",categorias[2]);
    formData.append("Publicidad",categorias[3]);
    formData.append("Tecnologia",categorias[4]);
    console.log(formData)
    fetch("https://script.google.com/macros/s/AKfycbyIehvbZKDR9cxpaxXx6ML4WnsxWK2j0_YukxbHULIIyMWaJRvsgxati300MoJ4zyZ3/exec",{
      method: "POST",
      body: formData
    }
    )
  }

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: 'Evaluación de la Empresa',
        data: Object.values(categories).map((questions, categoryIndex) => {
          const start = categoryIndex * questions.length;
          const end = start + questions.length;
          const categoryResponses = responses.slice(start, end);
          return categoryResponses.reduce((acc, val) => acc + val, 0) / questions.length;
        }),
        backgroundColor: 'rgba(123, 104, 238, 0.3)', // Degradado morado
        borderColor: 'rgba(72, 61, 139, 1)', // Azul intenso
        borderWidth: 2,
        pointBackgroundColor: 'rgba(72, 61, 139, 1)',
      },
    ],
  };

  return (
    <div className="formulario-radar-container">
      <div className="my-3 flex justify-center">
        <img className='w-[200px]' src='logo.webp' alt='logo' />
      </div>
      <h2 className="formulario-title">Evaluación Ejecutiva de la Empresa</h2>
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
        </div>
        {Object.entries(categories).map(([category, questions], categoryIndex) => (
          <div key={categoryIndex} className="category-container">
            <h3 className="category-title">{category}</h3>
            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="question-container">
                <label className="question-label">{question}</label>
                <div className="radio-buttons modern-radio">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name={`question-${categoryIndex}-${questionIndex}`}
                      value="5"
                      onChange={() => handleChange(categoryIndex * questions.length + questionIndex, 5)}
                    />
                    <span className="custom-radio"></span> Sí
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name={`question-${categoryIndex}-${questionIndex}`}
                      value="0"
                      onChange={() => handleChange(categoryIndex * questions.length + questionIndex, 0)}
                    />
                    <span className="custom-radio"></span> No
                  </label>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div className="button-container">
          <button type="button" className="reset-button" onClick={resetForm}>Reiniciar Formulario</button>
          <button type="submit" className="export-button" onClick={()=> exportToPDF()}>Exportar a PDF</button>
          <button type="button" className="export-button" onClick={() => sendEmail()}>Enviar Información</button>
        </div>
      </form>
      <div className="chart-container">
        <Radar ref={chartRef} data={data} options={{
          scales: {
            r: {
              angleLines: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              pointLabels: {
                font: {
                  size: 14,
                  family: 'Helvetica, Arial, sans-serif',
                  weight: 'bold'
                },
                color: '#333'
              },
              ticks: {
                backdropColor: 'rgba(0, 0, 0, 0)',
                font: {
                  size: 12
                },
                color: '#555'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                font: {
                  size: 16
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `Puntuación: ${tooltipItem.raw.toFixed(2)}`;
                }
              }
            }
          }
        }} />
      </div>
      <footer className='flex justify-between m-3 p-2'>
        <div>@2024</div>
        <div>
          <img className='w-[100px]' src='logo.webp' alt='logo' />
          </div>
      </footer>
    </div>
  );
};

export default FormularioRadar;

