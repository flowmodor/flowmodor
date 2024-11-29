# Contributing

We welcome everyone to contribute to Flowmodor. This document is to help you understand the process of contributing and ensure a smooth experience. Whether you're fixing a bug, adding a new feature, or improving the documentation, your help is appreciated.

## Web App Development

1. Clone the repository
```
git clone https://github.com/flowmodor/flowmodor
```
2. Navigate to the project directory
```
cd flowmodor
```
3. Install dependencies
```
pnpm i
```
4. Run Supabase
```
pnpm --filter server start
```
5. Create `apps/web/.env.local` file with following content (replace `API URL` and `anon key` with the output string from step 4.):
```text
NEXT_PUBLIC_SUPABASE_URL="API URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="anon key"
```
6. Run the web app and you should be able to see the app running on http://localhost:3000.
```
pnpm --filter web dev
```

## Finding a task

You can work on features that is on our [feedback board](https://app.flowmodor.com/feedback).

Please make sure to create an issue for the task you are working on. This will help us to track the progress and avoid duplication of work.

## Coding Style

- Make sure you format the code with Prettier before PR.
- The commit message should follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
