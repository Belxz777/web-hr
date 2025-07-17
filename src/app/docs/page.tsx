
export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-card/95 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Документация</h1>
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Общая информация</h2>
          <p className="mb-4">
            Общие технические и не только параметры и свойства системы
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Уровни доступа к системе</h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Уровень доступа 1 (сотрудники) <pre>
                Возможность заполнения отчетов.
                </pre></li>
         <li className="mb-2">Уровень доступа 2 и 3 (начальники локальных отделов) <pre>
                Возможность заполнения отчетов , просмотра статистики по своему отделу и сотрудникам отдела.
                </pre></li>
            <li className="mb-2">Уровень доступа 4 (самый высокий уровень доступа директоры и управляющие)
                <p>
                Возможность заполнения отчетов , просмотра статистики по своему отделу и сотрудникам отдела и общей статистики по отделам, 
                 возможность добавления удаление изменения должностей и отделов также функций.
                </p>
                </li>
                     <li className="mb-2">Уровень доступа 5 (администратор системы)
                <pre>
               Все выше перечисленное + просмотр технических данных о работы сервера приложения . Возможность изменения паролей пользователей.
                </pre>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}
