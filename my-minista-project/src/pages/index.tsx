import "../assets/css/index.css"
import { BlogList } from "../components/blogList"
import { Suspense } from "react";

export default function () {
    return (
        <Suspense fallback={"loading! loading!"}>
            <BlogList />
        </Suspense>
    )
}