import { z } from 'zod';

export const productStatusSchema = z.enum(['active', 'inactive', 'deleted']);

export const productCreateSchema = z.object({
  name: z.string().trim().min(1, 'El título es obligatorio'),
  description: z.string().trim().min(1, 'La descripción es obligatoria'),
  price: z.coerce.number({ invalid_type_error: 'El precio debe ser un número' }).min(0, 'El precio no puede ser negativo'),
  category: z.string().trim().min(1, 'La categoría es obligatoria'),
  stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo').default(0),
  imageUrl: z.string().trim().min(1, 'La imagen de portada es obligatoria'),
  images: z.array(z.string().trim().min(1)).optional().default([]),
  status: z.enum(['active', 'inactive']).optional().default('active'),
  costPrice: z.coerce.number().min(0).optional().default(0)
});

export const productUpdateSchema = productCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Debe enviar al menos un campo para actualizar' }
);

export const productQuerySchema = z.object({
  search: z.string().optional().default(''),
  category: z.string().optional().default(''),
  status: z.enum(['active', 'inactive', 'deleted', 'all']).optional().default('all'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10)
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
