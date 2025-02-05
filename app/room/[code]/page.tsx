"use client";

import {useParams} from "next/navigation";

export default function Page() {
    const params = useParams();

    return <h1>{params.code}</h1>
}