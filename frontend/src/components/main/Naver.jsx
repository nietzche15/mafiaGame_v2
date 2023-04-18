import React, { useEffect } from "react";
import axios from 'axios';

export default function Naver() {
    useEffect(async () => {
        const code = new URL(window.location.href).searchParams.get("code");
        const state = new URL(window.location.href).searchParams.get("state");
        console.log('code : ' + code)
        console.log('state : ' + state)
        const client_id = '27NfAweZlVIdEWFecF3p'
        const client_secret = 'EKdY0J7T_4'
        const redirectURI = 'http://localhost:3000/naver'

        const res = await axios.get(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirectURI}&code=${code}&state=${state}`,
            {
                headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
            })
        console.log(res)
        // const res2 = await axios.get('https://openapi.naver.com/v1/nid/me',
        //     {
        //         headers: {
        //             Authorization: res.data.token_type + ' ' + res.data.access_token
        //         }
        //     })
        // console.log(res2)

    }, [])

    return (
        <div>Naver</div>
    )
}
