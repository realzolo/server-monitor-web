import { useEffect, useState } from "react";

function Header({ config }) {
    const [title, setTitle] = useState("");
    useEffect(() => {
        if (!config.SITE_TITLE) return;
        setTitle(config.SITE_TITLE);
        document.title = config.SITE_TITLE;
    }, [config])
    return (
        <div className="header_wrapper">
            <h2>{title}</h2>
        </div>
    )
}
export default Header;