import { ref } from 'vue';

export const useModulos = () => {
  const modulos = ref([
  // {
  //   icono: "pi pi-home",
  //   nombre: "Inicio",
  //   ruta: "",
  //   visible: true,
  // },
  {
    icono: "pi pi-bell",
    nombre: "Remisiones",
    ruta: "/remisiones",
    visible: true,
  },
  // {
  //   icono: "pi pi-user",
  //   nombre: "Programación",
  //   ruta: "/modulo1",
  //   visible: true,
  // },
  {
    icono: "pi pi-sliders-h",
    nombre: "Improductividades",
    ruta: "/improductividades",
    visible: true,
  },
  {
    icono: "pi pi-bullseye",
    nombre: "Objetivos",
    visible: true,
    submodulos: [
      {
        icono: "pi pi-user",
        nombre: "Diarios",
        ruta: "/objetivos/diarios",
        visible: true,
      },
      {
        icono: "pi pi-user",
        nombre: "Mensuales",
        ruta: "/objetivos",
        visible: true
      }
    ]
  },
  {
    icono: "pi pi-exclamation-triangle",
    nombre: "Accidentes",
    ruta: "/accidentes",
    visible: true,
  }
]);
return { modulos };
};
