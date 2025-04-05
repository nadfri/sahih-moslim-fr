-use NextJS 15, React 19, Tailwind v4
-For new component, use export function only
-comments are always in english
-params are promised in NextJs 15:
// Before
type Params = { slug: string }

export default function Layout({
children,
params,
}: {
children: React.ReactNode
params: Params
}) {
const { slug } = params
}

// After
import { use } from 'react'

type Params = Promise<{ slug: string }>

export default function Layout(props: {
children: React.ReactNode
params: Params
}) {
const params = use(props.params)
const slug = params.slug
}

// Before
type Params = { slug: string }
type SearchParams = { [key: string]: string | string[] | undefined }

export function generateMetadata({
params,
searchParams,
}: {
params: Params
searchParams: SearchParams
}) {
const { slug } = params
const { query } = searchParams
}

export default async function Page({
params,
searchParams,
}: {
params: Params
searchParams: SearchParams
}) {
const { slug } = params
const { query } = searchParams
}

// After
type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata(props: {
params: Params
searchParams: SearchParams
}) {
const params = await props.params
const searchParams = await props.searchParams
const slug = params.slug
const query = searchParams.query
}

export default async function Page(props: {
params: Params
searchParams: SearchParams
}) {
const params = await props.params
const searchParams = await props.searchParams
const slug = params.slug
const query = searchParams.query
}

'use client'

// Before
type Params = { slug: string }
type SearchParams = { [key: string]: string | string[] | undefined }

export default function Page({
params,
searchParams,
}: {
params: Params
searchParams: SearchParams
}) {
const { slug } = params
const { query } = searchParams
}

// After
import { use } from 'react'

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default function Page(props: {
params: Params
searchParams: SearchParams
}) {
const params = use(props.params)
const searchParams = use(props.searchParams)
const slug = params.slug
const query = searchParams.query
}
