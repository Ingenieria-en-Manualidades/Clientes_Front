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
    permission: 'view'
  },
  {
    icono: "pi pi-bell",
    nombre: "Remisiones",
    ruta: "/remisiones",
    visible: false,
    permission: 'view_remisiones'
  },
  // {
  //   icono: "pi pi-user",
  //   nombre: "Programación",
  //   ruta: "/modulo1",
  //   visible: true,
  // permission: 'view_programacion'
  // },
  {
    icono: "pi pi-sliders-h",
    nombre: "Improductividades",
    ruta: "/improductividades",
    visible: false,
    permission: 'view_improductividades'
  },
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
    submodulos: [
      {
        icono: "pi pi-bullseye",
        nombre: "Metas",
        ruta: "/objetivos",
        visible: false,
        permission: 'view_objetivos_mensuales'
      },
      {
        icono: "pi pi-check-square",
        nombre: "Cumplimiento Mensual",
        ruta: "/objetivos/calidad",
        visible: false,
        permission: 'view_objetivos_calidad'
      },
      {
        icono: "pi pi-list-check",
        nombre: "Cumplimiento Diarios",
        ruta: "/objetivos/diarios",
        visible: false,
        permission: 'view_objetivos_diarios'
      }
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
