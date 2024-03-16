import React, { useEffect, useState } from "react"
import { Container, Row, Col, Pagination } from "react-bootstrap";

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [index, setIndex] = useState(0);

    const loadMessages = () => {
        fetch(`https://cs571.org/api/f23/hw6/messages?chatroom=${props.name}&page=1`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages);
        })
    };


    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(loadMessages, [props]);

    return <>
        <h1>{props.name} Chatroom</h1>
        {
            /* TODO: Allow an authenticated user to create a post. */
        }
        <hr />
        {
            messages.length > 0 ?
                <>
                    {
                        <>

                            <Container>
                                <Row>
                                    {
                                        messages.slice(index * 6, index * 6 + 6).map((message) => {
                                            return <Col key={message.id} xs={12} sm={6} md={4} lg={4} xl={4}>
                                                <div style={{
                                                    borderStyle: "solid",
                                                    borderColor: "#E3E3E3",
                                                    borderRadius: "7px",
                                                    borderWidth: "1px",
                                                    margin: "6px",
                                                    padding: "8px",
                                                    overflow: "hidden",
                                                }}>
                                                    <h3>
                                                        {message.title}
                                                    </h3>
                                                    <div style={{
                                                        fontSize: "12px",
                                                        color: "grey",
                                                    }}>
                                                        Posted on {new Date(message.created).toLocaleString()}
                                                    </div>
                                                    <div style={{
                                                        marginTop: "12px",
                                                    }}>
                                                        <div>
                                                            <i>{message.poster}</i>
                                                        </div>
                                                        <div>
                                                            {message.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        })
                                    }
                                </Row>
                            </Container>
                            <Pagination>
                                {
                                    Array.from(Array(Math.ceil(messages.length / 6)).keys()).map((number) => {
                                        return <Pagination.Item key={number} active={number === index} onClick={() => setIndex(number)}>
                                            {number + 1}
                                        </Pagination.Item>
                                    })
                                }
                            </Pagination>
                        </>
                    }
                </>
                :
                <>
                    <p>There are no messages on this page yet!</p>
                </>
        }
    </>
}
