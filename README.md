![banner-dark](https://github.com/flowmodor/flowmodor/assets/74842863/93f7892e-2e94-4239-809b-1d76a2666c5e)

Flowmodor is an open-source flowmodoro timer web app based on the Flowtime Technique, an alternative to the Pomodoro Technique.

## What is the Flowtime Technique?

The Flowtime Technique is a flexible productivity method, focusing on work efficiency. It diverges from fixed intervals like the Pomodoro Technique, allowing users to work uninterrupted until they decide to take a break. Break times are then set to a fraction of the focus period, typically one-fifth.

For a detailed explanation, read more about it on [this blog](https://flowmodor.com/blog/flowtime-technique-the-best-pomodoro-alternative-for-time-management).

## Features

- 🕒 **Flowmodoro Timer:** Counts up during work and down for breaks, based on your focus duration.
- 📋 **Task List:** Organizes and manages tasks, integrating seamlessly with focus sessions.
- 📊 **Focus Report:** Tracks and summarizes work and break patterns for enhanced productivity insights.

> [!NOTE]
> To stay up to date with all the latest news and updates, make sure to follow us on X [@Flowmodor](https://twitter.com/flowmodor).

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
