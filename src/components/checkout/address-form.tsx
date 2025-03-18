// components/checkout/address-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CheckSquare, Square } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { fetchUserAddresses } from '@/lib/api/user';
import { toast } from 'react-toastify';

interface AddressFormProps {
  onSubmit: (shippingAddress: any, billingAddress: any) => void;
  initialShippingAddress?: any;
  initialBillingAddress?: any;
}

export const AddressForm = ({
  onSubmit,
  initialShippingAddress,
  initialBillingAddress,
}: AddressFormProps) => {
  const { user } = useAuth();
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<number | null>(null);
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<number | null>(null);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  
  // React Hook Form for shipping address
  const {
    register: registerShipping,
    handleSubmit: handleSubmitShipping,
    formState: { errors: shippingErrors },
    setValue: setShippingValue,
  } = useForm({
    defaultValues: initialShippingAddress || {
      full_name: user?.first_name ? `${user.first_name} ${user.last_name}` : '',
      street_address: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'United States',
      phone: user?.phone_number || '',
    },
  });
  
  // React Hook Form for billing address
  const {
    register: registerBilling,
    handleSubmit: handleSubmitBilling,
    formState: { errors: billingErrors },
    setValue: setBillingValue,
  } = useForm({
    defaultValues: initialBillingAddress || {
      full_name: user?.first_name ? `${user.first_name} ${user.last_name}` : '',
      street_address: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'United States',
      phone: user?.phone_number || '',
    },
  });
  
  // Fetch saved addresses on component mount
  useEffect(() => {
    const getAddresses = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const addresses = await fetchUserAddresses();
        setSavedAddresses(addresses);
        
        // Auto-select default addresses if available
        const defaultShipping = addresses.find(
          (addr) => addr.address_type === 'shipping' && addr.is_default
        );
        
        const defaultBilling = addresses.find(
          (addr) => addr.address_type === 'billing' && addr.is_default
        );
        
        if (defaultShipping) {
          setSelectedShippingAddressId(defaultShipping.id);
          populateShippingForm(defaultShipping);
        }
        
        if (defaultBilling) {
          setSelectedBillingAddressId(defaultBilling.id);
          populateBillingForm(defaultBilling);
        }
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
        toast.error('Failed to load saved addresses');
      } finally {
        setIsLoading(false);
      }
    };
    
    getAddresses();
  }, [user]);
  
  // Helper to populate shipping form
  const populateShippingForm = (address: any) => {
    setShippingValue('full_name', address.full_name || '');
    setShippingValue('street_address', address.street_address || '');
    setShippingValue('city', address.city || '');
    setShippingValue('state', address.state || '');
    setShippingValue('postal_code', address.postal_code || '');
    setShippingValue('country', address.country || 'United States');
    setShippingValue('phone', address.phone || '');
  };
  
  // Helper to populate billing form
  const populateBillingForm = (address: any) => {
    setBillingValue('full_name', address.full_name || '');
    setBillingValue('street_address', address.street_address || '');
    setBillingValue('city', address.city || '');
    setBillingValue('state', address.state || '');
    setBillingValue('postal_code', address.postal_code || '');
    setBillingValue('country', address.country || 'United States');
    setBillingValue('phone', address.phone || '');
  };
  
  // Handle saved shipping address selection
  const handleShippingAddressSelect = (addressId: number) => {
    const address = savedAddresses.find((addr) => addr.id === addressId);
    if (address) {
      setSelectedShippingAddressId(addressId);
      populateShippingForm(address);
    }
  };
  
  // Handle saved billing address selection
  const handleBillingAddressSelect = (addressId: number) => {
    const address = savedAddresses.find((addr) => addr.id === addressId);
    if (address) {
      setSelectedBillingAddressId(addressId);
      populateBillingForm(address);
    }
  };
  
  // Handle form submission
  const onSubmitForm = (shippingData: any) => {
    handleSubmitBilling((billingData) => {
      const shipping = {
        ...shippingData,
        address_type: 'shipping',
      };
      
      const billing = sameAsBilling 
        ? { ...shippingData, address_type: 'billing' }
        : { ...billingData, address_type: 'billing' };
      
      onSubmit(shipping, billing);
    })();
  };
  
  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium">Shipping Address</h2>
        </div>
        
        <div className="p-6">
          {/* Saved Shipping Addresses */}
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : savedAddresses.filter(addr => addr.address_type === 'shipping').length > 0 ? (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Saved Addresses</h3>
              <div className="space-y-3">
                {savedAddresses
                  .filter(addr => addr.address_type === 'shipping')
                  .map((address) => (
                    <div
                      key={address.id}
                      className={`border rounded-md p-3 cursor-pointer ${
                        selectedShippingAddressId === address.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={() => handleShippingAddressSelect(address.id)}
                    >
                      <div className="flex items-start">
                        <div className="mr-2 mt-0.5">
                          {selectedShippingAddressId === address.id ? (
                            <CheckSquare size={16} className="text-black" />
                          ) : (
                            <Square size={16} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{address.full_name}</div>
                          <div className="text-sm text-gray-600">
                            {address.street_address}, {address.city}, {address.state} {address.postal_code}
                          </div>
                          <div className="text-sm text-gray-600">
                            {address.country}
                          </div>
                          {address.is_default && (
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded mt-1 inline-block">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}
          
          {/* Shipping Address Form */}
          <form onSubmit={handleSubmitShipping(onSubmitForm)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...registerShipping('full_name', { required: 'Full name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                {shippingErrors.full_name && (
                  <p className="text-red-600 text-sm mt-1">
                    {shippingErrors.full_name.message}
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  {...registerShipping('street_address', { required: 'Street address is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                {shippingErrors.street_address && (
                  <p className="text-red-600 text-sm mt-1">
                    {shippingErrors.street_address.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  {...registerShipping('city', { required: 'City is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                {shippingErrors.city && (
                  <p className="text-red-600 text-sm mt-1">
                    {shippingErrors.city.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  {...registerShipping('state', { required: 'State is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                {shippingErrors.state && (
                  <p className="text-red-600 text-sm mt-1">
                    {shippingErrors.state.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  {...registerShipping('postal_code', { required: 'Postal code is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                {shippingErrors.postal_code && (
                  <p className="text-red-600 text-sm mt-1">
                    {shippingErrors.postal_code.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  {...registerShipping('country', { required: 'Country is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                </select>
                {shippingErrors.country && (
                  <p className="text-red-600 text-sm mt-1">
                    {shippingErrors.country.message}
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...registerShipping('phone', { required: 'Phone number is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                {shippingErrors.phone && (
                  <p className="text-red-600 text-sm mt-1">
                    {shippingErrors.phone.message}
                  </p>
                )}
              </div>
            </div>
            
            {/* Same as billing checkbox */}
            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(e) => setSameAsBilling(e.target.checked)}
                  className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Use shipping address as billing address
                </span>
              </label>
            </div>
          </form>
        </div>
      </div>
      
      {/* Billing Address Form (shown if not same as shipping) */}
      {!sameAsBilling && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium">Billing Address</h2>
          </div>
          
          <div className="p-6">
            {/* Saved Billing Addresses */}
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : savedAddresses.filter(addr => addr.address_type === 'billing').length > 0 ? (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Saved Addresses</h3>
                <div className="space-y-3">
                  {savedAddresses
                    .filter(addr => addr.address_type === 'billing')
                    .map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-md p-3 cursor-pointer ${
                          selectedBillingAddressId === address.id
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        onClick={() => handleBillingAddressSelect(address.id)}
                      >
                        <div className="flex items-start">
                          <div className="mr-2 mt-0.5">
                            {selectedBillingAddressId === address.id ? (
                              <CheckSquare size={16} className="text-black" />
                            ) : (
                              <Square size={16} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{address.full_name}</div>
                            <div className="text-sm text-gray-600">
                              {address.street_address}, {address.city}, {address.state} {address.postal_code}
                            </div>
                            <div className="text-sm text-gray-600">
                              {address.country}
                            </div>
                            {address.is_default && (
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded mt-1 inline-block">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : null}
            
            {/* Billing Address Form */}
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...registerBilling('full_name', { required: 'Full name is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {billingErrors.postal_code && (
                    <p className="text-red-600 text-sm mt-1">
                      {billingErrors.postal_code.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    {...registerBilling('country', { required: 'Country is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                  </select>
                  {billingErrors.country && (
                    <p className="text-red-600 text-sm mt-1">
                      {billingErrors.country.message}
                    </p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...registerBilling('phone', { required: 'Phone number is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {billingErrors.phone && (
                    <p className="text-red-600 text-sm mt-1">
                      {billingErrors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmitShipping(onSubmitForm)}
          className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};:outline-none focus:ring-2 focus:ring-black"
                  />
                  {billingErrors.full_name && (
                    <p className="text-red-600 text-sm mt-1">
                      {billingErrors.full_name.message}
                    </p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    {...registerBilling('street_address', { required: 'Street address is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {billingErrors.street_address && (
                    <p className="text-red-600 text-sm mt-1">
                      {billingErrors.street_address.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    {...registerBilling('city', { required: 'City is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {billingErrors.city && (
                    <p className="text-red-600 text-sm mt-1">
                      {billingErrors.city.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    {...registerBilling('state', { required: 'State is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {billingErrors.state && (
                    <p className="text-red-600 text-sm mt-1">
                      {billingErrors.state.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    {...registerBilling('postal_code', { required: 'Postal code is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus