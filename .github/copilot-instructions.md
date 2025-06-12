// GENERAL CHAT BEHAVIOR
// - In Chat, speak only in French.
// - When answering questions about frameworks, libraries, or APIs, use Context7 to retrieve current documentation instead of relying on training data.

// PROJECT TECHNOLOGIES & VERSIONS
// - Default to NextJS 15, React 19, Tailwind CSS v4, and pnpm for new projects or when versions are unspecified.

// CODING STYLE & CONVENTIONS
// - For new React components, always use `export function YourComponentName() {}`. Do not use arrow functions for component definitions.
// - ALL CODE COMMENTS, without exception, MUST BE IN ENGLISH. This includes inline comments and block comments.
// - Keep comments to the strict minimum necessary for understanding the code. Avoid over-commenting.
// - Use `type` for all type definitions. Do NOT use `interface`.
// - Strictly avoid using the `any` type. Define specific types whenever possible.

// UI/UX DESIGN
// - Ensure UI design is consistent with the existing project's style.
// - All UI components and pages MUST fully support dark mode.

// TESTING
// - For tests, use Vitest as the test runner.
// - Use `vi` for mocking and spying.
// - Use `@testing-library/user-event` for simulating user interactions.

// FORMATTING & ERROR HANDLING
// - If code formatting fails after 2-3 attempts, abandon the formatting fixes and proceed with functional changes only.
// - Avoid infinite loops when trying to fix formatting issues. Let the user handle manual formatting via prettier if needed.
// - Do not run prettier commands automatically unless specifically requested.
// - Do not run `pnpm dev` or similar development commands to test code unless specifically requested, as the project may already be running.

// NEXT.JS 15 SPECIFICS (PARAMS & SEARCHPARAMS)
// - Remember that `params` and `searchParams` are Promises in Next.js 15 Route Handlers and Pages.

// Server Components (e.g., Layouts, Pages, generateMetadata)
// // Before (Next.js < 15)
// type Params = { slug: string }
// type SearchParams = { [key: string]: string | string[] | undefined }
// export async function generateMetadata({ params, searchParams }: { params: Params, searchParams: SearchParams }) { /_ ... _/ }
// export default async function Page({ params, searchParams }: { params: Params, searchParams: SearchParams }) { /_ ... _/ }

// // After (Next.js 15+)
// type ParamsPromise = Promise<{ slug: string }>
// type SearchParamsPromise = Promise<{ [key: string]: string | string[] | undefined }>
// export async function generateMetadata(props: { params: ParamsPromise, searchParams: SearchParamsPromise }) {
// const params = await props.params;
// const searchParams = await props.searchParams;
// // const { slug } = params;
// // const { query } = searchParams;
// }
// export default async function Page(props: { params: ParamsPromise, searchParams: SearchParamsPromise }) {
// const params = await props.params;
// const searchParams = await props.searchParams;
// // const { slug } = params;
// // const { query } = searchParams;
// }

// Client Components
// // Before (Next.js < 15)
// type Params = { slug: string }
// type SearchParams = { [key: string]: string | string[] | undefined }
// export default function PageClient({ params, searchParams }: { params: Params, searchParams: SearchParams }) { /_ ... _/ }

// // After (Next.js 15+)
// import { use } from 'react';
// type ParamsPromise = Promise<{ slug: string }>
// type SearchParamsPromise = Promise<{ [key: string]: string | string[] | undefined }>
// export default function PageClient(props: { params: ParamsPromise, searchParams: SearchParamsPromise }) {
// const params = use(props.params);
// const searchParams = use(props.searchParams);
// // const { slug } = params;
// // const { query } = searchParams;
// }
