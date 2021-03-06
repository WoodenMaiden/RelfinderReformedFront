export default function InputEntry(props) {
    const rmHandler =  props.rmHandler
    const input = props.input

    return (
        <div className="controls">
            <input type="search" name={input} id={`input${input}`} placeholder="URI or label"/>
            <button className="clickable" type="button" id={`rm${input}`} onClick={rmHandler}>
                <span className="material-icons-round">
                    close
                </span>
            </button>
        </div>
    )
}