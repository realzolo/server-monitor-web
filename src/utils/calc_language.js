export function getLanguage() {
    let lang = (navigator.systemLanguage ? navigator.systemLanguage : navigator.language);;
    return (lang === 'zh-CN' || lang === 'en') ? lang : 'en';
}