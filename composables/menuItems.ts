import { ref } from 'vue';
import { useCookie, useRuntimeConfig } from "nuxt/app";


export const useModulos = () => {

  const userPermissions = useCookie("permissions");

  const modulos = ref([
  {
    icono: "pi pi-home",
    nombre: "Inicio",
    ruta: "/",
    visible: true,
    permission: 'view',
    stepByStep: false,
  },
  {
    nombre:"Encuesta",
    icono: "pi pi-file",
    ruta:"/encuesta/",
    visible:"false",
    permission:"view_encuesta",
    stepByStep: false,
  },
  {
    icono: "pi pi-bell",
    nombre: "Remisiones",
    ruta: "/remisiones",
    visible: false,
    permission: 'view_remisiones',
    stepByStep: true,
  },
  // {
  //   icono: "pi pi-user",
  //   nombre: "Programación",
  //   ruta: "/modulo1",
  //   visible: true,
  // permission: 'view_programacion'
  // },
  // {
  //   icono: "pi pi-sliders-h",
  //   nombre: "Improductividades",
  //   ruta: "/improductividades",
  //   visible: false,
  //   permission: 'view_improductividades'
  // },
  // {
  //   icono: "pi pi-sliders-h",
  //   nombre: "Improductividades 2",
  //   ruta: "/improductividades_2",
  //   visible: false,
  //   permission: 'view_improductividades'
  // },
  {
    icono: "pi pi-table",
    nombre: "Tablero Sae",
    visible: false,
    permission: 'view_objetivos',
    stepByStep: true,
    deploy: false,
    submodulos: [
      {
        icono: "pi pi-bullseye",
        nombre: "Metas",
        ruta: "/objetivos",
        visible: false,
        permission: 'view_objetivos_mensuales',
        stepByStep: true,
      },
      {
        icono: "pi pi-check-square",
        nombre: "Cumplimiento Mensual",
        ruta: "/objetivos/calidad",
        visible: false,
        permission: 'view_objetivos_calidad',
        stepByStep: true,
      },
      {
        icono: "pi pi-list-check",
        nombre: "Cumplimiento Diarios",
        ruta: "/objetivos/diarios",
        visible: false,
        permission: 'view_objetivos_diarios',
        stepByStep: true,
      },
      {
        icono: "pi pi-th-large",
        nombre: "Unidades programadas",
        ruta: "/objetivos/unidades",
        visible: false,
        permission: "view_objetivos_unidades",
        stepByStep: true,
      }
    ]
  },
  {
    icono: "pi pi-cog",
    nombre: "Administración",
    visible: false,
    permission: 'view_administration',
    stepByStep: false,
    deploy: false,
    submodulos: [
      {
        icono: "pi pi-user",
        nombre: "Usuarios",
        ruta: "/administration/users",
        visible: false,
        permission: 'view_users',
        stepByStep: false,
      },
    ]
  },
  // {
  //   icono: "pi pi-exclamation-triangle",
  //   nombre: "Accidentes",
  //   ruta: "/accidentes",
  //   visible: false,
  //   permission: 'view_accidentes'
  // }
]);
  const verificarPermisos = () => {
    modulos.value.forEach(modulo => {

      if(userPermissions.value?.includes(modulo.permission)){
        modulo.visible = true;
      }else{
        modulo.visible = false;
      }

      if(modulo.submodulos){
        modulo.submodulos.forEach(submodulo => {
          if(userPermissions.value?.includes(submodulo.permission)){
            submodulo.visible = true;
          }else{
            submodulo.visible = false;
          }
        })
      }
    });
  }

verificarPermisos();

return { modulos,
  verificarPermisos };
};
