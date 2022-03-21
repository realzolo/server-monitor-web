export function getLanguage() {
    let lang = localStorage.getItem("i18nextLng");
    return (lang === "zh-CN" || lang === "en") ? lang : "en";
}