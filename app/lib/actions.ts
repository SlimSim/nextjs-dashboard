'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  console.log('formData', formData);
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    console.log('validateFields', validatedFields);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Faild to Create Invoice',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    console.error(error);
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

  //  const rawFormData2 = Object.fromEntries(formData.entries());
  //  console.log('rawFormData2', rawFormData2);
}

export async function deleteInvoice(id: string) {
  throw new Error('XX Failed to Delete Invoice');
  console.log('delete form with id ', id);

  try {
    await sql`
      delete from invoices
      where id=${id}
    `;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    console.error(error);
    return {
      message: 'Database Error: failed to Delete Invoice',
    };
  }
}

export async function updateInvoice(id: string, formData: FormData) {
  console.log('formData', formData);
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  console.log('updateData', { customerId, amount, status, id });

  const amountInCents = amount * 100;
  //  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      update invoices 
      set customer_id=${customerId},
          amount=${amountInCents},
          status = ${status}
      where id=${id}
    `;
  } catch (error) {
    console.error(error);
    return {
      message: 'Database Error: failed to Update Invoice',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

  //  const rawFormData2 = Object.fromEntries(formData.entries());
  //  console.log('rawFormData2', rawFormData2);
}
