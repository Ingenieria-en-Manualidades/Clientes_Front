import { navigateTo } from "nuxt/app";

export const useDriver = async () => {

  const { driver } = await import('driver.js');
  
  // Create the step-by-step tour of pending referrals.
  const getDriver = async () => {
    if (process.server) return null;
    const stepByStep = driver({
      showProgress: true,
      prevBtnText: 'Anterior',
      nextBtnText: 'Siguiente',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
      steps: [
        { popover: { title: 'Bienvenido al módulo de remisiones.', description: 'Aquí podras ver las remisiones pendientes para que puedas gestionar y ver que remisiones has aprobado y rechazado.' } },
        { element: '#tabPanel', popover: { title: 'Pestañas de estados.', description: 'Las remisiones se agrupan dependiendo de su estado, las pestañas te sirven para navegar entre las diferentes remisiones.' } },
        { element: '#filterDate', popover: { title: 'Filtrar por fechas.', description: 'Seleccionando este campo se desplegara un calendario con el cual podras elegir una o dos fechas.' } },
        { element: '#buttonFilterDate', popover: { title: 'Botón para filtrar.', description: 'Después de definir las fechas presionamos el botón para filtrar.' } },
        { element: '#bodyTableReferrals tr:nth-child(1)', popover: { title: 'Remisión.', description: 'En cada fila podras ver los detalles de cada remisión.', } },
        { element: '#bodyTableReferrals button:nth-child(1)', 
          popover: { title: 'Detalles de la remisión.', description: 'Por medio de este botón podra ver los detalles de la remisión.', 
            onNextClick: async () => {
              const btnPreviewReferrals = document.querySelector('#bodyTableReferrals button:nth-child(1)') as HTMLButtonElement
              btnPreviewReferrals.click();
              await new Promise(resolve => setTimeout(resolve, 100));
              stepByStep.moveNext()
            }
          } 
        },
        { element: '#modalPreviewRemision', 
          popover: { title: 'Detalles.', description: 'Después de presionarlo va aparecer esta modal el cual te mostrara la información de la remisión.', 
            onNextClick: async () => {
              const btnPreviewReferrals = document.querySelector('#bodyTableReferrals button:nth-child(1)') as HTMLButtonElement
              btnPreviewReferrals.click();
              stepByStep.moveNext()
            },
            onPrevClick: () => {
              const btnClosePreviewReferrals = document.querySelector('#bodyTableReferrals button:nth-child(1)') as HTMLButtonElement
              btnClosePreviewReferrals.click();
              stepByStep.movePrevious()
            }
          } 
        },
        { element: '#bodyTableReferrals button:nth-child(3)', 
          popover: { title: 'Gestionamiento.', description: 'Por medio de este botón podras aprobar o rechazar la remisión.', 
            onNextClick: async () => {
              const btnManageReferrals = document.querySelector('#bodyTableReferrals button:nth-child(3)') as HTMLButtonElement
              btnManageReferrals.click();
              await new Promise(resolve => setTimeout(resolve, 100));
              stepByStep.moveNext()
            },
            onPrevClick: async () => {
              const btnPreviewReferrals = document.querySelector('#bodyTableReferrals button:nth-child(1)') as HTMLButtonElement
              btnPreviewReferrals.click();
              await new Promise(resolve => setTimeout(resolve, 100));
              stepByStep.movePrevious()
            }
          }
        },
        { element: '#modalReferrals select', 
          popover: { title: 'Aprobar o rechazar.', description: 'Después presionar se desplegara esta modal con esta opción para aprobar o rechazar la remisión.', 
            onPrevClick: () => {
              const btnManageReferrals = document.querySelector('#bodyTableReferrals button:nth-child(3)') as HTMLButtonElement
              btnManageReferrals.click();
              stepByStep.movePrevious()
            }
          }
        },
        { element: '#modalReferrals textarea', popover: { title: 'Comentario.', description: 'Agregaremos un comentario respecto a la decisión (en caso de ser rechazada es obligatorio).' } },
        { element: '#modalReferrals button:nth-child(2)', 
          popover: { title: 'Guardar.', description: 'Después de definir su gestión, presionaremos este botón para guardar y dependiedo de lo que hayamos elegido la remisión se enviara hacia alguna de las otras dos pestañas.', 
            onNextClick: async () => {
              const btnCancelManageReferrals = document.querySelector('#modalReferrals button:nth-child(1)') as HTMLButtonElement
              btnCancelManageReferrals.click();
              stepByStep.moveNext();
              await navigateTo({ path: '/remisiones/Aprobadas', hash: '#stepByStep' });
            }
          } 
        },
      ]
    });
    return stepByStep;
  };

  // Create the step-by-step tour of approved referrals.
  const getDriverApprovedReferrals = async () => {
    if (process.server) return null;
    const stepByStep = driver({
      showProgress: true,
      prevBtnText: 'Anterior',
      nextBtnText: 'Siguiente',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
      steps: [
        { element: '#tabPanel li:nth-child(2)', popover: { title: 'Pestaña Aprobadas.', description: 'Todas las remisiones que apruebes se guardaran en esta pestaña.' } },
        { element: '#bodyTableReferrals button:nth-child(1)', 
          popover: { title: 'Ver detalles.', description: 'Por medio de este botón podras ver los detalles de la remisión.', 
            onNextClick: async () => {
              const btnPreviewReferrals = document.querySelector('#bodyTableReferrals button:nth-child(1)') as HTMLButtonElement
              btnPreviewReferrals.click();
              await new Promise(resolve => setTimeout(resolve, 100));
              stepByStep.moveNext()
            }
          } 
        },
        { element: '#modalPreviewRemision button:nth-child(2)', 
          popover: { title: 'Generar PDF.', description: 'También podras imprimir generar el pdf de la remisión.', side: 'left', align:"center", 
            onPrevClick: () => {
              const btnClosePreviewReferrals = document.querySelector('#bodyTableReferrals button:nth-child(1)') as HTMLButtonElement
              btnClosePreviewReferrals.click();
              stepByStep.movePrevious();
            },
            onNextClick: async () => {
              const btnPreviewReferrals = document.querySelector('#bodyTableReferrals button:nth-child(1)') as HTMLButtonElement
              btnPreviewReferrals.click();
              stepByStep.moveNext();
              await navigateTo({ path: '/remisiones/rechazadas', hash: '#stepByStep' });
            }
          } 
        },
      ]
    });

    return stepByStep;
  }

  // Create the step-by-step tour of rejected referrals.
  const getDriverRejectedReferrals = async () => {
    if (process.server) return null;
    const stepByStep = driver({
      showProgress: true,
      prevBtnText: 'Anterior',
      nextBtnText: 'Siguiente',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
      steps: [
        { element: '#tabPanel li:nth-child(3)', popover: { title: 'Pestaña Rechazadas.', description: 'Todas las remisiones que rechazas se guardaran en esta pestaña.' } },
        { element: '#bodyTableReferrals button:nth-child(1)', 
          popover: { title: 'Motivo del rechazo.', description: 'Cada remisión rechazada tendra este botón para mirar el motivo del rechazo.', 
            onNextClick: async () => {
              const btnRejectedReferrals = document.querySelector('#bodyTableReferrals button:nth-child(1)') as HTMLButtonElement
              btnRejectedReferrals.click();
              await new Promise(resolve => setTimeout(resolve, 100));
              stepByStep.moveNext()
            }
          } 
        },
        { element: '#motiveRejectedReferrals', popover: { title: 'Motivo.', description: 'Aquí podras ver el motivo por el cual fue rechazada la remisión.', 
            onPrevClick: () => {
              const btnCloseRejectedReferrals = document.querySelector('#bodyTableReferrals button:nth-child(1)') as HTMLButtonElement
              btnCloseRejectedReferrals.click();
              stepByStep.movePrevious();
            },
            onNextClick: async () => {
              const btnRejectedReferrals = document.querySelector('#bodyTableReferrals button:nth-child(1)') as HTMLButtonElement
              btnRejectedReferrals.click();
              stepByStep.moveNext();
            }
          } 
        },
        { popover: { title: '¡Felicidades!', description: 'Ya terminaste el manual para el módulo de remisiones.' } },
      ]
    });
    return stepByStep;
  }

  return {
    getDriver,
    getDriverApprovedReferrals,
    getDriverRejectedReferrals
  };
}
