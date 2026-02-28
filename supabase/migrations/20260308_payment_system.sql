-- Create payment_transactions table to track Razorpay Orders and status
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created', -- created, captured, failed, refunded
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add transaction fields to fee_payments for tracking source of payment
ALTER TABLE public.fee_payments 
ADD COLUMN IF NOT EXISTS transaction_id UUID REFERENCES public.payment_transactions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;

-- Enable RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_transactions
CREATE POLICY "Students can view their own transactions" 
ON public.payment_transactions FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all transactions" 
ON public.payment_transactions FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- Add Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON public.payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
