# Stories

Stories is an open source social media platform similar to Twitter that preserves all content generated on the platform (posts, comments and chats) for only 24 hours.

## Tech stack

- Next.js
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- NextUI
- Turso
- Drizzle
- Lucia
- Firebase
- Nodemailer

## Setup

> [!IMPORTANT]  
> First, you need to create a Firebase project, a Turso database and SMTP server.

1. Clone the repository
2. Install the dependencies

```
npm install
```

3. Rename the `.env.example` file to `.env` and fill the environment variables

> [!IMPORTANT]  
> To generate the FORGOT_PASSWORD_SECRET and CRON_SECRET run the following command (one per variable).
>
> ```
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

4. Run the development server and thats it!

```
npm run dev
```

## Author

David Aragundy
