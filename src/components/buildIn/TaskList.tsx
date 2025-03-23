import { task } from "@/types"

export function TaskList({ tasks,isComp }: { tasks: task[] | undefined,isComp?:boolean }) {
  if (!tasks || tasks.length === 0) {
    return <EmptyTasksAnimation/>   
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task: task, index: number) => (
        <li key={index} className="bg-gray-700 rounded-xl p-4 shadow-md">
          <h4 className="text-lg font-semibold">{task.taskName}</h4>
          <p className="text-gray-300">{task.taskDescription}</p>
          
          {
             task.hourstodo > 0 && (
              <p className="text-gray-400">
                {`Часов до завершения: ${task.hourstodo} (${task.hourstodo * 60} мин)`}
              </p>
            )
          }
    
          <p className="text-gray-400">
            Дата закрытия: {task.closeDate ? new Date(task.closeDate).toLocaleString('ru-RU') : 'Не указана'}
          </p>
          {
            task.hourstodo <= 0 && task.isExpired && (
              <p className="text-gray-200 font-bold underline decoration-red-500 underline-offset-4">
                Завершено, но с опозданием
              </p>
            )
          }     
        </li>
      ))}
    </ul>
  )
}


function EmptyTasksAnimation() {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <svg className="w-24 h-24 mb-4" viewBox="0 0 100 100">
          <rect x="20" y="20" width="60" height="60" fill="none" stroke="#6B7280" strokeWidth="4">
            <animate
              attributeName="stroke-dasharray"
              from="0 240"
              to="240 240"
              dur="1.5s"
              fill="freeze"
            />
          </rect>
          <line x1="30" y1="40" x2="70" y2="40" stroke="#6B7280" strokeWidth="4">
            <animate
              attributeName="stroke-dasharray"
              from="0 40"
              to="40 40"
              dur="1.5s"
              fill="freeze"
            />
          </line>
          <line x1="30" y1="50" x2="70" y2="50" stroke="#6B7280" strokeWidth="4">
            <animate
              attributeName="stroke-dasharray"
              from="0 40"
              to="40 40"
              dur="1.5s"
              fill="freeze"
              begin="0.3s"
            />
          </line>
          <line x1="30" y1="60" x2="70" y2="60" stroke="#6B7280" strokeWidth="4">
            <animate
              attributeName="stroke-dasharray"
              from="0 40"
              to="40 40"
              dur="1.5s"
              fill="freeze"
              begin="0.6s"
            />
          </line>
        </svg>
        <p className="text-gray-400 text-center">Нет задач</p>
      </div>
    )
  }
  
  