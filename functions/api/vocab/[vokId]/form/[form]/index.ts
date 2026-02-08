import { createClient } from '../../../../db/client';
import { VOC, FORM } from '../../../../db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { vokId: string; form: string } }
) {
  try {
    const { vokId, form } = params;
    
    const db = createClient();
    
    // Try to find the form in the FORM table
    const formRecord = await db
      .select()
      .from(FORM)
      .where(and(
        eq(FORM.vokId, vokId),
        eq(FORM.form, decodeURIComponent(form))
      ))
      .limit(1);

    if (formRecord.length > 0) {
      return Response.json({
        success: true,
        data: formRecord[0]
      });
    }

    // If not found in FORM table, try to find similar forms
    const similarForms = await db
      .select()
      .from(FORM)
      .where(eq(FORM.vokId, vokId))
      .limit(10);

    return Response.json({
      success: false,
      message: 'Form not found',
      similarForms: similarForms
    });

  } catch (error) {
    console.error('Error fetching form:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
