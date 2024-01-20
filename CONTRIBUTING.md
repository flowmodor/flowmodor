# Contributing

We welcome everyone to contribute to Flowmodor. This document is to help you understand the process of contributing and ensure a smooth experience. Whether you're fixing a bug, adding a new feature, or improving the documentation, your help is appreciated.

## Development

1. Clone the repository: `git clone https://github.com/flowmodor/flowmodor`
2. Navigate to the project directory: `cd flowmodor`
3. Install dependencies: `yarn`
4. Run Supabase: `npx supabase start`
5. Create `.env.local` file with following content (replace `API URL` and `anon key` with the output string from step 4.):

```text
NEXT_PUBLIC_SUPABASE_URL="API URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="anon key"
```

6. Run the web app: `yarn run dev`
7. Create a user at [Authentication tab](http://127.0.0.1:54323/project/default/auth/users) and then you can login with it.

## Finding a task

Bugs or planned enhancement can be found in [Issue tab](https://github.com/flowmodor/flowmodor/issues).

New features need to be discussed with the core team and the community first. If you're tackling a feature, please make sure it has been already discussed in the [Discussions tab](https://github.com/flowmodor/flowmodor/discussions/categories/feature-request). We kindly ask contributors to use the discussion comment section to propose a solution before opening a pull request.

## Coding Style

- Make sure you format the code with Prettier before PR.
- The commit message should follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
