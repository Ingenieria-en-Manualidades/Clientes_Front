# Pendientes - Clientes

Pendientes centralizados del submodulo `Clientes`.

## Funcional

1. Revisar reglas finas de sincronizacion desde `public.cliente`.
   - Confirmar si se deben sincronizar clientes inactivos.
   - Confirmar si un registro eliminado en `public.cliente` debe desactivar o eliminar en `clientes` y `surveys.clients`.
   - Confirmar si `hora_extra` debe mapear siempre directo a `overtime` con formato `HH:MM:SS`.

2. Definir si tambien se deben crear clientes en `surveys.clients`.
   - Hoy solo se editan clientes existentes de surveys.
   - Confirmar campos obligatorios y valores por defecto.

3. Separar permisos especificos por accion.
   - `view_clients` ya controla la visibilidad del submodulo.
   - Definir si se requieren permisos adicionales para crear clientes.
   - Definir si se requieren permisos adicionales para editar clientes.
   - Definir si se requieren permisos adicionales para sincronizar clientes.

## Tecnico

1. Tipar respuestas backend sin `any`.
2. Agregar estados diferenciados para sincronizacion real.
3. Revisar si `cliente_endpoint_id` puede cambiar sin afectar objetivos, login y seleccion de clientes.
4. Hecho: agregar pruebas front para composables del submodulo `Clientes`.
5. Hecho: agregar pruebas front para `ModalClientUsers`.
6. Agregar pruebas front para `ModalFormCreateClient`.
7. Agregar pruebas front para `ModalFormUpdateClient`.
8. Agregar pruebas front para `ModalFormUpdateSurveyClient`.
9. Agregar pruebas de pagina para filtros, cambio de vista y sincronizacion en `pages/administration/clients.vue`.
10. Revisar si conviene reemplazar el campo libre de `overtime` por un selector de hora.
