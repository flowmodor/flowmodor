'use client';

/* eslint-disable @typescript-eslint/no-throw-literal */

/* eslint-disable no-restricted-syntax */

/* eslint-disable no-await-in-loop */
import { Button } from '@nextui-org/button';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  // process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
);

export default function Invite() {
  const emails: string[] = [];

  const invite = async () => {
    for (const email of emails) {
      try {
        const { data, error } =
          await supabase.auth.admin.inviteUserByEmail(email);
        if (error) {
          console.error('Error inviting:', email, error);
          break;
        }
        console.log('Invitation sent to:', email, data);
      } catch (error) {
        console.error('Unexpected error for:', email, error);
        break;
      }
    }
  };

  const userId = '';
  const reinvite = async () => {
    try {
      // Retrieve user by user_id
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.admin.getUserById(userId);
      if (getUserError) throw getUserError;
      if (!user) throw new Error('User not found');

      // Delete the user's settings by user_id
      const { error: deleteSettingsError } = await supabase
        .from('settings')
        .delete()
        .eq('user_id', userId);
      if (deleteSettingsError) throw deleteSettingsError;

      // Delete the user
      const { error: deleteUserError } =
        await supabase.auth.admin.deleteUser(userId);
      if (deleteUserError) throw deleteUserError;

      // Re-invite the user by their email
      const { error: reinviteError } =
        await supabase.auth.admin.inviteUserByEmail(user.email!);
      if (reinviteError) throw reinviteError;

      console.log('User re-invited successfully:', user.email);
    } catch (error) {
      console.error('Error in re-inviting:', userId, error);
    }
  };

  return (
    <div>
      <Button onClick={invite}>Invite</Button>
      <Button onClick={reinvite}>Reinvite</Button>
    </div>
  );
}
