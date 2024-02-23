'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  console.log('formData', formData);
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

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
