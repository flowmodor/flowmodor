import { useEffect, useState } from 'react';
import getClient from '@/utils/todoist';

export interface List {
  provider: string;
  name: string;
  id: string;
}

export default function useLists() {
  const [lists, setLists] = useState<List[]>([
    {
      provider: 'Flowmodor',
      name: 'Default',
      id: 'default',
    },
  ]);

  useEffect(() => {
    (async () => {
      const todoist = await getClient();
      if (todoist) {
        const data = await todoist.getProjects();
        const todoistLists = data.map((list) => ({
          provider: 'Todoist',
          name: list.name,
          id: list.id,
        }));
        todoistLists.unshift({
          provider: 'Todoist',
          name: 'All',
          id: 'all',
        });
        setLists([...lists, ...todoistLists]);
      }
    })();
  }, []);

  return { lists };
}
