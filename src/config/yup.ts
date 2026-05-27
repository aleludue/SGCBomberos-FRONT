import * as yup from 'yup';

type TranslateFunction = (key: string, named?: Record<string, unknown>) => string;

export function configYupMsg(t: TranslateFunction) {
  yup.setLocale({
    mixed: {
      default: 'No es válido',
      required: t('Validations.Required'),
      oneOf: 'Debe ser uno de los siguientes valores: ${values}',
      notOneOf: 'No debe ser uno de los siguientes valores: ${values}',
      defined: 'Debe estar definido',
      notNull: 'No puede ser nulo',
      notType: 'Debe ser de tipo ${type}',
    },
    boolean: {
      isValue: 'Debe ser igual a ${value}',
    },
    string: {
      datetime: '${path} debe ser una fecha y hora ISO válida',
      datetime_offset: '${path} debe ser una fecha y hora ISO válida con la zona horaria UTC "Z"',
      datetime_precision:
        '${path} debe ser una fecha y hora ISO válida con una precisión de sub-segundos de exactamente ${precision} dígitos',
      length: t('Validations.TotalLength', { length: '${length}' }),
      min: t('Validations.MinLength', { min: '${min}' }),
      max: t('Validations.MaxLength', { max: '${max}' }),
      email: t('Validations.InvalidEmail'),
      url: 'Debe ser una URL válida',
      trim: 'No debe contener espacios al inicio o al final',
      lowercase: 'Debe estar en minúsculas',
      uppercase: 'Debe estar en mayúsculas',
      matches: 'Debe coincidir con el siguiente patrón: "${regex}"',
      uuid: '${path} debe ser un UUID válido',
    },
    number: {
      min: t('Validations.NumMin', { min: '${min}' }),
      max: 'Debe ser menor o igual a ${max}',
      lessThan: 'Debe ser menor a ${less}',
      moreThan: 'Debe ser mayor a ${more}',
      positive: 'Debe ser un número positivo',
      negative: 'Debe ser un número negativo',
      integer: t('Validations.NumInteger'),
    },
    date: {
      min: 'Debe ser posterior a ${min}',
      max: 'Debe ser anterior a ${max}',
    },
    object: {
      noUnknown: '${path} campo tiene llaves no especificadas: ${unknown}',
    },
    array: {
      length: '${path} debe de ser ${length} elementos',
      min: 'Debe tener al menos ${min} elementos',
      max: 'Debe tener como máximo ${max} elementos',
    },
    tuple: {
      notType: 'tupla no puede tener un miembro ${type}, solo ${expected} miembros',
    },
  });
}
