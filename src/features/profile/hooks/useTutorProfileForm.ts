import { useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  tutorProfileDefaultValues,
  tutorProfileSchema,
  type TutorProfileFormValues
} from '../schemas/profileSchemas';

const completionKeys: (keyof TutorProfileFormValues)[] = [
  'fullName',
  'email',
  'phone',
  'professionalTitle',
  'institution',
  'department',
  'degree',
  'specialization',
  'qualifications',
  'subjects',
  'courseCodes',
  'languages',
  'sessionTypes',
  'bio',
  'timezone'
];

export const useTutorProfileForm = () => {
  const methods = useForm<TutorProfileFormValues>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: tutorProfileDefaultValues,
    mode: 'onBlur'
  });

  const watchedValues = methods.watch(completionKeys);

  const profileCompletion = useMemo(() => {
    const completed = completionKeys.reduce((count, _key, index) => {
      const value = watchedValues[index];

      if (Array.isArray(value)) {
        return value.length ? count + 1 : count;
      }

      if (typeof value === 'number') {
        return Number.isFinite(value) ? count + 1 : count;
      }

      return value ? count + 1 : count;
    }, 0);

    return Math.round((completed / completionKeys.length) * 100);
  }, [watchedValues]);

  const addListItem = useCallback(
    (field: 'subjects' | 'courseCodes' | 'languages', nextValue: string, transform?: (value: string) => string) => {
      const rawValue = nextValue.trim();
      const normalizedValue = transform ? transform(rawValue) : rawValue;

      if (!normalizedValue) {
        return false;
      }

      const currentValues = methods.getValues(field);
      if (currentValues.includes(normalizedValue)) {
        return false;
      }

      methods.setValue(field, [...currentValues, normalizedValue], {
        shouldDirty: true,
        shouldValidate: true
      });

      return true;
    },
    [methods]
  );

  const removeListItem = useCallback(
    (field: 'subjects' | 'courseCodes' | 'languages', valueToRemove: string) => {
      const currentValues = methods.getValues(field);
      methods.setValue(
        field,
        currentValues.filter((item) => item !== valueToRemove),
        { shouldDirty: true, shouldValidate: true }
      );
    },
    [methods]
  );

  const toggleSessionType = useCallback(
    (sessionType: TutorProfileFormValues['sessionTypes'][number]) => {
      const currentTypes = methods.getValues('sessionTypes');
      if (currentTypes.includes(sessionType)) {
        methods.setValue(
          'sessionTypes',
          currentTypes.filter((type) => type !== sessionType),
          { shouldDirty: true, shouldValidate: true }
        );
        return;
      }

      methods.setValue('sessionTypes', [...currentTypes, sessionType], {
        shouldDirty: true,
        shouldValidate: true
      });
    },
    [methods]
  );

  return {
    methods,
    profileCompletion,
    addListItem,
    removeListItem,
    toggleSessionType
  };
};

export type UseTutorProfileFormReturn = ReturnType<typeof useTutorProfileForm>;
