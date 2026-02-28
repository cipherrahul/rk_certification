import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Use Service Role key for backend operations to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
        return NextResponse.json({ error: 'No signature found' }, { status: 400 })
    }

    // Verify signature
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(body)
        .digest('hex')

    if (expectedSignature !== signature) {
        console.error('Invalid Razorpay Signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)

    if (event.event === 'payment.captured') {
        const payment = event.payload.payment.entity
        const orderId = payment.order_id
        const paymentId = payment.id

        try {
            // 1. Check if transaction already processed (Idempotency)
            const { data: transaction, error: fetchError } = await supabaseAdmin
                .from('payment_transactions')
                .select('*')
                .eq('razorpay_order_id', orderId)
                .single()

            if (fetchError || !transaction) {
                console.error('Transaction not found for order:', orderId)
                return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
            }

            if (transaction.status === 'captured') {
                return NextResponse.json({ message: 'Already processed' })
            }

            // 2. Wrap everything in a logical transaction (manual steps since we are using Admin client)
            // Update transaction status
            const { error: updateError } = await supabaseAdmin
                .from('payment_transactions')
                .update({
                    status: 'captured',
                    razorpay_payment_id: paymentId,
                    razorpay_signature: signature,
                    updated_at: new Date().toISOString()
                })
                .eq('razorpay_order_id', orderId)

            if (updateError) throw updateError

            // Get student details for the receipt
            const { data: student } = await supabaseAdmin
                .from('students')
                .select('id, student_id')
                .eq('id', transaction.student_id)
                .single()

            // 3. Create record in fee_payments
            const { error: feeError } = await supabaseAdmin
                .from('fee_payments')
                .insert({
                    student_id: transaction.student_id,
                    payment_date: new Date().toISOString(),
                    month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
                    paid_amount: transaction.amount,
                    remaining_amount: 0, // In a real system, you'd calculate this based on previous payments
                    payment_mode: 'UPI (Razorpay)',
                    receipt_number: `UPI-${Date.now()}-${student?.student_id || 'UNK'}`,
                    transaction_id: transaction.id,
                    razorpay_payment_id: paymentId,
                    notes: `UPI Payment via Razorpay. Order: ${orderId}`
                })

            if (feeError) throw feeError

            console.log('Payment processed successfully for order:', orderId)
            return NextResponse.json({ status: 'ok' })

        } catch (error: any) {
            console.error('Webhook processing error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }
    }

    return NextResponse.json({ status: 'ignored' })
}
