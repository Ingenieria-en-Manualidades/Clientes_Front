import { useRuntimeConfig } from "nuxt/app";

const useObjetivosApi = () => {
    const config = useRuntimeConfig();
    const url = config.public.apiGroot;
    const token = config.public.tokenRemisiones;

    
}

export default useObjetivosApi