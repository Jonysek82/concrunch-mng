import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createMerchant,
  createPerformer,
  getMerchantsAdmin,
  getPerformersAdmin,
  getTags,
  updateMerchant,
  updatePerformer,
} from '@/api/catalog';
import { Card } from '@/components/ui/Card';
import { CheckboxGroup } from '@/components/ui/CheckboxGroup';
import { buttonClass, Field, FormMessage, inputClass } from '@/components/ui/FormField';
import type { ApiMerchant, ApiPerformer } from '@/types/api';
import { performerSchema, type PerformerFormValues } from './performerSchema';

const typeOptions = [
  { id: 'performer', label: 'Vystupující' },
  { id: 'vendor', label: 'Vendor' },
] as const;

export function PerformerFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const location = useLocation();
  const isMerchantRoute = location.pathname.startsWith('/admin/mista');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const defaultValues: PerformerFormValues = {
    type: isMerchantRoute ? 'vendor' : 'performer',
    name: '',
    description: '',
    imageUrl: '',
    website: '',
    tagIds: [],
    published: true,
  };

  const performersQuery = useQuery({
    queryKey: ['performers-admin'],
    queryFn: getPerformersAdmin,
    enabled: isEdit && !isMerchantRoute,
  });

  const merchantsQuery = useQuery({
    queryKey: ['merchants'],
    queryFn: getMerchantsAdmin,
    enabled: isEdit && isMerchantRoute,
  });

  const existingPerformer = performersQuery.data?.find((p) => p._id === id);
  const existingMerchant = merchantsQuery.data?.find((m) => m._id === id);
  const tags = useQuery({ queryKey: ['tags'], queryFn: getTags });

  const {
    register,
    watch,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PerformerFormValues>({ resolver: zodResolver(performerSchema), defaultValues });

  useEffect(() => {
    if (existingPerformer) {
      reset({
        type: 'performer',
        name: existingPerformer.name,
        description: existingPerformer.bio,
        imageUrl: existingPerformer.imageUrl ?? '',
        website: '',
        tagIds: existingPerformer.tagIds ? existingPerformer.tagIds.map((t) => t._id) : [],
        published: existingPerformer.published,
      });
    }
  }, [existingPerformer, reset]);

  useEffect(() => {
    if (existingMerchant) {
      reset({
        type: 'vendor',
        name: existingMerchant.name,
        description: existingMerchant.description,
        imageUrl: existingMerchant.imageUrl ?? '',
        website: existingMerchant.website ?? '',
        tagIds: existingMerchant.tagIds ? existingMerchant.tagIds.map((t) => t._id) : [],
        published: existingMerchant.published,
      });
    }
  }, [existingMerchant, reset]);

  const type = watch('type');
  const isVendor = type === 'vendor';

  const mutation = useMutation<ApiPerformer | ApiMerchant, Error, PerformerFormValues>({
    mutationFn: (v: PerformerFormValues) => {
      const common = { name: v.name, tagIds: v.tagIds, published: v.published };
      const imageUrl = v.imageUrl || undefined;

      if (v.type === 'vendor') {
        const merchantPayload = {
          ...common,
          description: v.description,
          imageUrl,
          website: v.website || undefined,
        };
        return id ? updateMerchant(id, merchantPayload) : createMerchant(merchantPayload);
      }

      const performerPayload = { ...common, bio: v.description, imageUrl };
      return id ? updatePerformer(id, performerPayload) : createPerformer(performerPayload);
    },
    onSuccess: (_data, v) => {
      queryClient.invalidateQueries({
        queryKey: [v.type === 'vendor' ? 'merchants' : 'performers-admin'],
      });
      navigate(v.type === 'vendor' || isMerchantRoute ? '/admin/mista' : '/admin/ucinkujici');
    },
  });

  const wantedTagTypes = isVendor ? ['merchant', 'general'] : ['performer', 'general'];
  const availableTags = (tags.data ?? []).filter((t) => wantedTagTypes.includes(t.type));
  const busy =
    mutation.isPending ||
    (isEdit && (isMerchantRoute ? merchantsQuery.isLoading : performersQuery.isLoading));

  const backLink = isMerchantRoute ? '/admin/mista' : '/admin/ucinkujici';
  const heading = isEdit
    ? isMerchantRoute
      ? 'Upravit místo / vendora'
      : 'Upravit účinkujícího'
    : isMerchantRoute
      ? 'Nové místo / vendor'
      : 'Nový účinkující';

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{heading}</h1>
        <Link to={backLink} className="text-sm text-muted hover:text-text">
          Zpět
        </Link>
      </div>
      <Card className="max-w-2xl">
        <form
          noValidate
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
          onChange={() => mutation.isSuccess && mutation.reset()}
          className="flex flex-col gap-4"
        >
          {!isEdit && (
            <fieldset>
              <legend className="mb-1 text-sm font-medium">Typ</legend>
              <div className="flex gap-4">
                {typeOptions.map((o) => (
                  <label key={o.id} className="flex items-center gap-2 text-sm">
                    <input type="radio" value={o.id} disabled={busy} {...register('type')} />
                    {o.label}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          <Field label={isVendor ? 'Název vendora' : 'Jméno'} error={errors.name?.message}>
            <input className={inputClass} disabled={busy} {...register('name')} />
          </Field>
          <Field label={isVendor ? 'Popis' : 'Bio'} error={errors.description?.message}>
            <textarea rows={3} className={inputClass} disabled={busy} {...register('description')} />
          </Field>
          <Field
            label={isVendor ? 'Logo – URL (nepovinné)' : 'Fotka / avatar – URL (nepovinné)'}
            error={errors.imageUrl?.message}
          >
            <input
              type="url"
              className={inputClass}
              placeholder="https://"
              disabled={busy}
              {...register('imageUrl')}
            />
          </Field>
          {isVendor && (
            <Field label="Web (nepovinné)" error={errors.website?.message}>
              <input
                type="url"
                className={inputClass}
                placeholder="https://"
                disabled={busy}
                {...register('website')}
              />
            </Field>
          )}
          <Controller
            control={control}
            name="tagIds"
            render={({ field }) => (
              <CheckboxGroup
                legend="Tagy"
                options={availableTags.map((t) => ({ id: t._id, label: t.name }))}
                value={field.value}
                onChange={field.onChange}
                disabled={busy}
                isLoading={tags.isLoading}
                error={tags.error ? 'Tagy se nepodařilo načíst' : undefined}
                empty="Zatím nejsou vytvořené tagy."
              />
            )}
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" disabled={busy} {...register('published')} />
            Zveřejnit v katalogu
          </label>
          {mutation.error && <FormMessage kind="error">{mutation.error.message}</FormMessage>}
          <button type="submit" className={`${buttonClass} self-start`} disabled={busy}>
            {mutation.isPending ? 'Ukládám...' : isEdit ? 'Uložit změny' : 'Vytvořit'}
          </button>
        </form>
      </Card>
    </>
  );
}