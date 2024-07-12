import React from "react";
import Head from "next/head";
import LoginView from "@/views/loginView";

export default function Page() {

    return (
        <div>
            <Head>
                <title>Home - ePass App</title>
            </Head>
            <LoginView/>
        </div>
    )
}
