
import React, { useEffect, useContext } from 'react';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';
import { useNavigate } from 'react-router';

export default function BadgerLogout() {
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loginStatus == undefined || loginStatus == null) {
            navigate("/");
            return;
        }
        fetch('https://cs571.org/api/f23/hw6/logout', {
            method: 'POST',
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include"
        }).then(async res => {
            const json = await res.json();
            if (res.status == 200) {
                return json;
            } else {
                throw new Error(json.msg);
            }
        }).then(json => {
            setLoginStatus(undefined);
            sessionStorage.setItem("userInfo", "");
            navigate("/");
        }).catch(err => {
            alert(err.message);
        });
    }, []);

    return <>
        <h1>Logout</h1>
        <p>You have been successfully logged out.</p>
    </>
}
