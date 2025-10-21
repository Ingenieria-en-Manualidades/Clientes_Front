import { navigateTo } from "nuxt/app";

export const useDriver = async () => {
  const { driver } = await import('driver.js');

  // Create the step-by-step tour of goals module.
  const getDriverGoals = async () => {
    if (process.server) return null;
    const stepByStep = driver({
      showProgress: true,
      prevBtnText: 'Anterior',
      nextBtnText: 'Siguiente',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
      steps: [
        { popover: { title: 'Bienvenido al módulo de metas.', description: 'Aquí podras ingresar los valores para cada mes.' } },
        { element: '#calendarFilterGoals', popover: { title: 'Seleccionar mes.', description: 'Por medio de este campo podrás seleccionar el mes al cual quieres ingresar las metas.' } },
        { element: '#fieldsetGoals', popover: { title: 'Porcentajes mensuales.', description: 'Por medio de este formulario encontraras todos los porcentajes a llenar del mes (todos los campos son obligatorios).' } },
        { element: '#fieldsetGoals button', popover: { title: 'Guardar.', description: 'Después de llenar todos los campos presionar guardar para subirlo.' } },
        { popover: { title: '¡Felicidades!', description: 'Ya has terminado el paso a paso del módulo de metas.', }},
      ]
    });
    return stepByStep;
  };

  // Create the step-by-step tour of monthly compliance module.
  const getDriverMonthlyCompliance = async () => {
    if (process.server) return null;
    const stepByStep = driver({
      showProgress: true,
      prevBtnText: 'Anterior',
      nextBtnText: 'Siguiente',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
      steps: [
        { popover: { title: 'Bienvenido al módulo de cumplimiento mensual.', description: 'Aquí podras ingresar los valores de calidad mensuales y exportar las evidencias de cada mes.' } },
        { element: '#formChecklist', popover: { title: 'Formulario para la calidad de Checklist.', description: 'Por medio de este formulario podras llenar el porcentanje y evidencia del checklist.' } },
        { element: '#formChecklist input:nth-child(1)', popover: { title: 'Seleccionar mes.', description: 'Por medio de este campo podrás seleccionar el mes al cual quieres ingresar el checklist.' } },
        { element: '#formChecklist fieldset input:nth-child(5)', popover: { title: 'Calificación.', description: 'Aquí podras colocar el porcentaje de califación (campo obligatorio).' } },
        { element: '#divFileCheck', popover: { title: 'Evidencia.', description: 'Aquí podras subir el archivo PDF que contiene la evidencia (solo admite archivos en formato PDF).' } },
        { element: '#btnSaveChecklist', popover: { title: 'Guardar.', description: 'Después de llenar los campos podras guardar el porcentaje junto a la evidencia.' } },
        { element: 'form:nth-child(2)', popover: { title: 'Formulario de Inspección sol.', description: 'El formulario de calidad de Inspección sol funciona de la misma manera que el de checklist.' } },
        { element: '#moduleCalidad div:nth-child(2)', popover: { title: 'Independencia de formularios.', description: 'Los dos formularios funcionan de manera independiente lo que significa que .' } }, 
        { element: '#moduleCalidad div:nth-child(1)', popover: { title: 'Tabla de evidencias.', description: 'Todas las evidencias que subas se guardaran en esta tabla.' } }, 
        { element: '#tableBodyDynamic button:nth-child(1)', popover: { title: 'Exportar.', description: 'Por medio de este botón podras descargar los archivos pdfs subidos con anterioridad.' } }, 
        { element: '#btnModalUpdateFile', 
          popover: { title: 'Actualizar.', description: 'Por medio de este botón podras actualizar el archivo pdf por otro.', 
            onNextClick: async () => {
              const btnUpdateCalidad = document.querySelector('#btnModalUpdateFile') as HTMLButtonElement
              btnUpdateCalidad.click();
              await new Promise(resolve => setTimeout(resolve, 100));
              stepByStep.moveNext()
            }
          } 
        },
        { element: '#divUpdateFile', 
          popover: { title: 'Elegir archivo', description: 'Este botón te dara la opción de elegir del archivo a reemplazar (ten en cuenta que el archivo anterior se borrara).', 
            onPrevClick: () => {
              const btnCloseUpdateFile = document.querySelector('#btnModalUpdateFile') as HTMLButtonElement
              btnCloseUpdateFile.click();
              stepByStep.movePrevious()
            }
          } 
        },
        { element: '#btnUpdateFileModal', 
          popover: { title: 'Actualizar.', description: 'Después de subir el archivo se actualizara el archivo.', 
            onNextClick: () => {
              const btnCloseUpdateFile = document.querySelector('#btnModalUpdateFile') as HTMLButtonElement
              btnCloseUpdateFile.click();
              stepByStep.moveNext()
            }
          } 
        },
        { popover: { title: '¡Felicidades!', description: 'Ya has terminado el paso a paso del módulo de cumplimiento mensual.', 
            onPrevClick: async () => {
              const btnCloseUpdateFile = document.querySelector('#btnModalUpdateFile') as HTMLButtonElement
              btnCloseUpdateFile.click();
              await new Promise(resolve => setTimeout(resolve, 100));
              stepByStep.movePrevious()
            }
          }
        },
      ]
    });
    return stepByStep;
  };

  // Create the step-by-step tour of daily compliance (9 steps).
  const getDriverDiarios = async () => {
    if (process.server) return null;
    const stepByStep = driver({
      showProgress: true,
      prevBtnText: 'Anterior',
      nextBtnText: 'Siguiente',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
      steps: [
        { popover: { title: 'Bienvenido al módulo de producción diaria.', description: 'Aquí podrás ingresar y modificar la producción diaria y sus indicadores.' } },
        // 2 - fechaPlan
        { element: '#pageDiarios #formProduccion #fechaPlan', popover: {title: "Elegir fecha.", 
          description: "En este input podras elegir el día que deseas programar la producción, ten en cuenta que no podras ingresar nada en caso de no haber una meta para el mes (ingresar dentro del módulo de metas y solo acepta tres días anteriores y el actual)"} },
        // 3 - prodPlan + botón (señalizo el grupo que contiene ambos)
        { element: '#pageDiarios #formProduccion #grupoPlan', popover: {title: "Ingresar cantidad del día.", description: "Podras escribir la cantidad de producción programada del día (solo números enteros), después podrás guardar presionando el botón."} },
        // 4 - fechaMod
        { element: '#pageDiarios #formProduccion #fechaMod', popover: {title: "Elegir fecha de la cantidad modificada.", 
          description: "En caso de que una cantidad haya sido modificada un día aquí pordras elegirlo (para ingresar la cantidad tiene que haber ya un ingreso de una producción planificada y solo acepta tres días anteriores y el siguiente)"} },
        // 5 - prodMod + botón (señalizo el grupo)
        { element: '#pageDiarios #formProduccion #grupoMod', popover: {title: "Cantidad modificada.", description: "Podrás ingresar la nueva cantidad del día (al igual que la planificada solo acepta enteros)"} },
        // 6 - indicador fecha
        { element: '#pageDiarios #formIndicadores #fechaIndicador', popover: {title: "Elegir fecha para indicadores.", description: "Aquí podras elegir el día para ingresar los demás indicadores diarios (solo se pueden ingresar el día actula y dos anteriores)"} },
        // 7 - todos los inputs text del componente Indicadores
        { element: '#divInputsIndicadores', popover: {title: "Indicadores.", description: "En estos campos podras llenar los porcentajes diarios de cada indicador."} },
        // 8 - botón submit de indicadores
        { element: '#pageDiarios #formIndicadores #btnSubmitIndicadores', popover: {title: "Guardar indicadores.", description: "Después de ingresar todos los campos de producción podras guardar los porcentajes."} },
        // 9 - Felicitaciones
        { popover: { title: '¡Felicidades!', description: 'Has terminado el paso a paso del módulo de producción diaria.' } },
      ]
    });
    return stepByStep;
  };

  // Create the step-by-step tour form for scheduled units (10 steps).
  const getDriverUnidadesIndex = async (showFormMonthly: boolean) => {
    if (process.server) return null;
    const stepByStep = driver({
      showProgress: true,
      prevBtnText: 'Anterior',
      nextBtnText: 'Siguiente',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
      steps: [
        { popover: { title: 'Bienvenido al módulo de unidades', description: 'Aquí podrás gestionar la capacidad mensual y las unidades programadas diarias.' } },
        { element: '#tabPanel', popover: { title: 'Pestañas', description: 'Navega entre las pestañas para ingresar y ver registros.' } },
        { element: '#tabPanel a[data-tab-label="Ingresar"]', 
          popover: { title: 'Pestaña Ingresar', description: 'Selecciona la pestaña Ingresar para añadir registros mensuales o diarios.',
            onNextClick: () => {
              showFormMonthly ? stepByStep.moveNext() : stepByStep.moveTo(7);
            }
          } 
        },
        { element: '#formUnitsMonthly', popover: { title: 'Formulario Mensual', description: 'Formulario para ingresar la capacidad mensual por fecha y area.' } },
        { element: '#formUnitsMonthly #dailyCalendar', popover: { title: 'Seleccionar fecha (mensual)', description: 'Elige el mes al cual quieres ingresar capacidad mensual.' } },
        { element: '#formUnitsMonthly #dailyDropDown', popover: { title: 'Seleccionar área (mensual)', description: 'Selecciona el área para la capacidad mensual.' } },
        { element: '#formUnitsMonthly #groupInputNumber', popover: { title: 'Unidades y guardar (mensual)', description: 'Introduce el valor y guarda la capacidad mensual.' } },
        { element: '#formUnitsDaily', 
          popover: { title: 'Formulario Diario', description: 'Formulario para ingresar las unidades programadas diarias relacionadas con la mensual.',
            onPrevClick: () => {
              showFormMonthly ? stepByStep.movePrevious() : stepByStep.moveTo(2);
            }
          } 
        },
        { element: '#formUnitsDaily #dailyCalendar', popover: { title: 'Seleccionar fecha (diaria)', description: 'Elige la fecha para la programación diaria (en caso de no haber un ingreso del mes de la fecha seleccionada no podras ingresar las unidades).' } },
        { element: '#formUnitsDaily #groupUnitsDaily', 
          popover: { title: 'Área, unidades y guardar (diario)', description: 'Selecciona área, ingresa las unidades y guarda. Si ya existe un registro con la misma fecha y area no se permitirá insertar.', 
            onNextClick: async () => {
              stepByStep.moveNext();
              await navigateTo({ path: '/objetivos/unidadesTable', hash: '#stepByStep' });
            }
          } 
        },
      ]
    });
    return stepByStep;
  };

  // Create the step-by-step tour of unidades table (11 steps).
  const getDriverUnidadesTable = async (showUpdateMonthly: boolean) => {
    if (process.server) return null;
    const stepByStep = driver({
      showProgress: true,
      prevBtnText: 'Anterior',
      nextBtnText: 'Siguiente',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
      steps: [
        // 1 - select the "Consultar" tab
        { element: '#pageUnidadesTable #tabPanel a[data-tab-label="Consultar"]', popover: { title: 'Consultar unidades', description: 'Selecciona la pestaña Consultar para ver metas y unidades diarias.' } },
        // 2 - DinamicosInputCalendar (date filter)
        { element: '#pageUnidadesTable #dailyCalendar', popover: { title: 'Filtrar por fecha', description: 'Elige un mes o rango para filtrar las metas por fecha.' } },
        // 3 - DinamicosChecklistFilter (filter by area)
        { element: '#pageUnidadesTable #dinamicChecklistFilter', popover: { title: 'Filtrar por área', description: 'Filtra las filas por área usando este filtro.' } },
        // 4 - first row of the table
        { element: '#pageUnidadesTable table tbody tr:nth-child(1)', popover: { title: 'Fila de datos', description: 'Aquí verás la meta mensual segun la capacidad y sus acciones asociadas.' } },
        // 5 - button ObjetivosModalUnitsDaily (open modal)
        { element: '#pageUnidadesTable #btnOpenUnitsDaily', 
          popover: { title: 'Ver unidades diarias', description: 'Abre el listado de unidades diarias relacionadas a esta meta.',
            onNextClick: async () => {
              const btn = stepByStep.getActiveElement() as HTMLButtonElement;
              if (btn) btn.click();
              await new Promise(res => setTimeout(res, 300));
              stepByStep.moveNext();
            }
          },
        },
        // 6 - modal ObjetivosModalUnitsDaily
        { element: '#modalUnitsDaily', 
          popover: { title: 'Unidades diarias', description: 'Lista de unidades diarias relacionadas a la meta seleccionada.',
            onPrevClick: () => {
              const btnCloseUnitsDaily = document.querySelector('#pageUnidadesTable #btnOpenUnitsDaily') as HTMLButtonElement;
              btnCloseUnitsDaily.click();
              stepByStep.movePrevious();
            }
          } 
        },
        // 7 - button ObjetivosModalUpdateUnitsDaily (open modal update diaria)
        { element: '#btnOpenUpdateUnitsDaily',
          popover: { title: 'Actualizar unidad diaria', description: 'Abre la modal para actualizar una unidad diaria.', 
            onNextClick: async () => {
              const btn = document.querySelector('#modalUnitsDaily #btnOpenUpdateUnitsDaily') as HTMLButtonElement;
              if (btn) btn.click();
              await new Promise(res => setTimeout(res, 300));
              stepByStep.moveNext();
            }
          },
        },
        // 8 - input number + update from the modal update diaria (click and close both modals)
        { element: '#modalUpdateUnitsDailyGroup',
          popover: { title: 'Actualizar unidades', description: 'Introduce el nuevo valor y guarda para actualizar la unidad diaria.',
            onNextClick: async () => {
              const btnCloseUpdateUnitsDaily = document.querySelector('#modalUnitsDaily #btnOpenUpdateUnitsDaily') as HTMLButtonElement;
              btnCloseUpdateUnitsDaily.click();
              // Attempt to close any open dialogs (parent modal)
              const btnCloseUnitsDaily = document.querySelector('#pageUnidadesTable #btnOpenUnitsDaily') as HTMLButtonElement;
              console.log("showUpdateMonthly:", showUpdateMonthly);
              
              btnCloseUnitsDaily.click();
              showUpdateMonthly ? stepByStep.moveNext() : stepByStep.moveTo(10);
            },
            onPrevClick: () => {
              const btnCloseUpdateUnitsDaily = document.querySelector('#modalUnitsDaily #btnOpenUpdateUnitsDaily') as HTMLButtonElement;
              btnCloseUpdateUnitsDaily.click();
              stepByStep.movePrevious();
            }
          },
        },
        // 9 - button ObjetivosModalUpdateUnits (open modal update mensual)
        { element: '#pageUnidadesTable #btnOpenUpdateUnits',
          popover: { title: 'Actualizar meta mensual', description: 'Abre la modal para actualizar la meta mensual, ten en cuenta que a la hora de actualizar la meta estaras creando una nueva, esto con la intención de guardar la trazavilidad.',
            onNextClick: async () => {
              const btn = document.querySelector('#pageUnidadesTable #btnOpenUpdateUnits') as HTMLButtonElement;
              if (btn) btn.click();
              await new Promise(res => setTimeout(res, 100));
              stepByStep.moveNext();
            },
            onPrevClick: async () => {
              const btnOpenUnitsDaily = document.querySelector('#pageUnidadesTable #btnOpenUnitsDaily') as HTMLButtonElement;
              btnOpenUnitsDaily.click();
              await new Promise(res => setTimeout(res, 1000));
              const btnCloseUpdateUnitsDaily = document.querySelector('#modalUnitsDaily #btnOpenUpdateUnitsDaily') as HTMLButtonElement;
              btnCloseUpdateUnitsDaily.click();
              await new Promise(res => setTimeout(res, 100));
              stepByStep.movePrevious();
            }
          },
        },
        // 10 - div groupUpdateUnits and close modal via update button
        { element: '#groupUpdateUnits',
          popover: { title: 'Actualizar meta', description: 'Introduce el nuevo valor, el motivo de la actualización y guarda para actualizar la meta mensual.',
            onNextClick: async () => {
              const btnCloseUpdateUnits = document.querySelector('#pageUnidadesTable #btnOpenUpdateUnits') as HTMLButtonElement;
              btnCloseUpdateUnits.click();
              stepByStep.moveNext();
            },
            onPrevClick: () => {
              const btnCloseUpdateUnits = document.querySelector('#pageUnidadesTable #btnOpenUpdateUnits') as HTMLButtonElement;
              btnCloseUpdateUnits.click();
              stepByStep.movePrevious();
            }
          },
        },
        // 11 - congratulations
        { popover: { title: '¡Felicidades!', description: 'Has terminado el recorrido del módulo de unidades.' ,
            onPrevClick: async () => {
              if (showUpdateMonthly) {
                const btnOpenUpdateUnits = document.querySelector('#pageUnidadesTable #btnOpenUpdateUnits') as HTMLButtonElement;
                btnOpenUpdateUnits.click();
                await new Promise(res => setTimeout(res, 100));
                stepByStep.movePrevious();
              } else {
                const btnOpenUnitsDaily = document.querySelector('#pageUnidadesTable #btnOpenUnitsDaily') as HTMLButtonElement;
                btnOpenUnitsDaily.click();
                await new Promise(res => setTimeout(res, 1000));
                const btnCloseUpdateUnitsDaily = document.querySelector('#modalUnitsDaily #btnOpenUpdateUnitsDaily') as HTMLButtonElement;
                btnCloseUpdateUnitsDaily.click();
                await new Promise(res => setTimeout(res, 100));
                stepByStep.moveTo(7);
              }
            }
          } 
        }
      ]
    });
    return stepByStep;
  };

  return {
    getDriverGoals,
    getDriverMonthlyCompliance,
    getDriverDiarios,
    getDriverUnidadesIndex,
    getDriverUnidadesTable
  }
}
