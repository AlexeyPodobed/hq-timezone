// Значения, которыми управляет React Hook Form и которые handleSubmit передаёт
// в onSubmit. Этот же объект сериализуется Next.js при вызове Server Action.
export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
  keepUpdated: boolean;
}

// Один элемент серверного массива invalid_fields Contact Form 7.
// Поля optional, потому что ответ внешнего API нельзя считать гарантированным.
export interface ContactForm7InvalidField {
  field?: string;
  message?: string;
}

// Сырой формат внешнего WordPress API. UI не должен работать с ним напрямую:
// contactFormAdapter преобразует его в ContactFormSubmitResult.
export interface ContactForm7Response {
  status?: string;
  message?: string;
  invalid_fields?: ContactForm7InvalidField[];
}

// Получаем union "name" | "email" | "message" | "keepUpdated".
// Он не позволяет адаптеру создать ошибку для поля, которого нет в React-форме.
export type ContactFormFieldName = keyof ContactFormValues;

// Стабильный сериализуемый контракт между Server Action и Client Component.
// Partial означает, что ошибка может быть только у части полей; Record связывает
// каждое допустимое имя поля со строкой сообщения.
export interface ContactFormSubmitResult {
  isSuccess: boolean;
  message: string;
  validationErrors: Partial<Record<ContactFormFieldName, string>>;
}
