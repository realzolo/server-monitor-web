function Progress({ text, state, percent }) {
    return (
        <div className="progress">
            <div style={{ width: `${percent}%` }} className={`progress_bar ${state === "success" ? "progress_bar_success" : state === "warning" ? "progress_bar_warning" : "progress_bar_danger"}`}>
                {text}
            </div>
        </div>
    )
}
export default Progress;