'use client';

import { createClient } from '@supabase/supabase-js';
import { Button } from '@nextui-org/button';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
);

export default function Invite() {
  const emails = [
  ];

  const invite = async () => {
    emails.forEach(async (email) => {
      const { data, error } =
        await supabase.auth.admin.inviteUserByEmail(email);
      console.log(data, error);
    });
  };

  return <Button onClick={invite}>Invite</Button>;
}
