import React, { useEffect, useRef, useState, useContext } from "react"
import { Row, Col, Pagination, Form, FormGroup, FormLabel, FormControl, Button } from "react-bootstrap";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerChatroom(props) {
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

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

    const postTitleInput = useRef();
    const postContentInput = useRef();
    const [creating, setCreating] = useState(false);

    const login = loginStatus !== undefined && loginStatus !== null;

    function createPost() {
        const postTitle = postTitleInput.current.value;
        const postContent = postContentInput.current.value;
        if (postTitle.length === 0 && postContent.length === 0) {
            alert("You must provide both a title and content!");
            return;
        }
        setCreating(true);
        fetch(`https://cs571.org/api/f23/hw6/messages?chatroom=${props.name}`, {
            method: 'POST',
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "title": postTitle,
                "content": postContent,
            }),
            credentials: "include"
        }).then(async res => {
            const json = await res.json();
            if (res.status === 200) {
                return json;
            } else {
                throw new Error(json.msg);
            }
        }).then(json => {
            alert(json.msg);
            loadMessages();
        }).catch(err => {
            alert(err.message);
        }).finally(() => {
            setCreating(false);
        });
    }

    function deletePost(messageId) {
        fetch(`https://cs571.org/api/f23/hw6/messages?id=${messageId}`, {
            method: 'DELETE',
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json",
            },
            credentials: "include"
        }).then(async res => {
            const json = await res.json();
            if (res.status === 200) {
                return json;
            } else {
                throw new Error(json.msg);
            }
        }).then(json => {
            alert(json.msg);
            loadMessages();
        }).catch(err => {
            alert(err.message);
        });
    }

    return <>
        <h1>{props.name} Chatroom</h1>
        {
            /* TODO: Allow an authenticated user to create a post. */
        }
        <hr />
        {
            <Row>
                {login ?
                    <Col md={4}>
                        <Form>
                            <FormGroup>
                                <FormLabel>
                                    Post Title
                                </FormLabel>
                                <FormControl ref={postTitleInput} />
                                <div style={{ height: '12px' }} />
                                <FormLabel>
                                    Post Content
                                </FormLabel>
                                <FormControl ref={postContentInput} />
                            </FormGroup>
                        </Form>
                        <Button variant='primary' style={{ marginTop: '16px' }} onClick={createPost} type="submit" disabled={creating}>Create Post</Button>
                    </Col> : <></>
                }
                {messages.length > 0 ?
                    <Col>
                        {
                            <>
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
                                                    {
                                                        login && loginStatus.username === message.poster ?
                                                            <div style={{ marginTop: "8px" }}>
                                                                <Button style={{ width: "100%" }} variant="danger" onClick={() => deletePost(message.id)}>Delete</Button>
                                                            </div> : <></>
                                                    }
                                                </div>
                                            </Col>
                                        })
                                    }
                                </Row>
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
                    </Col>
                    :
                    <>
                        <p>There are no messages on this page yet!</p>
                    </>}
            </Row>
        }
    </>
}
