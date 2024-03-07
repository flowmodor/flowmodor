import { Select, SelectItem } from '@nextui-org/select';
import useTasksStore from '@/stores/useTasksStore';

export default function ListSelector() {
  const { lists, activeList, isLoadingLists, onListChange, fetchTasks } =
    useTasksStore((state) => state);

  return (
    <Select
      size="sm"
      radius="sm"
      selectionMode="single"
      label="Select a list"
      isLoading={isLoadingLists}
      classNames={{
        trigger: 'bg-secondary data-[hover=true]:bg-secondary',
        popoverContent: 'bg-background',
      }}
      selectedKeys={[activeList]}
      onChange={async (e) => {
        const isSuccess = onListChange(e);
        if (!isSuccess) {
          return;
        }
        await fetchTasks();
      }}
    >
      {lists.map((list) => (
        <SelectItem
          key={`${list.provider} - ${list.id}`}
          classNames={{
            base: 'data-[focus=true]:!bg-secondary data-[hover=true]:!bg-secondary',
          }}
        >
          {`${list.provider} - ${list.name}`}
        </SelectItem>
      ))}
    </Select>
  );
}
