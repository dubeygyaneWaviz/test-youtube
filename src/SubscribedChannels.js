import React from "react"



export function SubscribedChannel(props) {
    console.log("Props ", props)
    return (
        <div className="box">
            <h3>{props.snippet.title}</h3>
            <p>{props.snippet.description}</p>
        </div>
    )
}