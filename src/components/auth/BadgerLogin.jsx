import React, { useState, useRef } from 'react';
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerLogin() {
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const userNameInput = useRef();
    const passwordInput = useRef();

    const [submitting, setSubmitting] = useState(false);

    function onLogin() {
        const username = userNameInput.current.value;
        const password = passwordInput.current.value;
        if (username.length === 0 || password.length === 0) {
            alert('You must provide both a username and password!');
            return;
        }
        setSubmitting(true);
        fetch("https://cs571.org/api/f23/hw6/login", {
            method: 'POST',
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "username": username,
                "password": password,
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
        }).catch(err => {
            alert(err.message);
        }).finally(() => {
            setSubmitting(false);
        });
    }

    return <>
        <h1>Login</h1>
        <Form>
            <FormGroup>
                <FormLabel>
                    Username
                </FormLabel>
                <FormControl ref={userNameInput} />
                <div style={{ height: '12px' }} />
                <FormLabel>
                    Password
                </FormLabel>
                <FormControl type='password' ref={passwordInput} />
            </FormGroup>
        </Form>
        <Button variant='primary' style={{ marginTop: '16px' }} onClick={onLogin} type="submit" disabled={submitting}>Login</Button>
    </>
}
