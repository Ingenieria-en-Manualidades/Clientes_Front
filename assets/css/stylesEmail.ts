export const useStylesEmail = () => {
    const styleDivHeader = "padding-top: 4%; text-align: center; background-color: white; border: 1px solid black; border-top-left-radius: 10px; border-top-right-radius: 10px;";

    const stylePTittle = "font-family: Arial, Helvetica, sans-serif; color: #007cbb; font-size: 20px;"

    const styleDivBody = "padding: 3%; border: 1px solid black; text-align: center; background-color: #007cbb;font-size: 17px; font-family: Arial, Helvetica, sans-serif; color: white; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;"

    const stylePpregunta = "font-size: 25px; font-weight: bold";

    const styleAlink = "background-color: #c38e28; padding: 8px 25px; border-radius: 10px; cursor: pointer; text-decoration: none; color: white;";

    const arrayStylesEmail = [
        styleDivHeader,
        stylePTittle,
        styleDivBody,
        stylePpregunta,
        styleAlink
    ];

    const arrayURLs = [
        "https://ienmlogistica.ienm.com.co/wp-content/uploads/2019/12/cropped-logo.png",
        "https://cdn-icons-png.flaticon.com/512/5503/5503036.png",
        "http://localhost:3000/actualizarPassword-"
    ];

    return {
        arrayStylesEmail,
        arrayURLs
    };
}