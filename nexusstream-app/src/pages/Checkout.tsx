import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Authcontext';
import { useCart } from '../context/CartContext';

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth();
  const { items, clearCart } = useCart();

  const [step, setStep] = useState<number>(1);
  const [address, setAddress] = useState<string>('');
  
  // Payment Details
  const [cardName, setCardName] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvc, setCvc] = useState<string>('');

  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setExpiry(val);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvc(val);
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setServerError(null);

    try {
      await axios.post('/api/orders', {
        items,
        address,
        payment: {
          name: cardName,
          number: cardNumber,
          expiry,
          cvc,
        },
      });

      clearCart();
      setCompleted(true);
    } catch (err) {
      setServerError('Transaction failed. Please verify your credentials and try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center" data-test="order-success">
        <h2 className="text-2xl font-bold text-green-400 mb-4">Transaction Confirmed</h2>
        <p className="text-gray-300 mb-6">Your order has been placed and is currently processing.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {serverError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
          {serverError}
        </div>
      )}

      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        {['Review Cart', 'Shipping Coordinates', 'Payment Method'].map((label, idx) => (
          <div
            key={label}
            className={`flex items-center gap-2 ${
              step === idx + 1 ? 'text-blue-400 font-bold' : 'text-gray-500'
            }`}
          >
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">
              {idx + 1}
            </span>
            <span className="text-xs uppercase tracking-wider hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Cart Review */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-lg font-mono text-white">01 // REVIEW ORDER</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-white/5 p-4 rounded border border-white/5"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="font-mono text-sm text-white">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <span className="text-sm text-gray-400">Total Due:</span>
            <span className="text-xl font-mono text-blue-400">${calculateTotal().toFixed(2)}</span>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={items.length === 0}
            data-test="checkout-step-1-next"
            className="w-full py-4 bg-blue-600 text-white font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-all disabled:opacity-50"
          >
            Proceed to Shipping
          </button>
        </div>
      )}

      {/* Step 2: Shipping */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-lg font-mono text-white">02 // SHIPPING ADDRESS</h2>
          
          <textarea
            data-test="checkout-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter full shipping address..."
            className="w-full bg-white/5 border border-white/10 rounded-sm p-4 font-mono text-xs text-white focus:outline-none focus:border-blue-500/50 min-h-24"
          />

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="py-4 px-6 bg-white/5 text-gray-300 font-mono text-xs uppercase hover:bg-white/10"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!address.trim()}
              data-test="checkout-step-2-next"
              className="flex-1 py-4 bg-blue-600 text-white font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-lg font-mono text-white">03 // PAYMENT INFORMATION</h2>

          <div className="space-y-4">
            <input
              type="text"
              data-test="checkout-card-name"
              placeholder="Cardholder Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-sm p-3 font-mono text-xs text-white focus:outline-none focus:border-blue-500/50"
            />

            <input
              type="text"
              data-test="checkout-card-number"
              placeholder="Card Number (16 digits)"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className="w-full bg-white/5 border border-white/10 rounded-sm p-3 font-mono text-xs text-white focus:outline-none focus:border-blue-500/50"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                data-test="checkout-expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                className="bg-white/5 border border-white/10 rounded-sm p-3 font-mono text-xs text-white focus:outline-none focus:border-blue-500/50"
              />
              <input
                type="text"
                data-test="checkout-cvc"
                placeholder="CVC"
                value={cvc}
                onChange={handleCvcChange}
                className="bg-white/5 border border-white/10 rounded-sm p-3 font-mono text-xs text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              disabled={checkoutLoading}
              className="py-4 px-6 bg-white/5 text-gray-300 font-mono text-xs uppercase hover:bg-white/10 disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleCheckout}
              disabled={
                checkoutLoading ||
                !cardName.trim() ||
                cardNumber.replace(/\s/g, '').length !== 16 ||
                expiry.length !== 5 ||
                cvc.length < 3
              }
              data-processing={checkoutLoading ? 'true' : 'false'}
              className="flex-1 py-4 bg-blue-600 text-white font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              data-test="checkout-complete"
            >
              {checkoutLoading ? 'Processing...' : 'Confirm Transaction'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;