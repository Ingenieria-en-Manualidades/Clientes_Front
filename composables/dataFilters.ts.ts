import { ref } from "vue";
import type { HeaderWithFilters } from "../interfaces/filters";

export const dataForTablesFilters = () => {

    const headers = ref<HeaderWithFilters[]>([
        {
            label: "ID",
            options: null,
        },
        {
            label: "Product",
            options: null,
        },
        {
            label: "Price",
            options: null,
        },
        {
            label: "Category",
            options: {
                atribute: "category",
                labels: ["Dairy","Soda","Study"],
            },
        },
        {
            label: "Client",
            options: {
                atribute: "client",
                labels: ["BIMBO","POSTOBON","APPLE"],
            },
        },
        {
            label: "Country",
            options: {
                atribute: "country",
                labels: ["Colombia","United States"],
            },
        },
    ]);

    const atributes = ref(["id","product","price","category","client","country"]);

    const data = ref([
        {
            id: 1000,
            product: "Milk",
            price: 2000,
            category: "Dairy",
            client: "BIMBO",
            country: "Colombia",
        },
        {
            id: 1001,
            product: "Cheese",
            price: 3000,
            category: "Dairy",
            client: "POSTOBON",
            country: "Colombia",
        },
        {
            id: 1002,
            product: "Yogurt",
            price: 1500,
            category: "Dairy",
            client: "APPLE",
            country: "Colombia",
        },
        {
            id: 1003,
            product: "Coca Cola",
            price: 3000,
            category: "Soda",
            client: "BIMBO",
            country: "Colombia",
        },
        {
            id: 1004,
            product: "Pepsi",
            price: 2500,
            category: "Soda",
            client: "POSTOBON",
            country: "United States",
        },
        {
            id: 1005,
            product: "Dr. Peper",
            price: 2000,
            category: "Soda",
            client: "APPLE",
            country: "United States",
        },
        {
            id: 1006,
            product: "Pencil",
            price: 1000,
            category: "Study",
            client: "POSTOBON",
            country: "United States",
        },
        {
            id: 1007,
            product: "Book",
            price: 2000,
            category: "Study",
            client: "BIMBO",
            country: "United States",
        },
    ]);

    return {
        headers,
        atributes,
        data,
    };
}