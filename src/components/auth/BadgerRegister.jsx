import React, { useState, useRef, useEffect, useContext } from 'react';
import { Button, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';
import { useNavigate } from 'react-router';

export default function BadgerRegister() {
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    const userNameInput = useRef();
    const passwordInput = useRef();
    const confirmPasswordInput = useRef();

    const [submitting, setSubmitting] = useState(false);
    

    const navigate = useNavigate();

    useEffect(() => {
        if (loginStatus !== undefined && loginStatus !== null) {
            console.log(loginStatus);
            navigate("/");
        }
    }, [loginStatus]);

    function onRegister() {
        const username = userNameInput.current.value;
        const password = passwordInput.current.value;
        const confirmPassword = confirmPasswordInput.current.value;
        if (username.length === 0 || password.length === 0 || confirmPassword.length === 0) {
            alert('You must provide both a username and password!');
            return;
        }
        if (password !== confirmPassword) {
            alert('Your passwords do not match!');
            return;
        }
        setSubmitting(true);
        fetch("https://cs571.org/api/f23/hw6/register", {
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
        <h1>Register</h1>
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
                <div style={{ height: '12px' }} />
                <FormLabel>
                    Repeat Password
                </FormLabel>
                <FormControl type='password' ref={confirmPasswordInput} />
            </FormGroup>
        </Form>
        <Button variant='primary' style={{ marginTop: '16px' }} onClick={onRegister} type="submit" disabled={submitting}>Register</Button>
    </>
}
