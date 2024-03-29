import { useState, useEffect } from 'react';
import { 
    Box,
    Stack, 
    Typography, 
    CircularProgress,
    TextField,
    Button
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { URL } from "../variables";

export default function InputEntry(props) {
    const rmHandler =  props.rmHandler
    const changeHandler = props.changeHandler
    const id = props.id

    const [ timeoutID, setTimeoutID ] = useState(setTimeout(()=> { return true;}, 0))
    const [ selectedSuggestion, setSelectedSuggestion ] = useState(false) //this will prevent from fetching suggestions when selecting one
    const [ suggestions, setSuggestions ] = useState([])
    const [ entry, setEntry ] = useState("")


    // returns the timeout id in order to clear it with setTimeout()
    function getLabelsOnEntry() {

        //TODO pass aborter to function in timeout
        return setTimeout(async () => {
            const sugBox = document.getElementById(`suggestions${id}`)
            setSuggestions([]) // to trigger loading animation
            sugBox.style.display = 'block'

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "node": entry
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            const fetchLabels = await (await fetch(`${URL}/labels`, requestOptions)).json()

            setSuggestions([ ...fetchLabels.labels.map(
                (elt) => { return { s: elt.s.value, label: elt.label?.value }}
            )])
        }, 2000)
    }


/*
     _   _                 _ _
	| | | | __ _ _ __   __| | | ___ _ __ ___
	| |_| |/ _` | '_ \ / _` | |/ _ \ '__/ __|
	|  _  | (_| | | | | (_| | |  __/ |  \__ \
	|_| |_|\__,_|_| |_|\__,_|_|\___|_|  |___/
*/

    function selectSuggestion(sug) {
        const sugBox = document.getElementById(`suggestions${id}`)

        sugBox.style.display = 'none'
        setSuggestions([])
        setSelectedSuggestion(true)
        setEntry(sug.s)
        changeHandler(id, sug.s)
    }

    function click(e) {
        if (
            typeof e.target.className === "string" // if you click on a svg, they have not a "string" type
            && !e.target.className.includes('suggestionItem') 
            ){ 

            document.getElementById(`suggestions${id}`).style.display = 'none'
            setSuggestions([]);
        }
    }

    function entryChanges(event) {
        const text = event.target.value.trim()

        setEntry(text)
        changeHandler(id, text)
    }


/*
     _   _             _ 
    | | | | ___   ___ | | _ ___
    | |_| |/ _ \ / _ \| |/ / __|
    |  _  | (_) | (_) |   <\__ \
    |_| |_|\___/ \___/|_|\_\___/
*/

    useEffect(() => {
        clearTimeout(timeoutID)

        if (entry.trim() === "") {
            document.getElementById(`suggestions${id}`).style.display = 'none'
            setSuggestions([])
        } else {
            //if the value hasn't been filled via from the suggestion list fetch selections,
            if(!selectedSuggestion) setTimeoutID(getLabelsOnEntry())
            else setSelectedSuggestion(false) //else we do nothing to avoid another fetch() and reset the value
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entry, id])

    useEffect(() => {
        document.addEventListener('click', click, true)
        return () => document.removeEventListener('click', click, true);
    })

    props.clearEvent.addEventListener("clear", () => setEntry(""))

    return (
        <Box>
            <Stack direction="row" spacing={1}>
                <TextField
                    variant="filled"
                    onChange={entryChanges}
                    value={entry}
                    placeholder="URI or label"
                    fullWidth
                    style={{
                        flexGrow: 8,
                    }}
                />
                <Button onClick={() => rmHandler(id)} variant="outlined" sx={{flexGrow: 1}}>
                    <CloseIcon />
                </Button>
            </Stack>
            <Box id={`suggestions${id}`} sx={{
                zIndex: 99999,
                backgroundColor: '#ffffff', 
                position: 'absolute',
                display: 'none',
                overflowY: 'scroll',
                maxHeight: '80px',
                minHeight: '10px',
            }}>
                <Stack alignItems={(suggestions.length <= 0)? 'center': 'flex-start' } >
                    {(suggestions.length <= 0)
                    ? <CircularProgress color='secondary'/>
                    : suggestions.map(
                        sug =>  <Typography className='suggestionItem' onClick={() => selectSuggestion(sug)}
                            sx={{
                                cursor: 'pointer',
                                textOverflow: 'ellipsis',
                                width: '100%',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                '&:hover': {
                                    backgroundColor: '#9e9e9e'
                                }
                            }}
                            key={sug.s+sug.label}>
                                {(sug.label)? `${sug.label} - ${sug.s}`: sug.s }
                        </Typography>
                    )}
                </Stack>
            </Box>
        </Box>
    )
}