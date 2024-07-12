import CircleLoading from "@/components/animation/CircleLoading";
import React from "react";

export default function Loading() {
    return (
        <div className={'w-full h-vh flex flex-col items-center justify-center'}>
            <CircleLoading/>
        </div>
    )
}
